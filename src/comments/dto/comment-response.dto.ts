import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Comment content' })
  content: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  task: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  author: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
