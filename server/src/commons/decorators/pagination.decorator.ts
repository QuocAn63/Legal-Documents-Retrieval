import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { EntitySchema } from 'typeorm';

export const Pagination = createParamDecorator(
  (defaultPageSize = 20, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const pageIndex = request.query['pageIndex'] || 1;
    const pageSize = request.query['pageSize'] || defaultPageSize;
    const fromDate = request.query['fromDate'] as string | undefined;
    const toDate = request.query['toDate'] as string | undefined;

    return { pageIndex, pageSize, fromDate, toDate };
  },
);

export const CustomQueryParams = <T>(fields: (keyof T)[]) =>
  createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const queryParams = request.query;

    const filteredParams: Partial<T> = {};
    fields.forEach((field) => {
      if (field in queryParams) {
        filteredParams[field] = queryParams[field] as any;
      }
    });

    return filteredParams;
  })();
