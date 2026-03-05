import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Project name' })
  name: string;

  @ApiProperty({ example: 'Project description', required: false })
  description?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  owner: string;

  @ApiProperty({ type: [String], example: ['507f1f77bcf86cd799439012'] })
  members: string[];

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
