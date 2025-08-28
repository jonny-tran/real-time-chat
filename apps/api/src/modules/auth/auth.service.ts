/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/users.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDTO } from './dto/login.dto';
import { ForgotDTO } from './dto/forgot.dto';
import { ResetDTO } from './dto/reset.dto';

@Injectable()
export class AuthService {
  private readonly accessTtl: string;
  private readonly bcryptRounds: number;
  private readonly resetTtlMin: number;
  private readonly logger: Logger;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.logger = new Logger(AuthService.name);
    this.accessTtl = this.config.get<string>('JWT_ACCESS_TTL') ?? '900s';
    this.bcryptRounds = Number(this.config.get<string>('BCRYPT_SALT_ROUNDS') ?? 10);
    this.resetTtlMin = Number(this.config.get<string>('RESET_TOKEN_TTL_MIN') ?? 15);
  }

  // ===== Helpers =====
  private signAccessToken(payload: { sub: string; email: string }) {
    return this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.accessTtl,
      algorithm: 'HS256',
    });
  }

  private pickPublicUser(u: any) {
    // Không dùng safeUser theo yêu cầu của bạn — chỉ trả field “public”
    return {
      _id: u._id?.toString?.() ?? u._id,
      username: u.username,
      email: u.email,
      avatarUrl: u.avatarUrl ?? null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }

  private buildResetLink(plainToken: string, email: string) {
    const base = 'http://localhost:3000/reset';
    const params = new URLSearchParams({ token: plainToken, email });
    return `${base}?${params.toString()}`;
  }

  private logResetLinkDev(username: string | null, email: string, link: string | null) {
    if (process.env.NODE_ENV === 'development') {
      if (link) {
        this.logger.debug(`Reset link for ${username ?? '(unknown)'} <${email}>: ${link}`);
      } else {
        this.logger.debug(`Forgot request for <${email}> (user not found) — still returning 200`);
      }
    }
  }

  // ===== Register =====
  async register(dto: RegisterDTO) {
    const username = dto.username.trim().toLowerCase();
    const email = dto.email.trim().toLowerCase();

    // pre-check
    const exists = await this.userModel
      .findOne({
        $or: [{ username }, { email }],
      })
      .lean();
    if (exists) {
      if (exists.username === username) throw new ConflictException('Username đã tồn tại.');
      if (exists.email === email) throw new ConflictException('Email đã tồn tại.');
      throw new ConflictException('Tài khoản đã tồn tại.');
    }

    // hash password
    const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);

    try {
      const created = await this.userModel.create({
        username,
        email,
        passwordHash,
        avatarUrl: dto.avatarUrl ?? null,
      });

      const accessToken = this.signAccessToken({ sub: created._id.toString(), email });

      return {
        user: this.pickPublicUser(created),
        accessToken,
      };
    } catch (err: any) {
      if (err?.code === 11000) {
        const key = Object.keys(err.keyValue ?? {})[0];
        if (key === 'username') throw new ConflictException('Username đã tồn tại.');
        if (key === 'email') throw new ConflictException('Email đã tồn tại.');
        throw new ConflictException('Tài khoản đã tồn tại.');
      }
      throw err;
    }
  }

  // ===== Login (username + password) =====
  async login(dto: LoginDTO) {
    const username = dto.username.trim().toLowerCase();

    //need passsword hash to compare
    const user = await this.userModel.findOne({ username }).select('+passwordHash').exec();

    if (!user) throw new UnauthorizedException('Username hoặc mật khẩu không đúng.');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Username hoặc mật khẩu không đúng.');

    const accessToken = this.signAccessToken({
      sub: user._id.toString(),
      email: user.email,
    });

    return {
      user: this.pickPublicUser(user),
      accessToken,
    };
  }

  // ===== Me (fetch DB user info) =====
  async me(userFromToken: { _id: string; email: string }) {
    const user = await this.userModel.findById(userFromToken._id).lean();
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại.');
    return { user: this.pickPublicUser(user) };
  }

  // ===== Forgot Password =====
  async forgot(dto: ForgotDTO) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.userModel
      .findOne({ email })
      .select('+resetTokenHash +resetTokenExp')
      .exec();

    if (!user) {
      this.logResetLinkDev(null, email, null);
      return { success: true };
    }

    const plain = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(plain, this.bcryptRounds);

    user.resetTokenHash = hash;
    user.resetTokenExp = new Date(Date.now() + this.resetTtlMin * 60 * 1000);
    await user.save();

    const link = this.buildResetLink(plain, email);
    this.logResetLinkDev(user.username, email, link);

    return { success: true };
  }

  // ===== Reset Password =====
  async reset(dto: ResetDTO) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.userModel
      .findOne({ email })
      .select('+resetTokenHash +resetTokenExp +passwordHash')
      .exec();

    if (!user || !user.resetTokenHash || !user.resetTokenExp) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn.');
    }

    if (user.resetTokenExp.getTime() < Date.now()) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn.');
    }

    const ok = await bcrypt.compare(dto.token, user.resetTokenHash);
    if (!ok) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn.');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, this.bcryptRounds);
    user.passwordHash = passwordHash;
    user.resetTokenHash = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    return { success: true };
  }
}
