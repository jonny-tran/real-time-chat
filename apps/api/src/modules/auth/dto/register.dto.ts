/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PASSWORD_MSG, PASSWORD_REGEX } from 'src/common/validation/password.policy';

export class RegisterDTO {
  //username
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9._]+$/, {
    message: 'Username chỉ gồm chữ, số, dấu chấm hoặc gạch dưới.',
  })
  @Transform(({ value }) => String(value).trim().toLowerCase())
  username: string;

  //email
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  @MaxLength(120)
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;

  //password
  @IsString()
  @MaxLength(128)
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MSG })
  password: string;

  //avatarUrl
  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'avatarUrl không hợp lệ.' })
  @MaxLength(2048)
  @Transform(({ value }) => (value === '' ? undefined : String(value)))
  avatarUrl?: string;
}
