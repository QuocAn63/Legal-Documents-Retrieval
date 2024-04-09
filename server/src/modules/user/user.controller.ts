import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard, RolesGuard } from 'src/commons/guards';
import UserService from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { IQueryParams } from 'src/interfaces/query.interface';
import { FilterUserDTO } from './dto/filter.dto';
import { QueryTransformPipe } from 'src/commons/pipes/queryTransform.pipe';
import { SaveBOTDTO, SaveUserWithUsernameDTO } from './dto/save.dto';
import { UpdateUserDTO } from './dto/update.dto';
import { AuthToken } from 'src/commons/decorators/auth.decorator';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { DeleteUserDTO } from './dto/delete.dto';

@ApiBearerAuth()
@Roles('ADMIN')
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getList_users(
    @Pagination() pagination: IQueryParams,
    @Query(QueryTransformPipe) queries: FilterUserDTO,
  ) {
    return await this.userService.getList(queries, pagination);
  }

  @Get('/:userID')
  async get_users(@Param('userID') userID: string) {
    return await this.userService.get({ id: userID });
  }

  @Post('/')
  async save_users(@Body() data: SaveBOTDTO) {
    return await this.userService.save_bot(data);
  }

  @Roles('USER')
  @Patch('/')
  async update_users(
    @AuthToken() authToken: IAuthToken,
    @Body() data: UpdateUserDTO,
  ) {
    return await this.userService.update(authToken, data);
  }

  @Delete('/')
  async delete_users(
    @AuthToken() authToken: IAuthToken,
    @Body() data: DeleteUserDTO,
  ) {
    return await this.userService.delete(authToken, data);
  }
}
