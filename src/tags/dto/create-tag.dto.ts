import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId, MinLength, Matches } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'urgent', minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: '#6B7280', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  color?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  project: string;
}
