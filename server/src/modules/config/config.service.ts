import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { ConfigEntity } from './entities/config.entity';
import IBaseService from 'src/interfaces/baseService.interface';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';
import {
  DeleteConfigDTO,
  SaveConfigDTO,
  UpdateConfigDTO,
} from './dto/config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import SystemMessageService from '../system-message/system-message.service';

@Injectable()
export default class ConfigService implements IBaseService<ConfigEntity> {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepo: Repository<ConfigEntity>,
    private readonly sysMsgService: SystemMessageService,
  ) {}

  async getList(
    entityParams: FindOptionsWhere<ConfigEntity>,
    { pageIndex = 1, pageSize = 20 }: IQueryParams,
    ...props: any
  ): Promise<[] | ConfigEntity[]> {
    let responseData = [];

    responseData = await this.configRepo.find({
      where: entityParams,
      skip: OffsetUtil.getOffset({ pageSize, pageIndex }),
      take: pageSize,
    });

    return responseData;
  }

  async get(
    entityParams: FindOptionsWhere<ConfigEntity>,
    ...props: any
  ): Promise<ConfigEntity> {
    let responseData = null;

    responseData = await this.configRepo.findOneBy(entityParams);

    if (responseData === null) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'CONFIG_ID_NOT_EXISTS',
        404,
      );
    }

    return responseData;
  }

  async save(data: SaveConfigDTO): Promise<ConfigEntity> {
    const saveResponse = await this.configRepo.save({ ...data });

    if (!saveResponse.id) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'SAVE_ERROR',
        500,
      );
    }

    return saveResponse;
  }

  async update(data: UpdateConfigDTO): Promise<string> {
    const updateResponse = await this.configRepo.update(
      { id: data.configID },
      {
        promptContent: data.promptContent,
        chunkOverlap: data.chunkOverlap,
        chunkSize: data.chunkSize,
        k: data.k,
        description: data.description,
        splitted: data.splitted,
      },
    );

    if (!updateResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'UPDATE_ERROR',
        500,
      );
    }

    return await this.sysMsgService.getSysMessage('UPDATE_SUCCESS');
  }

  async delete(data: DeleteConfigDTO): Promise<string | string[]> {
    const deleteResponse = await this.configRepo.softDelete({
      id: In(data.IDs),
    });

    if (!deleteResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'DELETE_ERROR',
        500,
      );
    }

    return await this.sysMsgService.getSysMessage('DELETE_SUCCESS');
  }
}
