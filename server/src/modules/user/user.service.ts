import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import IBaseService from 'src/interfaces/baseService.interface';
import { UserEntity } from './entities/user.entity';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';
import { DeleteResult, FindOptionsWhere, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SaveBOTDTO,
  SaveUserWithEmailDTO,
  SaveUserWithUsernameDTO,
} from './dto/save.dto';
import { ValidateMessages } from 'src/enum/validateMessages';
import HashUtil from 'src/utils/hash.util';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { UpdateUserDTO } from './dto/update.dto';
import { DeleteUserDTO } from './dto/delete.dto';
import SystemMessageService from '../system-message/system-message.service';

@Injectable()
export default class UserService implements IBaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly sysMsgService: SystemMessageService,
  ) {}

  async getList(
    entityParams: FindOptionsWhere<UserEntity>,
    pagination: IQueryParams,
  ): Promise<[] | UserEntity[]> {
    let responseData = [];

    responseData = await this.userRepo.find({
      where: entityParams,
      skip: OffsetUtil.getOffset(pagination),
      take: pagination.pageSize,
    });

    return responseData;
  }

  async get(entityParams: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    return await this.userRepo.findOneBy(entityParams);
  }

  async save<T extends SaveUserWithUsernameDTO | SaveUserWithEmailDTO>(
    data: T,
  ): Promise<UserEntity> {
    let userInstance = this.userRepo.create();
    userInstance.isBOT = false;
    userInstance.isADMIN = false;

    if ('username' in data) {
      if (await this.userRepo.findOneBy({ username: data.username })) {
        await this.sysMsgService.getSysMessageAndThrowHttpException(
          ValidateMessages.USER_USERNAME_EXISTS,
          404,
        );
      }

      const encryptedPassword = await HashUtil.hash(data.password);

      userInstance.username = data.username;
      userInstance.password = encryptedPassword;
    } else if ('email' in data) {
      userInstance.email = data.email;
      userInstance.googleID = data.googleID;
    }

    const saveUserResponse = await userInstance.save();

    if (!saveUserResponse) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        ValidateMessages.SYS_ERROR,
        500,
      );
    }

    return saveUserResponse;
  }

  async save_bot(data: SaveBOTDTO) {
    const saveResponse = await this.userRepo.save({
      username: data.username,
      isBOT: true,
      isADMIN: false,
    });

    if (saveResponse === null) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'SAVE_ERROR',
        500,
      );
    }

    return saveResponse.id;
  }

  // Just for change password
  async update(userToken: IAuthToken, data: UpdateUserDTO): Promise<string> {
    const { password, newPassword } = data;
    const { id } = userToken;
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['password'],
    });

    if (user === null) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        ValidateMessages.USER_NOT_EXISTS,
        404,
      );
    }

    const isPasswordEquals = await HashUtil.compare(password, user.password);

    if (!isPasswordEquals) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        ValidateMessages.USER_PASSWORD_WRONG,
        403,
      );
    }

    const encryptedPassword = await HashUtil.hash(newPassword);

    const update = await this.userRepo.update(
      { id },
      { password: encryptedPassword },
    );

    if (!update.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'UPDATE_ERROR',
      );
    }

    return await this.sysMsgService.getSysMessage('UPDATE_SUCCESS');
  }

  async delete(userToken: IAuthToken, data: DeleteUserDTO): Promise<string> {
    const { id, isADMIN } = userToken;
    let deleteResponse: DeleteResult;

    if ((data.IDs.includes(id) && data.IDs.length == 1) || isADMIN) {
      deleteResponse = await this.userRepo.softDelete({ id: In(data.IDs) });
    }

    if (!deleteResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'DELETE_ERROR',
      );
    }

    return await this.sysMsgService.getSysMessage('DELETE_SUCCESS');
  }
}
