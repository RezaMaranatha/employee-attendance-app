import { Controller, Get, Put, Delete, Param, Body, Post, UploadedFile, UseInterceptors, BadRequestException, UseGuards, Req } from '@nestjs/common';
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

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly employeeService: UserService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<User> {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(): Promise<User[]> {
    return this.employeeService.findAll();
  }

  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest): Promise<User> {
    const { user } = req;
    return this.employeeService.findById(user.id);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string): Promise<User> {
    return this.employeeService.findById(id);
  }

  @Put('profile')
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<User> {
    const { user } = req;
    return this.employeeService.update(user.id, updateEmployeeDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<User> {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deactivate(@Param('id') id: string): Promise<User> {
    return this.employeeService.deactivate(id);
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
    return this.employeeService.updateProfilePhoto(user.id, file.filename);
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
    return this.employeeService.updateProfilePhoto(id, file.filename);
  }

  @Delete('profile/photo')
  async deleteProfilePhoto(@Req() req: AuthenticatedRequest): Promise<User> {
    const { user } = req;
    return this.employeeService.deleteProfilePhoto(user.id);
  }

  @Delete(':id/photo')
  @Roles(Role.ADMIN)
  async deletePhoto(@Param('id') id: string): Promise<User> {
    return this.employeeService.deleteProfilePhoto(id);
  }
}
