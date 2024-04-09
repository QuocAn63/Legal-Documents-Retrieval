import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import IBaseService from 'src/interfaces/baseService.interface';
import ConversationEntity from '../chat/entities/conversations.entity';
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
import { Pagination } from 'src/commons/decorators/pagination.decorator';

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
    { pageIndex, pageSize }: IQueryParams,
    ...props: any
  ): Promise<[] | ConversationEntity[]> {
    let responseData = [];
    const offset = OffsetUtil.getOffset(pageIndex, pageSize);

    responseData = await this.conversationRepo.find({
      where: entityParams,
      skip: offset,
      take: pageSize,
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
    userToken: IAuthToken,
    @Body() data: SaveConversationDTO,
  ): Promise<string> {
    const { id } = userToken;

    const newObj = this.conversationRepo.create({
      ...data,
      userID: id,
    });

    const saveResponse = await newObj.save();

    return saveResponse.id;
  }

  async update(
    userToken: IAuthToken,
    data: UpdateConversationDTO,
  ): Promise<string> {
    const { id } = userToken;
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
    userToken: IAuthToken,
    data: DeleteConversationDTO,
  ): Promise<string> {
    const { id } = userToken;

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
