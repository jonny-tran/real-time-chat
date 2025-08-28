/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_MSG, PASSWORD_REGEX } from 'src/common/validation/password.policy';

export class LoginDTO {
  // username
  @ApiProperty({ example: 'jonny', minLength: 3, maxLength: 30 })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9._]+$/, {
    message: 'Username chỉ gồm chữ, số, dấu chấm hoặc gạch dưới.',
  })
  @Transform(({ value }) => String(value).trim().toLowerCase())
  username: string;

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
}
