import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { FindOperator, Like } from 'typeorm';

@Injectable()
export class QueryTransformPipe implements PipeTransform {
  transform<T>(value: any, metadata: ArgumentMetadata) {
    let newValue: Record<string, FindOperator<T> | string> = value;
    let fieldsNeedLike = ['title', 'description', 'content'];

    if (metadata.type === 'query') {
      Object.keys(value).forEach((key) => {
        if (fieldsNeedLike.includes(key)) {
          newValue[key] = Like(`%${value[key]}%` as any);
        } else {
          newValue[key] = value[key];
        }
      });
    }

    return value;
  }
}
