import { Injectable } from '@nestjs/common';
import IBaseService from 'src/interfaces/baseService.interface';
import { UserEntity } from './entities/user.entity';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';
import { FindOptionsWhere, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class UserService implements IBaseService<UserEntity> {
  constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) {}

  async getList(
    params: Partial<UserEntity>,
    { pageIndex = 1, pageSize = 20 }: IQueryParams,
  ): Promise<[] | UserEntity[]> {
    let reponseData = [];
    let findOptions: FindOptionsWhere<UserEntity>;
    const offset = OffsetUtil.getOffset(pageIndex, pageSize);

    findOptions = {
      id: Raw(
        (raw) =>
          `1 = 1 AND (${raw} IS NULL OR ${raw} = '' OR [${raw}] = ${params.id}`,
      ),
      username: Raw(
        (raw) =>
          `(${raw} IS NULL OR ${raw} = '' OR [${raw}] LIKE  N'%${params.username}%'`,
      ),
      email: Raw(
        (raw) => `(${raw} IS NULL OR ${raw} = '' OR [${raw}] = ${params.email}`,
      ),
      isBOT: Raw(
        (raw) => `(${raw} IS NULL OR ${raw} = '' OR [${raw}] = ${params.isBOT}`,
      ),
      isADMIN: Raw(
        (raw) =>
          `(${raw} IS NULL OR ${raw} = '' OR [${raw}] = ${params.isADMIN}`,
      ),
    };

    responseData = await this.userRepo.find({where: findOptions, take: pageSize, skip: });
  }

  async get(...props: any): Promise<UserEntity> {
    return;
  }

  async save(...props: any): Promise<string> {
    return;
  }

  async update(...props: any): Promise<string> {
    return;
  }

  async delete(...props: any): Promise<string | string[]> {
    return;
  }
}
