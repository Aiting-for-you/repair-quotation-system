import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    
    // 简单的硬编码验证
    if (username === 'admin' && password === 'admin123') {
      return {
        access_token: 'mock-jwt-token',
        user: {
          id: 1,
          username: 'admin',
          role: 'admin'
        }
      };
    }
    
    throw new UnauthorizedException('用户名或密码错误');
  }
}