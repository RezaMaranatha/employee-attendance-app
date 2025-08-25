import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response, NextFunction } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly httpService: HttpService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
      const response = await firstValueFrom(
        this.httpService.get(`${authServiceUrl}/auth/validate`, {
          headers: { authorization: authHeader },
        })
      );

      // Add user info to request
      req['user'] = response.data;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
