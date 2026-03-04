import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsMongoId,
  IsEnum,
  IsDateString,
  IsArray,
  MinLength,
} from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @ApiProperty({ example: 'Task title', minLength: 2 })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty({ example: 'Task description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  project: string;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', required: false })
  @IsMongoId()
  @IsOptional()
  parentTask?: string;

  @ApiProperty({ type: [String], required: false })
  @IsMongoId({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z', required: false })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiProperty({ example: 'Russia', description: 'Country of task creation', required: false })
  @IsString()
  @IsOptional()
  country?: string;
}
