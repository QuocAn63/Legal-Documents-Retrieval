import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import ConversationEntity from './entities/conversations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import SharedConversationEntity from './entities/sharedConversations.entity';
import OffsetUtil from 'src/utils/offset.util';
import { IQueryParams } from 'src/interfaces/query.interface';
import IBaseService from 'src/interfaces/baseService.interface';
import {
  DeleteSharedConversationDTO,
  SaveSharedConversationDTO,
  UpdateSharedConversationDTO,
} from './dto/sharedConversation.dto';
import {
  DeleteConversationDTO,
  SaveConversationDTO,
  UpdateConversationDTO,
} from './dto/conversation.dto';
import MessageEntity from './entities/messages.entity';
import {
  DeleteMessageDTO,
  SaveMessageDTO,
  UpdateMessageDTO,
} from './dto/message.dto';

@Injectable()
export default class ChatService
  implements
    IBaseService<ConversationEntity | SharedConversationEntity | MessageEntity>
{
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepo: Repository<ConversationEntity>,
    @InjectRepository(SharedConversationEntity)
    private readonly sharedConversationRepo: Repository<SharedConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
  ) {}

  async getList<T>(
    entityParams: Partial<T>,
    { pageIndex = 1, pageSize = 20 }: IQueryParams,
  ): Promise<T[] | []> {
    let responseData;

    const offset = OffsetUtil.getOffset(pageIndex, pageSize);

    if (entityParams instanceof ConversationEntity) {
      responseData = await this.conversationRepo.find({
        where: { ...(entityParams as any) },
        skip: offset,
        take: pageSize,
      });
    }

    if (entityParams instanceof SharedConversationEntity) {
      responseData = await this.sharedConversationRepo.find({
        where: { ...(entityParams as any) },
        skip: offset,
        take: pageSize,
      });
    }

    if (entityParams instanceof MessageEntity) {
      responseData = await this.messageRepo.find({
        where: { ...(entityParams as any) },
        skip: offset,
        take: pageSize,
      });
    }

    return responseData;
  }

  async save<
    T extends SaveConversationDTO | SaveSharedConversationDTO | SaveMessageDTO,
  >(userID: string, data: T): Promise<string> {
    let saveResponse:
      | SharedConversationEntity
      | ConversationEntity
      | MessageEntity;
    let repo: Repository<
      ConversationEntity | SharedConversationEntity | MessageEntity
    >;

    if (data instanceof SaveConversationDTO) {
      repo = this.conversationRepo;
    } else if (data instanceof SaveSharedConversationDTO) {
      repo = this.sharedConversationRepo;
    } else if (data instanceof SaveMessageDTO) {
      repo = this.messageRepo;
    } else {
      throw new BadRequestException();
    }

    saveResponse = await repo.save({ userID, ...data });

    return saveResponse.id;
  }

  async get(
    ...props: any
  ): Promise<ConversationEntity | SharedConversationEntity | MessageEntity> {
    return;
  }

  async update<T extends UpdateConversationDTO | UpdateSharedConversationDTO>(
    userID: string,
    data: T,
  ): Promise<string> {
    let updateResponse;
    let repo: Repository<ConversationEntity | SharedConversationEntity>;
    let findOptions: FindOptionsWhere<
      ConversationEntity | SharedConversationEntity
    >;

    if (data instanceof UpdateSharedConversationDTO) {
      repo = this.sharedConversationRepo;
      findOptions = { id: data.sharedConversationID, userID };
    } else if (data instanceof UpdateConversationDTO) {
      repo = this.conversationRepo;
      findOptions = { id: data.conversationID, userID };
    } else {
      throw new BadRequestException();
    }

    updateResponse = await repo.update(findOptions, { ...data });

    return updateResponse.id;
  }

  async delete<
    T extends
      | DeleteConversationDTO
      | DeleteSharedConversationDTO
      | DeleteMessageDTO,
  >(userID: string, data: T): Promise<string[]> {
    let deleteResponse;
    let repo: Repository<
      ConversationEntity | SharedConversationEntity | MessageEntity
    >;

    if (data instanceof DeleteConversationDTO) {
      repo = this.conversationRepo;
    } else if (data instanceof DeleteSharedConversationDTO) {
      repo = this.sharedConversationRepo;
    } else if (data instanceof DeleteMessageDTO) {
      repo = this.messageRepo;
    }

    deleteResponse = await repo.delete({ id: In(data.IDs) });

    return deleteResponse;
  }
}
