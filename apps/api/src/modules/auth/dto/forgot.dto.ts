/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Transform } from 'class-transformer';
import { IsEmail, MaxLength } from 'class-validator';

export class ForgotDTO {
  //email
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  @MaxLength(120)
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;
}
