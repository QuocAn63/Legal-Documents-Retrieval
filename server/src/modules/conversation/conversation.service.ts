import { Body, Injectable } from '@nestjs/common';
import IBaseService from 'src/interfaces/baseService.interface';
import ConversationEntity from './entities/conversations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';
import { IAuthToken } from 'src/interfaces/auth.interface';
import {
  DeleteConversationDTO,
  SaveConversationDTO,
  UpdateConversationDTO,
} from './dto/conversation.dto';
import SystemMessageService from '../system-message/system-message.service';
import SharedConversationEntity from '../shared-conversation/entities/sharedConversations.entity';

@Injectable()
export default class ConversationService
  implements IBaseService<ConversationEntity>
{
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepo: Repository<ConversationEntity>,
    @InjectRepository(SharedConversationEntity)
    private readonly sharedRepo: Repository<SharedConversationEntity>,
    private readonly sysMsgService: SystemMessageService,
  ) {}

  async getList(
    entityParams: FindOptionsWhere<ConversationEntity>,
    pagination: IQueryParams,
    ...props: any
  ): Promise<[] | ConversationEntity[]> {
    let responseData = [];

    responseData = await this.conversationRepo.find({
      where: entityParams,
      skip: OffsetUtil.getOffset(pagination),
      take: pagination.pageSize,
    });

    return responseData;
  }

  async get(
    entityParams: FindOptionsWhere<ConversationEntity>,
    ...props: any
  ): Promise<ConversationEntity> {
    let responseData = null;

    responseData = await this.conversationRepo.findOneBy({
      id: entityParams.id,
      userID: entityParams.userID,
    });

    if (responseData === null) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'CONVERSATION_ID_NOT_EXISTS',
        404,
      );
    }

    return responseData;
  }

  async save(
    authToken: IAuthToken,
    @Body() data: SaveConversationDTO,
  ): Promise<ConversationEntity> {
    const saveResponse = await this.conversationRepo.save({
      userID: authToken.id,
      ...data,
    });

    if (saveResponse === null) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'SAVE_ERROR',
        500,
      );
    }

    return saveResponse;
  }

  async update(
    authToken: IAuthToken,
    data: UpdateConversationDTO,
  ): Promise<string> {
    const { id } = authToken;
    const { conversationID, ...updateData } = data;
    const updateResponse = await this.conversationRepo.update(
      {
        id: data.conversationID,
        userID: id,
      },
      { ...updateData },
    );

    if (!updateResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'UPDATE_ERROR',
      );
    }

    return await this.sysMsgService.getSysMessage('UPDATE_SUCCESS');
  }

  async delete(
    authToken: IAuthToken,
    data: DeleteConversationDTO,
  ): Promise<string> {
    const { id } = authToken;

    const deleteResponse = await this.conversationRepo.softDelete({
      id: In(data.IDs),
      userID: id,
    });

    const deleteSharedResponse = await this.sharedRepo.delete({
      conversationID: In(data.IDs),
    });

    if (!deleteResponse.affected || !deleteResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'DELETE_ERROR',
      );
    }

    return await this.sysMsgService.getSysMessage('DELETE_SUCCESS');
  }
}
