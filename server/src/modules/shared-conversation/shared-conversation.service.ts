import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import IBaseService from 'src/interfaces/baseService.interface';
import SharedConversationEntity from './entities/sharedConversations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { IQueryParams } from 'src/interfaces/query.interface';
import { IAuthToken } from 'src/interfaces/auth.interface';
import {
  DeleteSharedConversationDTO,
  SaveSharedConversationDTO,
  UpdateSharedConversationDTO,
} from './dto/sharedConversation.dto';
import { ConversationService } from '../conversation';
import { v4 } from 'uuid';
import MessageEntity from '../message/entities/messages.entity';
import { MessageService } from '../message/message.service';
import SystemMessageService from '../system-message/system-message.service';
import { ValidateMessages } from 'src/enum/validateMessages';

export interface SharedConversationWithMessages
  extends SharedConversationEntity {
  messages: MessageEntity[];
}

@Injectable()
export default class SharedConversationService
  implements IBaseService<SharedConversationEntity>
{
  constructor(
    @InjectRepository(SharedConversationEntity)
    private readonly sharedRepo: Repository<SharedConversationEntity>,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly sysMsgService: SystemMessageService,
  ) {}
  async getList(
    entityParams: FindOptionsWhere<SharedConversationEntity>,
    ...props: any
  ): Promise<[] | SharedConversationEntity[]> {
    let responseData = [];
    const { userID, ...params } = entityParams;

    responseData = await this.sharedRepo.find({
      where: { userID, ...params },
    });

    return responseData;
  }

  async get(
    entityParams: FindOptionsWhere<SharedConversationEntity>,
    ...props: any
  ) {
    let sharedConversation: SharedConversationEntity = null;

    sharedConversation = await this.sharedRepo.findOne({
      where: { ...entityParams },
      relations: ['messages', 'conversation'],
    });

    if (sharedConversation === null) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        ValidateMessages.SHAREDCONVERSATION_NOT_EXISTS,
        404,
      );
    }

    return sharedConversation;
  }

  async save(
    authToken: IAuthToken,
    data: SaveSharedConversationDTO,
  ): Promise<SharedConversationEntity> {
    const { conversationID } = data;
    const { id } = authToken;

    const conversation = await this.conversationService.get({
      id: conversationID,
      userID: id,
    });

    if (await this.sharedRepo.findOneBy({ conversationID: conversation.id })) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'SHAREDCONVERSATION_ALREADY_SHARED',
        400,
      );
    }

    const messages = await this.messageService.getList(
      {
        conversationID: conversation.id,
      },
      { pageIndex: 1, pageSize: 100 },
    );

    const saveResponse = await this.sharedRepo.save({
      userID: id,
      conversation,
      messages,
    });

    return saveResponse;
  }

  async update(
    authToken: IAuthToken,
    data: UpdateSharedConversationDTO,
  ): Promise<string> {
    const { sharedConversationID } = data;
    const newSharedCode = v4().toUpperCase();

    console.log(newSharedCode);
    const updateResponse = await this.sharedRepo.update(
      { id: sharedConversationID, userID: authToken.id },
      { sharedCode: newSharedCode },
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
    data: DeleteSharedConversationDTO,
  ): Promise<string | string[]> {
    const deleteResponse = await this.sharedRepo.delete({
      id: In(data.IDs),
      userID: authToken.id,
    });

    if (!deleteResponse.affected) {
      await this.sysMsgService.getSysMessageAndThrowHttpException(
        'DELETE_ERROR',
      );
    }

    return await this.sysMsgService.getSysMessage('DELETE_SUCCESS');
  }
}
