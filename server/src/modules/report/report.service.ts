import { Injectable } from '@nestjs/common';
import IBaseService from 'src/interfaces/baseService.interface';
import ReportEntity from './entities/report.entity';
import { FindOptionsWhere, Like, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';

@Injectable()
export default class ReportService implements IBaseService<ReportEntity> {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
  ) {}

  async getList(
    entityParams: FindOptionsWhere<ReportEntity>,
    { pageIndex = 1, pageSize = 20 }: IQueryParams,
  ): Promise<ReportEntity[] | []> {
    let responseData = [];

    responseData = await this.reportRepo.find({
      where: entityParams,
      skip: OffsetUtil.getOffset(pageIndex, pageSize),
      take: pageSize,
    });

    return responseData;
  }

  get(...props: any): Promise<ReportEntity> {
    return;
  }

  save(...props: any): Promise<string> {
    return;
  }

  update(...props: any): Promise<string> {
    return;
  }

  delete(...props: any): Promise<string | string[]> {
    return;
  }
}
