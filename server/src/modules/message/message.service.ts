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

@Injectable()
export class MessageService implements IBaseService<MessageEntity> {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
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
        createdAt: 'DESC',
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

    if (!responseData) throw new NotFoundException('Không tìm thấy tin nhắn');

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
    });

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
      throw new BadRequestException('Cập nhật không thành công');
    }

    return 'Cập nhật thành công';
  }

  async delete(
    authToken: IAuthToken,
    data: DeleteMessageDTO,
  ): Promise<string | string[]> {
    const deleteResponse = await this.messageRepo.delete({ id: In(data.IDs) });

    if (!deleteResponse.affected) {
      throw new BadRequestException('Xóa không thành công');
    }

    return 'Xóa thành công';
  }
}
