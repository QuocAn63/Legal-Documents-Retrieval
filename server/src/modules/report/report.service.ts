import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import IBaseService from 'src/interfaces/baseService.interface';
import ReportEntity from './entities/report.entity';
import { FindOptionsWhere, In, Like, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';
import {
  DeleteReportDTO,
  SaveReportDTO,
  UpdateReportDTO,
} from './dto/reports.dto';
import { IAuthToken } from 'src/interfaces/auth.interface';
import ReportReasonEntity from './entities/reportReason.entity';
import {
  DeleteReasonDTO,
  SaveReasonDTO,
  UpdateReasonDTO,
} from './dto/reasons.dto';
import MessageEntity from '../message/entities/messages.entity';

@Injectable()
export default class ReportService implements IBaseService<ReportEntity> {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
    @InjectRepository(ReportReasonEntity)
    private readonly reasonRepo: Repository<ReportReasonEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
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

  async getList_reasons() {
    return this.reasonRepo.find();
  }

  async get(
    entityParams: FindOptionsWhere<ReportEntity>,
  ): Promise<ReportEntity> {
    let responseData: ReportEntity = null;

    responseData = await this.reportRepo.findOne({
      where: entityParams,

      relations: ['message', 'reason'],
    });

    if (responseData === null) {
      throw new NotFoundException('Không tìm thấy báo cáo.');
    }

    return responseData;
  }

  async save(
    authToken: IAuthToken,
    data: SaveReportDTO,
  ): Promise<ReportEntity> {
    if (
      await this.reportRepo.findOneBy({
        messageID: data.messageID,
        userID: authToken.id,
      })
    ) {
      throw new BadRequestException('Bạn đã báo cáo phản hồi này rồi');
    }

    if (
      await this.messageRepo.findOneBy({
        id: data.messageID,
        isBOT: false,
      })
    ) {
      throw new BadRequestException('Đây không phải là tin nhắn phản hồi');
    }
    const saveReponse = await this.reportRepo.save({
      userID: authToken.id,
      ...data,
      status: '0',
    });

    if (!saveReponse) {
      throw new BadRequestException('Không thể lưu');
    }

    return saveReponse;
  }

  async save_reasons(data: SaveReasonDTO): Promise<ReportReasonEntity> {
    const saveReponse = await this.reasonRepo.save({
      ...data,
    });

    if (!saveReponse) {
      throw new BadRequestException('Không thể lưu');
    }

    return saveReponse;
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

  async update_reasons(data: UpdateReasonDTO): Promise<string> {
    const updateResponse = await this.reportRepo.update(
      { id: data.reasonID },
      { description: data.description },
    );

    if (!updateResponse.affected) {
      throw new BadRequestException('Cập nhật không thành công');
    }

    return 'Cập nhật thành công';
  }

  async delete(data: DeleteReportDTO): Promise<string> {
    const deleteResponse = await this.reportRepo.softDelete({
      id: In(data.IDs),
    });

    if (!deleteResponse.affected) {
      throw new BadRequestException('Xóa không thành công');
    }

    return 'Xóa thành công';
  }

  async delete_reasons(data: DeleteReasonDTO): Promise<string> {
    const deleteResponse = await this.reportRepo.softDelete({
      id: In(data.IDs),
    });

    if (!deleteResponse.affected) {
      throw new BadRequestException('Xóa không thành công');
    }

    return 'Xóa thành công';
  }
}
