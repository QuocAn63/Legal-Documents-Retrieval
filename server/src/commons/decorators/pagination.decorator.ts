import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

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
