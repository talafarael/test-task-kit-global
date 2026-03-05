import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../schemas/task.schema';

export class TaskResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Task title' })
  title: string;

  @ApiProperty({ example: 'Task description', required: false })
  description?: string;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  project: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  creator: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', required: false })
  assignee?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439013', required: false })
  parentTask?: string;

  @ApiProperty({ type: [String], example: ['507f1f77bcf86cd799439014'] })
  tags: string[];

  @ApiProperty({ example: '2025-12-31T23:59:59.000Z', required: false })
  deadline?: Date;

  @ApiProperty({ example: 'Russia', required: false })
  country?: string;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
