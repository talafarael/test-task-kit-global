import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Comment text' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  task: string;
}
