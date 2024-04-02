import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import IBaseService from 'src/interfaces/baseService.interface';
import { UserEntity } from './entities/user.entity';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';
import { DeleteResult, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveUserWithEmailDTO, SaveUserWithUsernameDTO } from './dto/save.dto';
import { ValidateMessages } from 'src/enum/validateMessages';
import HashUtil from 'src/utils/hash.util';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { UpdateUserDTO } from './dto/update.dto';
import { DeleteUserDTO } from './dto/delete.dto';

@Injectable()
export default class UserService implements IBaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getList(
    params: Partial<UserEntity>,
    { pageIndex = 1, pageSize = 20 }: IQueryParams,
  ): Promise<[] | UserEntity[]> {
    const queryBuilder = this.userRepo.createQueryBuilder('users');

    for (const field in params) {
      if (params[field] !== undefined) {
        const value = params[field];

        queryBuilder.andWhere(`users.${field} = :value`, { value });
      }
    }

    queryBuilder.skip(OffsetUtil.getOffset(pageIndex, pageSize)).take(pageSize);

    return await queryBuilder.getMany();
  }

  async get(userID: string): Promise<UserEntity> {
    return await this.userRepo.findOneBy({ id: userID });
  }

  async save<T extends SaveUserWithUsernameDTO | SaveUserWithEmailDTO>(
    data: T,
  ): Promise<string> {
    let userObj = new UserEntity();
    userObj.isBOT = 0;
    userObj.isADMIN = 0;

    if (data instanceof SaveUserWithUsernameDTO) {
      if (!(await this.userRepo.findOneBy({ username: data.username })).id) {
        throw new BadGatewayException(ValidateMessages.USER_USERNAME_EXISTS);
      }

      const encryptedPassword = await HashUtil.hash(data.password);

      userObj.username = data.username;
      userObj.password = encryptedPassword;
    } else if (data instanceof SaveUserWithEmailDTO) {
      userObj.email = data.email;
      userObj.googleID = data.token;
    }

    const saveUserResponse = await this.userRepo.save(userObj);

    return saveUserResponse.id;
  }

  // Just for change password
  async update(userToken: IAuthToken, data: UpdateUserDTO): Promise<string> {
    const { password, newPassword } = data;
    const { id } = userToken;

    const user = await this.userRepo.findOneBy({ id });

    const isPasswordEquals = await HashUtil.compare(password, user.password);

    if (!isPasswordEquals) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }

    const encryptedPassword = await HashUtil.hash(newPassword);

    const saveUserResponse = await this.userRepo.update(
      { id },
      { password: encryptedPassword },
    );

    return saveUserResponse.raw.id;
  }

  async delete(userToken: IAuthToken, data: DeleteUserDTO): Promise<string[]> {
    const { id, isADMIN } = userToken;
    let deletedIDs = [];
    let deleteResult: DeleteResult;

    if ((data.IDs.includes(id) && data.IDs.length == 1) || isADMIN) {
      deleteResult = await this.userRepo.delete({ id: In(data.IDs) });
    }

    if (typeof deleteResult === 'object' && Array.isArray(deleteResult)) {
      deletedIDs = deleteResult.map((result) => result.id);
    }

    return deletedIDs;
  }
}
