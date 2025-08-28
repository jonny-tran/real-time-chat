import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ForgotDTO } from './dto/forgot.dto';
import { ResetDTO } from './dto/reset.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthTokenResponseDto, SuccessResponseDto } from './dto/auth.response.dto';
import { UserPublicDTO } from './dto/user-public.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register' })
  @ApiOkResponse({ type: AuthTokenResponseDto })
  @ApiConflictResponse({ description: 'Username or email already exists' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('register')
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: AuthTokenResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ type: UserPublicDTO })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: { _id: string; email: string }) {
    return this.authService.me(user);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @ApiOkResponse({ type: SuccessResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('forgot')
  forgot(@Body() dto: ForgotDTO) {
    return this.authService.forgot(dto);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({ type: SuccessResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('reset')
  reset(@Body() dto: ResetDTO) {
    return this.authService.reset(dto);
  }
}
