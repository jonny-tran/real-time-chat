import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ForgotDTO } from './dto/forgot.dto';
import { ResetDTO } from './dto/reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  health() {
    return this.authService.ping();
  }

  // Tạm thời trả lại body để test validation
  @Post('register')
  register(@Body() dto: RegisterDTO) {
    return { ok: true, dto };
  }

  @Post('login')
  login(@Body() dto: LoginDTO) {
    return { ok: true, dto };
  }

  @Post('forgot')
  forgot(@Body() dto: ForgotDTO) {
    return { ok: true, dto };
  }

  @Post('reset')
  reset(@Body() dto: ResetDTO) {
    return { ok: true, dto };
  }
}
