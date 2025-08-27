import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  UseGuards,
  Put,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '@/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: HttpService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${authServiceUrl}/auth/login`, loginDto),
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(error.response.data.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('register')
  async register(
    @Body() registerDto: any,
    @Headers('authorization') auth: string,
  ) {
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${authServiceUrl}/auth/register`, registerDto, {
          headers: { authorization: auth },
        }),
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(error.response.data.message);
    }
  }

  @Post('logout')
  async logout(@Headers('authorization') auth: string) {
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error.response.data.message);
    }
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: any,
    @Headers('authorization') auth: string,
  ) {
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error.response.data.message);
    }
  }

  @Get('validate-token')
  async validate(@Headers('authorization') auth: string) {
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${authServiceUrl}/auth/validate`, {
          headers: { authorization: auth },
        }),
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(error.response.data.message);
    }
  }
}
