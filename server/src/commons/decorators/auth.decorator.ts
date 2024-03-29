import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
