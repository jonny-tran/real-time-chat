import { ApiProperty } from '@nestjs/swagger';

export class UserPublicDTO {
  @ApiProperty({ example: '66cf2a9b5c1d2c9f1e7a1234', readOnly: true })
  _id: string;

  @ApiProperty({ example: 'jonny', readOnly: true })
  username: string;

  @ApiProperty({ example: 'jonny@gmail.com', readOnly: true })
  email: string;

  @ApiProperty({ example: 'https://cdn.../avatar.jpg', nullable: true, readOnly: true })
  avatarUrl?: string;

  @ApiProperty({ example: '2025-08-28T09:00:000Z', readOnly: true })
  createdAt: Date;

  @ApiProperty({ example: '2025-08-28T09:00:000Z', readOnly: true })
  updatedAt: Date;
}
