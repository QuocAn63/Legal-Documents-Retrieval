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
import SystemMessageService from '../system-message/system-message.service';
import { ValidateMessages } from 'src/enum/validateMessages';

@Injectable()
export default class ReportService implements IBaseService<ReportEntity> {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
    @InjectRepository(ReportReasonEntity)
    private readonly reasonRepo: Repository<ReportReasonEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    private readonly sysMsgService: SystemMessageService,
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
    let responseData: any;
    const queryBuilder = this.reportRepo.createQueryBuilder('report');

    responseData = await queryBuilder
      .leftJoinAndSelect('report.message', 'message')
      .leftJoinAndSelect('message.replyToMessage', 'replyToMessage')
      .where({ id: entityParams.id })
      .getOne();

    if (responseData === null) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        ValidateMessages.REPORT_NOT_EXISTS,
        404,
      );
    }

    const { replyToMessage, ...message } = responseData.message;

    responseData = {
      id: responseData.id,
      messages: [replyToMessage, message],
    };

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
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        ValidateMessages.REPORT_ALREADY_SEND,
        400,
      );
    }

    if (
      await this.messageRepo.findOneBy({
        id: data.messageID,
        isBOT: false,
      })
    ) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        ValidateMessages.REPORT_MESSAGE_INVALID,
        400,
      );
    }
    const saveReponse = await this.reportRepo.save({
      userID: authToken.id,
      ...data,
      status: '0',
    });

    if (!saveReponse) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'SAVE_ERROR',
        500,
      );
    }

    return saveReponse;
  }

  async save_reasons(data: SaveReasonDTO): Promise<ReportReasonEntity> {
    const saveReponse = await this.reasonRepo.save({
      ...data,
    });

    if (!saveReponse) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'SAVE_ERROR',
        500,
      );
    }

    return saveReponse;
  }

  async update(data: UpdateReportDTO): Promise<string> {
    const updateResponse = await this.reportRepo.update(
      { id: data.reportID },
      { status: data.status },
    );

    if (!updateResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'UPDATE_ERROR',
      );
    }

    return await this.sysMsgService.getSysMessage('UPDATE_SUCCESS');
  }

  async update_reasons(data: UpdateReasonDTO): Promise<string> {
    const updateResponse = await this.reportRepo.update(
      { id: data.reasonID },
      { description: data.description },
    );

    if (!updateResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'UPDATE_ERROR',
      );
    }

    return await this.sysMsgService.getSysMessage('UPDATE_SUCCESS');
  }

  async delete(data: DeleteReportDTO): Promise<string> {
    const deleteResponse = await this.reportRepo.softDelete({
      id: In(data.IDs),
    });

    if (!deleteResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'DELETE_ERROR',
      );
    }

    return await this.sysMsgService.getSysMessage('DELETE_SUCCESS');
  }

  async delete_reasons(data: DeleteReasonDTO): Promise<string> {
    const deleteResponse = await this.reportRepo.softDelete({
      id: In(data.IDs),
    });

    if (!deleteResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'DELETE_ERROR',
      );
    }

    return await this.sysMsgService.getSysMessage('DELETE_SUCCESS');
  }
}
