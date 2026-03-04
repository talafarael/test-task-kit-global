import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsMongoId, IsEnum, IsIn, IsString } from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';

export class QueryTaskDto {
  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  project?: string;

  @ApiProperty({ example: 'Russia', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ enum: ['createdAt', 'deadline', 'title', 'status'], required: false })
  @IsOptional()
  @IsIn(['createdAt', 'deadline', 'title', 'status'])
  sortBy?: 'createdAt' | 'deadline' | 'title' | 'status';

  @ApiProperty({ enum: ['asc', 'desc'], required: false })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
