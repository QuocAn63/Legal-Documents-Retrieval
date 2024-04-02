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
    params: Partial<ReportEntity>,
    { pageIndex = 1, pageSize = 20 }: IQueryParams,
  ): Promise<ReportEntity[] | []> {
    const queryBuilder = this.reportRepo.createQueryBuilder('reports');

    for (const field in params) {
      if (params[field] !== undefined) {
        const value = params[field];

        queryBuilder.andWhere(`reports.${field} = :value`, { value });
      }
    }

    queryBuilder.skip(OffsetUtil.getOffset(pageIndex, pageSize)).take(pageSize);

    return await queryBuilder.getMany();
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
