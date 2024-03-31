import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
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
    const response = ctx.switchToHttp().getResponse<Response>();

    const status = response.statusCode;

    return next.handle().pipe(map((data) => ({ status, data: data })));
  }
}
