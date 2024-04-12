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

@Injectable()
export default class ConfigService implements IBaseService<ConfigEntity> {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepo: Repository<ConfigEntity>,
  ) {}

  async getList(
    entityParams: FindOptionsWhere<ConfigEntity>,
    pagination: IQueryParams,
    ...props: any
  ): Promise<[] | ConfigEntity[]> {
    let responseData = [];

    responseData = await this.configRepo.find({
      where: entityParams,
      skip: OffsetUtil.getOffset(pagination),
      take: pagination.pageSize,
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
      throw new NotFoundException('Không tìm thấy cấu hình');
    }

    return responseData;
  }

  async save(data: SaveConfigDTO): Promise<ConfigEntity> {
    const saveResponse = await this.configRepo.save({ ...data });

    if (!saveResponse.id) {
      throw new BadRequestException('Lưu không thành công');
    }

    return saveResponse;
  }

  async update(data: UpdateConfigDTO): Promise<string> {
    const updateResponse = await this.configRepo.update(
      { id: data.configID },
      { promptContent: data.promptContent },
    );

    if (!updateResponse.affected) {
      throw new BadRequestException('Cập nhật không thành công');
    }

    return 'Cập nhật thành công';
  }

  async delete(data: DeleteConfigDTO): Promise<string | string[]> {
    const deleteResponse = await this.configRepo.softDelete({
      id: In(data.IDs),
    });

    if (!deleteResponse.affected) {
      throw new BadRequestException('Xóa không thành công');
    }

    return 'Xóa thành công';
  }
}
