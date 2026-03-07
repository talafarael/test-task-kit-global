import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends PartialType(
  OmitType(CreateTagDto, ['project'] as const),
) {}
