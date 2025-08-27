import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  UseGuards,
  Put,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '@/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: HttpService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    const authServiceUrl = 'http://localhost:3001';
    const response = await firstValueFrom(
      this.httpService.post(`${authServiceUrl}/auth/login`, loginDto),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Post('register')
  async register(
    @Body() registerDto: any,
    @Headers('authorization') auth: string,
  ) {
    console.log(auth);
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await firstValueFrom(
      this.httpService.post(`${authServiceUrl}/auth/register`, registerDto, {
        headers: { authorization: auth },
      }),
    );
    return response.data;
  }

  @Post('logout')
  async logout(@Headers('authorization') auth: string) {
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await firstValueFrom(
      this.httpService.post(
        `${authServiceUrl}/auth/logout`,
        {},
        {
          headers: { authorization: auth },
        },
      ),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: any,
    @Headers('authorization') auth: string,
  ) {
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await firstValueFrom(
      this.httpService.put(
        `${authServiceUrl}/auth/change-password`,
        changePasswordDto,
        {
          headers: { authorization: auth },
        },
      ),
    );
    return response.data;
  }

  @Get('validate-token')
  async validate(@Headers('authorization') auth: string) {
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await firstValueFrom(
      this.httpService.get(`${authServiceUrl}/auth/validate`, {
        headers: { authorization: auth },
      }),
    );
    return response.data;
  }
}
