import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import { IAuthToken } from 'src/interfaces/auth.interface';

export default class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isAccessible = true;
    const roles = this.reflector.getAllAndOverride<string[]>('Roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const http = context.switchToHttp();
    const request = http.getRequest();
    const authToken = request.user as IAuthToken;

    if (authToken.isBOT) {
      isAccessible = false;
    }

    if (roles.includes('ADMIN') && !authToken.isADMIN) {
      isAccessible = false;
    }

    return isAccessible;
  }
}
