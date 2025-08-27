import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Headers,
  Request,
  UseGuards,
  BadRequestException,
  Res,
  Query,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '@/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly httpService: HttpService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createEmployeeDto: any,
    @Headers('authorization') auth: string,
  ) {
    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.post(`${employeeServiceUrl}/users`, createEmployeeDto, {
        headers: { authorization: auth },
      }),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Get('/findAll')
  async findAll(@Headers('authorization') auth: string) {
    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    console.log('find all');
    const response = await firstValueFrom(
      this.httpService.get(`${employeeServiceUrl}/users/findAll`, {
        headers: { authorization: auth },
      }),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req, @Headers('authorization') auth: string) {
    console.log('masuk');
    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.get(`${employeeServiceUrl}/users/profile`, {
        headers: { authorization: auth },
      }),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Get()
  async findOne(
    @Query('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    console.log(id);
    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.get(`${employeeServiceUrl}/users?id=${id}`, {
        headers: { authorization: auth },
      }),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateDto: any,
    @Headers('authorization') auth: string,
  ) {
    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.put(`${employeeServiceUrl}/users/profile`, updateDto, {
        headers: { authorization: auth },
      }),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
    @Headers('authorization') auth: string,
  ) {
    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.put(`${employeeServiceUrl}/users/${id}`, updateDto, {
        headers: { authorization: auth },
      }),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deactivate(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.delete(`${employeeServiceUrl}/users/${id}`, {
        headers: { authorization: auth },
      }),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Post('profile/photo')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadProfilePhoto(
    @Request() req,
    @UploadedFile() file: any,
    @Headers('authorization') auth: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';

    // Create form data to forward the file
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('photo', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await firstValueFrom(
      this.httpService.post(
        `${employeeServiceUrl}/users/profile/photo`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            authorization: auth,
          },
        },
      ),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Headers('authorization') auth: string,
  ) {
    console.log('masuk sini');
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';

    // Create form data to forward the file
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('photo', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await firstValueFrom(
      this.httpService.post(
        `${employeeServiceUrl}/users/${id}/photo`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            authorization: auth,
          },
        },
      ),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Delete('profile/photo')
  async deleteProfilePhoto(
    @Request() req,
    @Headers('authorization') auth: string,
  ) {
    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.delete(`${employeeServiceUrl}/users/profile/photo`, {
        headers: { authorization: auth },
      }),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Delete(':id/photo')
  async deletePhoto(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    const response = await firstValueFrom(
      this.httpService.delete(`${employeeServiceUrl}/users/${id}/photo`, {
        headers: { authorization: auth },
      }),
    );
    return response.data;
  }

  @UseGuards(AuthGuard)
  @Get('photo')
  async servePhoto(
    @Query('filename') filename: string,
    @Headers('authorization') auth: string,
    @Res() res: Response,
  ) {
    const employeeServiceUrl =
      process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002';
    console.log('get profile photo');
    console.log(`${employeeServiceUrl}/users/photo`);

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${employeeServiceUrl}/users/photo`, {
          headers: { authorization: auth },
          responseType: 'stream',
          params: { filename: filename },
        }),
      );

      // Forward the response headers
      res.setHeader(
        'Content-Type',
        response.headers['content-type'] || 'image/jpeg',
      );
      res.setHeader(
        'Cache-Control',
        response.headers['cache-control'] || 'public, max-age=31536000',
      );

      // Pipe the response stream
      response.data.pipe(res);
    } catch (error) {
      res.status(404).json({ message: 'Photo not found' });
    }
  }
}
