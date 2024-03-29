import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let pageIndex = 1;
    let pageSize = 20;

    try {
      pageIndex = Number.parseInt(request.params.pageIndex);
      pageSize = Number.parseInt(request.params.pageSize);
    } catch (ex) {
      console.log(ex);
    }

    return { pageIndex, pageSize };
  },
);
