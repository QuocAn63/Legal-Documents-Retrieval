import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import IBaseService from 'src/interfaces/baseService.interface';
import ReportEntity from './entities/report.entity';
import { FindOptionsWhere, Like, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';
import { SaveReportDTO, UpdateReportDTO } from './dto/reports.dto';
import { IAuthToken } from 'src/interfaces/auth.interface';

@Injectable()
export default class ReportService implements IBaseService<ReportEntity> {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
  ) {}

  async getList(
    entityParams: FindOptionsWhere<ReportEntity>,
    pagination: IQueryParams,
  ): Promise<ReportEntity[] | []> {
    let responseData = [];

    responseData = await this.reportRepo.find({
      where: entityParams,
      skip: OffsetUtil.getOffset(pagination),
      take: pagination.pageSize,
    });

    return responseData;
  }

  async get(
    entityParams: FindOptionsWhere<ReportEntity>,
  ): Promise<ReportEntity> {
    let responseData = null;

    responseData = await this.reportRepo.findOneBy(entityParams);

    if (responseData === null) {
      throw new NotFoundException('Không tìm thấy báo cáo.');
    }

    return responseData;
  }

  async save(authToken: IAuthToken, data: SaveReportDTO): Promise<string> {
    const saveReponse = await this.reportRepo.save({
      userID: authToken.id,
      ...data,
    });

    if (!saveReponse.id) {
      throw new BadRequestException('Không thể lưu');
    }

    return saveReponse.id;
  }

  async update(data: UpdateReportDTO): Promise<string> {
    const updateResponse = await this.reportRepo.update(
      { id: data.reportID },
      { status: data.status },
    );

    if (!updateResponse.affected) {
      throw new BadRequestException('Cập nhật không thành công');
    }

    return 'Cập nhật thành công';
  }

  delete(...props: any): Promise<string | string[]> {
    return;
  }
}
