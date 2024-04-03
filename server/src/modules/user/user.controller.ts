import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard, RolesGuard } from 'src/commons/guards';
import UserService from './user.service';
import { CustomQueryParams } from 'src/commons/decorators/pagination.decorator';
import { UserEntity } from './entities/user.entity';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN')
  @Get('/')
  async getList_users(
    @CustomQueryParams<UserEntity>(['username']) userQueries: any,
  ) {
    const data = await this.userService.getList({}, {});
  }
}
