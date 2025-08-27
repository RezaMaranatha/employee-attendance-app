import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Req,
  ClassSerializerInterceptor,
  Res,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from './entities/user.entity';
import { multerConfig } from '../utils/config/multer.config';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { RolesGuard } from '../utils/guards/roles.guard';
import { Roles } from '../utils/decorators/roles.decorator';
import { Role } from '../utils/enums/role.enum';
import { AuthenticatedRequest } from '../utils/interfaces/authenticated-request.interface';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<User> {
    return this.userService.create(createEmployeeDto);
  }

  @Get('findAll')
  @Roles(Role.ADMIN)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest): Promise<User> {
    const { user } = req;
    return this.userService.findById(user.id);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findOne(@Query('id') id: string): Promise<User> {
    console.log('get one');
    return this.userService.findById(id);
  }

  @Put('profile')
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<User> {
    const { user } = req;
    return this.userService.update(user.id, updateEmployeeDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<User> {
    return this.userService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deactivate(@Param('id') id: string): Promise<User> {
    return this.userService.deactivate(id);
  }

  @Post('profile/photo')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  async uploadProfilePhoto(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const { user } = req;
    return this.userService.updateProfilePhoto(user.id, file.filename);
  }

  @Post(':id/photo')
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.userService.updateProfilePhoto(id, file.filename);
  }

  @Delete('profile/photo')
  async deleteProfilePhoto(@Req() req: AuthenticatedRequest): Promise<User> {
    const { user } = req;
    return this.userService.deleteProfilePhoto(user.id);
  }

  @Delete(':id/photo')
  @Roles(Role.ADMIN)
  async deletePhoto(@Param('id') id: string): Promise<User> {
    return this.userService.deleteProfilePhoto(id);
  }

  @Get('photo')
  async servePhoto(@Query('filename') filename: string, @Res() res: Response) {
    console.log(filename);
    const photoPath = path.join(
      process.cwd(),
      'uploads',
      'profile-photos',
      filename,
    );
    console.log(filename);
    // Check if file exists
    if (!fs.existsSync(photoPath)) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Stream the file
    const fileStream = fs.createReadStream(photoPath);
    fileStream.pipe(res);
  }
}
