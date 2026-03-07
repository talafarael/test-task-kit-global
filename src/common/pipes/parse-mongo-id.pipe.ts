import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!MONGO_ID_REGEX.test(value)) {
      throw new BadRequestException('Invalid ID format');
    }
    return value;
  }
}
