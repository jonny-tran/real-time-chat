/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, MaxLength } from 'class-validator';

export class ForgotDTO {
  //email
  @ApiProperty({ example: 'jonny@gmail.com', maxLength: 120 })
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  @MaxLength(120)
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;
}
