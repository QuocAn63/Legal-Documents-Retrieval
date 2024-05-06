import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import MessageEntity from './entities/messages.entity';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import IBaseService from 'src/interfaces/baseService.interface';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';
import {
  DeleteMessageDTO,
  SaveMessageDTO,
  UpdateMessageDTO,
} from './dto/message.dto';
import { IAuthToken } from 'src/interfaces/auth.interface';
import SystemMessageService from '../system-message/system-message.service';

@Injectable()
export class MessageService implements IBaseService<MessageEntity> {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    private readonly sysMsgService: SystemMessageService,
  ) {}

  async getList(
    entityParams: FindOptionsWhere<MessageEntity>,
    pagination: IQueryParams,
    ...props: any
  ): Promise<[] | MessageEntity[]> {
    let responseData = [];

    responseData = await this.messageRepo.find({
      where: entityParams,
      skip: OffsetUtil.getOffset(pagination),
      take: pagination.pageSize,
      order: {
        createdAt: 'ASC',
      },
    });

    return responseData;
  }

  async get(
    entityParams: FindOptionsWhere<MessageEntity>,
    ...props: any
  ): Promise<MessageEntity> {
    let responseData = null;

    responseData = await this.messageRepo.findOneBy({ ...entityParams });

    if (!responseData) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'MESSAGE_NOT_EXISTS',
        404,
      );
    }

    return responseData;
  }

  async save(
    authToken: IAuthToken,
    data: SaveMessageDTO,
    isBOT = false,
  ): Promise<MessageEntity> {
    const saveResponse = await this.messageRepo.save({
      conversationID: data.conversationID,
      userID: authToken.id,
      content: data.content,
      isBOT: isBOT,
      replyToMessageID: data.replyToMessageID || null,
    });

    if (saveResponse === null) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'SAVE_ERROR',
        500,
      );
    }

    return saveResponse;
  }

  async update(authToken: IAuthToken, data: UpdateMessageDTO): Promise<string> {
    const updateResponse = await this.messageRepo.update(
      {
        conversationID: data.conversationID,
        id: data.messageID,
      },
      { content: data.content },
    );

    if (!updateResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'UPDATE_ERROR',
        500,
      );
    }

    return await this.sysMsgService.getSysMessage('UPDATE_SUCCESS');
  }

  async delete(
    authToken: IAuthToken,
    data: DeleteMessageDTO,
  ): Promise<string | string[]> {
    const deleteResponse = await this.messageRepo.delete({ id: In(data.IDs) });

    if (!deleteResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'DELETE_ERROR',
        500,
      );
    }

    return await this.sysMsgService.getSysMessage('DELETE_SUCCESS');
  }
}
