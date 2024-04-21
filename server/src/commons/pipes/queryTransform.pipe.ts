import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { FindOperator, Like } from 'typeorm';

@Injectable()
export class QueryTransformPipe<T> implements PipeTransform {
  transform<T extends object>(value: T, metadata: ArgumentMetadata) {
    // let newValue: Record<string, FindOperator<T> | string> = value;
    let newValue = value;

    let fieldsNeedLike = [
      'title',
      'description',
      'content',
      'username',
      'email',
    ];

    if (metadata.type === 'query') {
      Object.keys(value).forEach((key) => {
        if (fieldsNeedLike.includes(key) && key in value) {
          newValue[key] = Like(`%${value[key]}%` as any);
        } else {
          newValue[key] = value[key];
        }
      });
    }

    return value;
  }
}

export function FilterKeys<T>(input: T, allowedKeys: string[]): Partial<T> {
  return Object.keys(input)
    .filter((key) => allowedKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = input[key];
      return obj;
    }, {} as Partial<T>);
}
