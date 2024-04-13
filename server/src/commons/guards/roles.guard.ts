import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { RequestWithPublicRoute } from 'src/interfaces/request.interface';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isAccessible = true;
    const roles = this.reflector.getAllAndOverride<Array<'ADMIN' | 'USER'>>(
      'Roles',
      [context.getHandler(), context.getClass()],
    );

    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithPublicRoute>();
    if (request.isPublic) return true;

    const authToken = request.user as IAuthToken;
    const userRole: 'ADMIN' | 'USER' = authToken.isADMIN ? 'ADMIN' : 'USER';

    if (authToken.isBOT) {
      isAccessible = false;
    }

    if (!roles.includes(userRole) && userRole !== 'ADMIN') {
      isAccessible = false;
    }

    return isAccessible;
  }
}
