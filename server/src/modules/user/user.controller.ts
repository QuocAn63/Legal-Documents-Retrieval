import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { RolesGuard } from 'src/commons/guards';
import UserService from './user.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN')
  @Get('/')
  async getList_users() {}
}
