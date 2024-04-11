import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import IBaseService from 'src/interfaces/baseService.interface';
import { IQueryParams } from 'src/interfaces/query.interface';

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
    const responseData = [];

    responseData = await this.documentRepo.find({ where: entityParams });
  }
}
