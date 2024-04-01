import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptions, In, Repository } from 'typeorm';
import ConversationEntity from './entities/conversations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import SharedConversationEntity from './entities/sharedConversations.entity';
import OffsetUtil from 'src/utils/offset.util';
import { IQueryParams } from 'src/interfaces/query.interface';
import IBaseService from 'src/interfaces/baseService.interface';
import {
  SaveSharedConversationDTO,
  UpdateSharedConversationDTO,
} from './dto/sharedConversation.dto';
import {
  SaveConversationDTO,
  UpdateConversationDTO,
} from './dto/conversation.dto';
import MessageEntity from './entities/messages.entity';

type ConversationType = 'Normal' | 'Shared' | 'Archived';

type NormalConvParams = Pick<
  ConversationEntity,
  'title' | 'isArchived' | 'userID'
>;
type SharedConvParams = Pick<SharedConversationEntity, 'userID'>;

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

  // async getList<T extends ConversationType>(
  //   type: T,
  //   params: T extends 'Shared' ? SharedConvParams : NormalConvParams,
  //   pagination: IQueryParams,
  // ): Promise<ConversationEntity[] | SharedConversationEntity[]> {
  //   let data: ConversationEntity[] | SharedConversationEntity[];
  //   let offset = OffsetUtil.getOffset(
  //     pagination.pageIndex | 1,
  //     pagination.pageIndex | 20,
  //   );

  //   if (type === 'Shared') {
  //     data = await this.sharedConversationRepo.find({
  //       where: { ...params },
  //       skip: offset,
  //       relations: ['conversations'],
  //     });
  //   } else {
  //     data = await this.conversationRepo.find({
  //       where: { ...params, isArchived: type === 'Normal' ? '0' : '1' },
  //       skip: offset,
  //     });
  //   }

  //   return data;
  // }

  async getList<T>(
    entityParams: Partial<T>,
    { pageIndex, pageSize }: IQueryParams,
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

  async get<T extends ConversationType>(type: T, id: string) {
    let data: SharedConversationEntity | ConversationEntity;

    if (type === 'Shared') {
      data = await this.sharedConversationRepo.findOne({
        where: { id },
        relations: ['conversations'],
      });
    } else
      data = await this.conversationRepo.findOne({
        where: { id, isArchived: type === 'Normal' ? '0' : '1' },
      });

    return data;
  }

  async save<T extends ConversationType>(
    type: T,
    data: T extends 'Shared' ? SaveSharedConversationDTO : SaveConversationDTO,
  ): Promise<string> {
    let saveResponse: SharedConversationEntity | ConversationEntity;

    if (type === 'Shared') {
      saveResponse = await this.sharedConversationRepo.save({ ...data });
    } else {
      saveResponse = await this.conversationRepo.save({ ...data });
    }

    return saveResponse.id;
  }

  async update<T extends ConversationType>(
    type: T,
    data: T extends 'Shared'
      ? UpdateSharedConversationDTO
      : UpdateConversationDTO,
  ): Promise<string> {
    let updateResponse;

    if (type === 'Shared') {
      updateResponse = await this.sharedConversationRepo.update(
        { id: data.conversationID, userID: data.userID },
        { ...data },
      );
    } else {
      updateResponse = await this.conversationRepo.update(
        { id: data.conversationID, userID: data.userID },
        { ...data },
      );
    }

    return updateResponse.id;
  }

  async delete<T extends ConversationType>(
    type: T,
    IDs: string[],
  ): Promise<string[]> {
    let deleteResponse;

    if (type === 'Shared') {
      deleteResponse = await this.sharedConversationRepo.delete({
        id: In(IDs),
      });
    } else {
      deleteResponse = await this.conversationRepo.delete({ id: In(IDs) });
    }

    console.log(deleteResponse);

    return IDs;
  }
}
