/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'jonny', minLength: 3, maxLength: 30 })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9._]+$/, {
    message: 'Username chỉ gồm chữ, số, dấu chấm hoặc gạch dưới.',
  })
  @Transform(({ value }) => String(value).trim().toLowerCase())
  username: string;

  //email
  @ApiProperty({ example: 'jonny@gmail.com', maxLength: 120 })
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  @MaxLength(120)
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;

  //password
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
  password: string;

  //avatarUrl
  @ApiProperty({ example: 'https://cdn.../avatar.jpg', nullable: true })
  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'avatarUrl không hợp lệ.' })
  @MaxLength(2048)
  @Transform(({ value }) => (value === '' ? undefined : String(value)))
  avatarUrl?: string;
}
