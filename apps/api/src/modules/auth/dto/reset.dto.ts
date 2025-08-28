/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';
import { PASSWORD_MSG, PASSWORD_REGEX } from 'src/common/validation/password.policy';

export class ResetDTO {
  //email
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  @MaxLength(120)
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;

  // token plain 32 bytes hex (64 ký tự), tuỳ bạn: giữ regex lỏng nếu muốn
  @IsString()
  @Matches(/^[a-f0-9]{32,128}$/i, { message: 'Token đặt lại không hợp lệ.' })
  token: string;

  // newPassword
  @IsString()
  @MaxLength(128)
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MSG })
  newPassword: string;
}
