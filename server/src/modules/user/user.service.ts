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

@Injectable()
export default class UserService implements IBaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getList(
    entityParams: FindOptionsWhere<UserEntity>,
    { pageIndex = 1, pageSize = 20 }: IQueryParams,
  ): Promise<[] | UserEntity[]> {
    let responseData = [];

    responseData = await this.userRepo.find({
      where: entityParams,
      skip: OffsetUtil.getOffset(pageIndex, pageSize),
      take: pageSize,
    });

    return responseData;
  }

  async get(entityParams: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    return await this.userRepo.findOneBy(entityParams);
  }

  async save<T extends SaveUserWithUsernameDTO | SaveUserWithEmailDTO>(
    data: T,
  ): Promise<string> {
    let userInstance = this.userRepo.create();
    userInstance.isBOT = '0';
    userInstance.isADMIN = '0';

    if ('username' in data) {
      if (await this.userRepo.findOneBy({ username: data.username })) {
        throw new BadGatewayException(ValidateMessages.USER_USERNAME_EXISTS);
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
      throw new InternalServerErrorException();
    }

    return saveUserResponse.id;
  }

  async save_bot(data: SaveBOTDTO) {
    const saveResponse = await this.userRepo.save({
      username: data.username,
      isBOT: '1',
      isADMIN: '0',
    });

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
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const isPasswordEquals = await HashUtil.compare(password, user.password);

    if (!isPasswordEquals) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }

    const encryptedPassword = await HashUtil.hash(newPassword);

    const saveUserResponse = await this.userRepo.update(
      { id },
      { password: encryptedPassword },
    );

    if (!saveUserResponse.affected) {
      throw new BadRequestException('Cập nhật không thành công');
    }

    return 'Cập nhật thành công';
  }

  async delete(userToken: IAuthToken, data: DeleteUserDTO): Promise<string> {
    const { id, isADMIN } = userToken;
    let deleteResult: DeleteResult;

    if ((data.IDs.includes(id) && data.IDs.length == 1) || isADMIN) {
      deleteResult = await this.userRepo.softDelete({ id: In(data.IDs) });
    }

    if (!deleteResult.affected) {
      throw new BadRequestException('Xóa không thành công');
    }

    return 'Xóa thành công';
  }
}
