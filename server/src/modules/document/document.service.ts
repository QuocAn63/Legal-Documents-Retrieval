import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import IBaseService from 'src/interfaces/baseService.interface';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';
import { SaveDocumentDTO } from './dto/document.dto';

@Injectable()
export default class DocumentService implements IBaseService<DocumentEntity> {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,
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

  async save(data: SaveDocumentDTO): Promise<string> {
    return;
  }
}
