import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ForgotDTO } from './dto/forgot.dto';
import { ResetDTO } from './dto/reset.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // Tạm thời trả lại body để test validation
  @Post('register')
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: { _id: string; email: string }) {
    return this.authService.me(user);
  }

  @Post('forgot')
  forgot(@Body() dto: ForgotDTO) {
    return this.authService.forgot(dto);
  }

  @Post('reset')
  reset(@Body() dto: ResetDTO) {
    return this.authService.reset(dto);
  }
}
