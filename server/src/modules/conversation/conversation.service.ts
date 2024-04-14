import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

@Injectable()
export default class ConversationService
  implements IBaseService<ConversationEntity>
{
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepo: Repository<ConversationEntity>,
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
    console.log(entityParams);

    responseData = await this.conversationRepo.findOneBy({
      id: entityParams.id,
      userID: entityParams.userID,
    });

    if (responseData === null) {
      throw new NotFoundException('Không tìm thấy cuộc trò chuyện');
    }

    return responseData;
  }

  async save(
    authToken: IAuthToken,
    @Body() data: SaveConversationDTO,
  ): Promise<ConversationEntity> {
    const { id } = authToken;

    const newObj = this.conversationRepo.create({
      ...data,
      userID: id,
    });

    const saveResponse = await newObj.save();

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
      throw new BadRequestException('Cập nhật không thành công');
    }

    return conversationID;
  }

  async delete(
    authToken: IAuthToken,
    data: DeleteConversationDTO,
  ): Promise<string> {
    const { id } = authToken;

    const saveResponse = await this.conversationRepo.delete({
      id: In(data.IDs),
      userID: id,
    });

    if (!saveResponse.affected) {
      throw new BadRequestException('Xóa không thành công');
    }

    return saveResponse.raw;
  }
}
