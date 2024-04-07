import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import IBaseService from 'src/interfaces/baseService.interface';
import SharedConversationEntity from '../chat/entities/sharedConversations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IQueryParams } from 'src/interfaces/query.interface';
import { IAuthToken } from 'src/interfaces/auth.interface';
import {
  DeleteSharedConversationDTO,
  SaveSharedConversationDTO,
  UpdateSharedConversationDTO,
} from '../chat/dto/sharedConversation.dto';
import { ConversationService } from '../conversation';
import { v4 } from 'uuid';

@Injectable()
export default class SharedConversationService
  implements IBaseService<SharedConversationEntity>
{
  constructor(
    @InjectRepository(SharedConversationEntity)
    private readonly sharedRepo: Repository<SharedConversationEntity>,
    private readonly conversationService: ConversationService,
  ) {}
  async getList(
    entityParams: Partial<SharedConversationEntity>,
    ...props: any
  ): Promise<[] | SharedConversationEntity[]> {
    let responseData = [];

    responseData = await this.sharedRepo.find({
      where: { userID: entityParams.id },
    });

    return responseData;
  }

  async get(
    entityParams: Partial<SharedConversationEntity>,
    ...props: any
  ): Promise<SharedConversationEntity> {
    let responseData = null;

    responseData = await this.sharedRepo.findOneBy({
      id: entityParams.id,
    });

    if (responseData === null) {
      throw new NotFoundException('Không tìm thấy cuộc hội thoại được chia sẻ');
    }

    return responseData;
  }

  async save(
    authToken: IAuthToken,
    data: SaveSharedConversationDTO,
  ): Promise<string> {
    const { conversationID } = data;
    const { id } = authToken;

    const conversation = await this.conversationService.get({
      id: conversationID,
      userID: id,
    });

    if (await this.sharedRepo.findOneBy({ conversation })) {
      throw new BadRequestException(
        'Cuộc hội thoại này đã được chia sẻ từ trước',
      );
    }

    const saveResponse = await this.sharedRepo.save({
      userID: id,
      conversation,
    });

    return saveResponse.sharedCode;
  }

  async update(
    authToken: IAuthToken,
    data: UpdateSharedConversationDTO,
  ): Promise<string> {
    const { sharedConversationID } = data;
    const newSharedCode = v4().toUpperCase();

    console.log(newSharedCode);
    const updateResponse = await this.sharedRepo.update(
      { id: sharedConversationID },
      { sharedCode: newSharedCode },
    );

    if (!updateResponse.affected) {
      throw new BadRequestException('Cập nhật không thành công');
    }

    return 'Cập nhật thành công';
  }

  async delete(
    authToken: IAuthToken,
    data: DeleteSharedConversationDTO,
  ): Promise<string | string[]> {
    const deleteResponse = await this.sharedRepo.delete({ id: In(data.IDs) });

    if (deleteResponse.affected) {
      throw new BadRequestException('Xóa không thành công');
    }

    return 'Xóa thành công';
  }
}
