import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UserService) {}

  @Post()
  create(@Body() dto: { name: string; email: string }) {
    return this.users.create(dto);
  }

  @Get()
  get(@Query('email') email: string) {
    return this.users.findByEmail(email);
  }
}
