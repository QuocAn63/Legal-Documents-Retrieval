import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponseData } from 'src/interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponseData<T>>
{
  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponseData<T>> {
    const request = ctx.switchToHttp().getRequest<Request>();
    const response = ctx.switchToHttp().getResponse<Response>();

    const status = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        let metadata = {};

        if (typeof data === 'object' && Array.isArray(data)) {
          let pageIndex = request.query['pageIndex']
            ? Number.parseInt(request.query['pageIndex'].toString())
            : 1;
          let pageSize = request.query['pageSize']
            ? Number.parseInt(request.query['pageSize'].toString())
            : 20;

          let totalPages = Math.ceil(data.length / pageSize);

          metadata = { pageIndex, pageSize, totalPages };
        }

        return { status, data: data, metadata };
      }),
    );
  }
}
