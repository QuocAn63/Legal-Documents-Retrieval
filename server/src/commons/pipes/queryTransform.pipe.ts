import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { FindOperator, Like } from 'typeorm';

@Injectable()
export class QueryTransformPipe implements PipeTransform {
  transform<T>(value: any, metadata: ArgumentMetadata) {
    let newValue: Record<string, FindOperator<T> | string> = value;
    let fieldsNeedLike = [
      'title',
      'description',
      'content',
      'username',
      'email',
    ];

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

export function filterKeys<T>(input: T, allowedKeys: (keyof T)[]): Partial<T> {
  return Object.keys(input)
    .filter((key) => allowedKeys.includes(key as any))
    .reduce((obj, key) => {
      obj[key] = input[key];
      return obj;
    }, {} as Partial<T>);
}
