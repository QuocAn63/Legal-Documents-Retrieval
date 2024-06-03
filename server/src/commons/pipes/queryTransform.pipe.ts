import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as moment from 'moment';
import { Between, Like } from 'typeorm';

@Injectable()
export class QueryTransformPipe<T> implements PipeTransform {
  transform<T extends object>(value: T, metadata: ArgumentMetadata) {
    let newValue = {};

    let fieldsNeedLike = ['title', 'description', 'content', 'email'];

    if (metadata.type === 'query') {
      Object.keys(value).forEach((key) => {
        if (fieldsNeedLike.includes(key) && key in value) {
          newValue[key] = Like(`%${value[key]}%` as any);
        } else {
          newValue[key] = value[key];
        }
      });
    }

    const from = !!value['from']
      ? moment(value['from']).format('YYYY-MM-DD HH:MM:SS')
      : '1900-01-01 00:00:00';
    const to = !!value['to']
      ? moment(value['to']).format('YYYY-MM-DD HH:MM:SS')
      : '2100-01-01 00:00:00';

    newValue['createdAt'] = Between(from, to);

    return newValue;
  }
}

export function filterKeys<T>(
  input: any,
  allowedKeys: (keyof T)[],
): Partial<T> {
  return Object.keys(input)
    .filter((key) => allowedKeys.includes(key as any))
    .reduce((obj, key) => {
      obj[key] = input[key];
      return obj;
    }, {} as Partial<T>);
}
