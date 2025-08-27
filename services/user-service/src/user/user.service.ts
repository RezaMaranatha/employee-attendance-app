import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { KafkaService } from '../kafka/kafka.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private employeeRepository: Repository<User>,
    private kafkaService: KafkaService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<User> {
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      hireDate: createEmployeeDto.hireDate
        ? new Date(createEmployeeDto.hireDate)
        : undefined,
    });

    return this.employeeRepository.save(employee);
  }

  async findAll(): Promise<User[]> {
    return this.employeeRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<User> {
    const employee = await this.employeeRepository.findOne({
      where: { id, isActive: true },
    });

    if (!employee) throw new NotFoundException('User not found');

    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<User> {
    const employee = await this.findById(id);

    const updateData = {
      ...updateEmployeeDto,
      hireDate: updateEmployeeDto.hireDate
        ? new Date(updateEmployeeDto.hireDate)
        : employee.hireDate,
    };

    // Track changes for Kafka event
    const changes = [];
    for (const [key, newValue] of Object.entries(updateData)) {
      if (employee[key] !== newValue) {
        changes.push({
          field: key,
          oldValue: employee[key],
          newValue: newValue,
        });
      }
    }

    await this.employeeRepository.update(id, updateData);
    const updatedEmployee = await this.findById(id);

    // Send Kafka event for user update
    if (changes.length > 0) {
      await this.kafkaService.sendUserUpdated(id, updatedEmployee, changes);
    }

    return updatedEmployee;
  }

  async deactivate(id: string): Promise<User> {
    const employee = await this.findById(id);
    employee.isActive = false;
    const deactivatedEmployee = await this.employeeRepository.save(employee);

    // Send Kafka event for user deactivation
    await this.kafkaService.sendUserUpdated(id, deactivatedEmployee, [
      { field: 'isActive', oldValue: true, newValue: false }
    ]);

    return deactivatedEmployee;
  }

  async updateProfilePhoto(
    employeeId: string,
    filename: string,
  ): Promise<User> {
    const employee = await this.findById(employeeId);

    if (employee.profilePhotoFilename) {
      const oldPhotoPath = path.join(
        './uploads/profile-photos',
        employee.profilePhotoFilename,
      );
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    employee.profilePhotoFilename = filename;
    employee.profilePhotoUrl = `/uploads/profile-photos/${filename}`;

    return this.employeeRepository.save(employee);
  }

  async deleteProfilePhoto(employeeId: string): Promise<User> {
    const employee = await this.findById(employeeId);

    if (employee.profilePhotoFilename) {
      const photoPath = path.join(
        './uploads/profile-photos',
        employee.profilePhotoFilename,
      );
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    employee.profilePhotoFilename = null;
    employee.profilePhotoUrl = null;

    return this.employeeRepository.save(employee);
  }
}
