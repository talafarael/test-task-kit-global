import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class QueryTagDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  project: string;
}
