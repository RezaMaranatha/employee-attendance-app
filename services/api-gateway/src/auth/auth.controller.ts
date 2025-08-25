import { Controller, Post, Body, Headers, Get, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: HttpService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await firstValueFrom(
      this.httpService.post(`${authServiceUrl}/auth/login`, loginDto)
    );
    return response.data;
  }

  @Post('register')
  async register(@Body() registerDto: any, @Headers('authorization') auth: string) {
    console.log(auth);
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await firstValueFrom(
      this.httpService.post(`${authServiceUrl}/auth/register`, registerDto, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }

  @Post('register/first-admin')
  async registerFirstAdmin(@Body() registerDto: any) {
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await firstValueFrom(
      this.httpService.post(`${authServiceUrl}/auth/register/first-admin`, registerDto)
    );
    return response.data;
  }

  @Post('logout')
  async logout(@Headers('authorization') auth: string) {
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await firstValueFrom(
      this.httpService.post(`${authServiceUrl}/auth/logout`, {}, {
        headers: { authorization: auth },
      })
    );
    return response.data;
  }
}
