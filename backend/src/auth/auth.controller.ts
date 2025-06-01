import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  async getProfile() {
    // 简单的用户信息返回
    return {
      id: 1,
      username: 'admin',
      role: 'admin'
    };
  }

  @Post('logout')
  async logout() {
    return { message: '退出成功' };
  }
}