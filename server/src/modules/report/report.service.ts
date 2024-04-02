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
    let findOptions: FindOptionsWhere<ReportEntity>;
    let responseData: ReportEntity[] = [];
    let offset = OffsetUtil.getOffset(pageIndex, pageSize);

    findOptions = {
      id: Raw(
        (raw) =>
          `1 = 1 AND (${raw} IS NULL OR ${raw} = '' OR [id] = ${params.id}`,
      ),
      messageID: Raw(
        (raw) =>
          `(${raw} IS NULL OR ${raw} = '' OR [messageID] = ${params.messageID}`,
      ),
      reasonID: Raw(
        (raw) =>
          `(${raw} IS NULL OR ${raw} = '' OR [reasonID] = ${params.reasonID}`,
      ),
      status: Raw(
        (raw) =>
          `(${raw} IS NULL OR ${raw} = '' OR [status] = ${params.status}`,
      ),
      userID: Raw(
        (raw) =>
          `(${raw} IS NULL OR ${raw} = '' OR [userID] = ${params.userID}`,
      ),
      description: Like(params.description || ''),
    };

    responseData = await this.reportRepo.find({
      where: findOptions,
      take: pageSize,
      skip: offset,
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
