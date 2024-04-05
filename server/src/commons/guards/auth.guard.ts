import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IAuthToken } from 'src/interfaces/auth.interface';

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    console.log(token);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<IAuthToken>(token, {
        secret: this.configService.getOrThrow('AUTH_SECRET'),
      });

      console.log(payload);

      request.user = payload;
    } catch (ex) {
      throw new UnauthorizedException(ex);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    console.log(request.headers.authorization);
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
