import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Project', minLength: 2 })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Project description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
