import { SetMetadata } from '@nestjs/common';

type RoleString = 'USER' | 'ADMIN';

export const Roles = (...roles: RoleString[]) => SetMetadata('Roles', roles);
