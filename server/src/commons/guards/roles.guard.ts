import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAuthToken } from 'src/interfaces/auth.interface';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isAccessible = true;
    const roles = this.reflector.getAllAndOverride<string[]>('Roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(roles);
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
