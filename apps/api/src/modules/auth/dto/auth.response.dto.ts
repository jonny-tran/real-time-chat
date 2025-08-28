import { ApiProperty } from '@nestjs/swagger';
import { UserPublicDTO } from './user-public.dto';

export class AuthTokenResponseDto {
  @ApiProperty({ type: UserPublicDTO })
  user: UserPublicDTO;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;
}

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success: boolean;
}
