/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';
import { PASSWORD_MSG, PASSWORD_REGEX } from 'src/common/validation/password.policy';

export class ResetDTO {
  //email
  @ApiProperty({ example: 'jonny@gmail.com', maxLength: 120 })
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  @MaxLength(120)
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;

  // token plain 32 bytes hex (64 ký tự), tuỳ bạn: giữ regex lỏng nếu muốn
  @ApiProperty({ example: 'e3f1a0... (token hex)', writeOnly: true, minLength: 64, maxLength: 128 })
  @IsString()
  @Matches(/^[a-f0-9]{32,128}$/i, { message: 'Token đặt lại không hợp lệ.' })
  token: string;

  // newPassword
  @ApiProperty({
    example: 'Password123',
    writeOnly: true,
    minLength: 8,
    maxLength: 128,
    description: PASSWORD_MSG,
  })
  @IsString()
  @MaxLength(128)
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MSG })
  newPassword: string;
}
