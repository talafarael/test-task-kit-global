import { OmitType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends OmitType(CreateTagDto, ['project']) {}
