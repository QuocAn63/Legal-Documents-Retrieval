import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import IBaseService from 'src/interfaces/baseService.interface';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';
import {
  DeleteDocumentDTO,
  SaveDocumentDTO,
  UpdateDocumentDTO,
} from './dto/document.dto';
import { ConfigService } from '../config';

@Injectable()
export default class DocumentService implements IBaseService<DocumentEntity> {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,
    private readonly configService: ConfigService,
  ) {}

  async getList(
    entityParams: FindOptionsWhere<DocumentEntity>,
    pagination: IQueryParams,
    ...props: any
  ): Promise<[] | DocumentEntity[]> {
    let responseData = [];

    responseData = await this.documentRepo.find({
      where: entityParams,
      skip: OffsetUtil.getOffset(pagination),
      take: pagination.pageSize,
    });

    return responseData;
  }

  async get(
    entityParams: FindOptionsWhere<DocumentEntity>,
    ...props: any
  ): Promise<DocumentEntity> {
    let responseData = null;

    responseData = await this.documentRepo.findOneBy(entityParams);

    if (responseData === null) {
      throw new NotFoundException('Không tìm thấy tài liệu');
    }

    return responseData;
  }

  async save(
    data: SaveDocumentDTO,
    file: Express.Multer.File,
  ): Promise<DocumentEntity> {
    const { configID } = data;

    const config = await this.configService.get({ id: configID });

    const saveResponse = await this.documentRepo.save({
      config,
      label: data.label,
      rank: data.rank,
      path: file.path,
    });

    if (!saveResponse.id) {
      throw new BadRequestException('Lưu không thành công');
    }

    return saveResponse;
  }

  async update(data: UpdateDocumentDTO): Promise<string> {
    const config = await this.configService.get({ id: data.configID });

    if (
      await this.documentRepo.findOneBy({
        id: Not(data.documentID),
        rank: data.rank,
        config,
      })
    ) {
      throw new BadRequestException('Trùng thứ tự tài liệu');
    }

    const updateResponse = await this.documentRepo.update(
      { id: data.documentID },
      { label: data.label, rank: data.rank },
    );

    if (!updateResponse.affected) {
      throw new BadRequestException('Cập nhật không thành công');
    }

    return 'Cập nhật thành công';
  }

  async delete(data: DeleteDocumentDTO): Promise<string | string[]> {
    const deleteResponse = await this.documentRepo.delete({ id: In(data.IDs) });

    if (!deleteResponse.affected) {
      throw new BadRequestException('Xóa không thành công');
    }

    return 'Xóa thành công';
  }
}
