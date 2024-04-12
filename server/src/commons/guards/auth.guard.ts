import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { RequestWithPublicRoute } from 'src/interfaces/request.interface';
import { Request } from 'express';

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithPublicRoute>();
    const token = this.extractTokenFromHeader(request);
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      'IS_PUBLIC',
      [context.getClass(), context.getHandler()],
    );

    if (isPublicRoute) {
      request.isPublic = true;
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<IAuthToken>(token, {
        secret: this.configService.getOrThrow('AUTH_SECRET'),
      });

      request.user = payload;
    } catch (ex) {
      throw new UnauthorizedException(ex);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
