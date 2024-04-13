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
  ): Promise<SharedConversationEntity> {
    let responseData = null;

    responseData = await this.sharedRepo.findOneBy({
      ...entityParams,
    });

    if (responseData === null) {
      throw new NotFoundException('Không tìm thấy cuộc hội thoại được chia sẻ');
    }

    return responseData;
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

    if (await this.sharedRepo.findOneBy({ conversation })) {
      throw new BadRequestException(
        'Cuộc hội thoại này đã được chia sẻ từ trước',
      );
    }

    const saveResponse = await this.sharedRepo.save({
      userID: id,
      conversation,
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
      throw new BadRequestException('Cập nhật không thành công');
    }

    return 'Cập nhật thành công';
  }

  async delete(
    authToken: IAuthToken,
    data: DeleteSharedConversationDTO,
  ): Promise<string | string[]> {
    const deleteResponse = await this.sharedRepo.delete({
      id: In(data.IDs),
      userID: authToken.id,
    });

    if (deleteResponse.affected) {
      throw new BadRequestException('Xóa không thành công');
    }

    return 'Xóa thành công';
  }
}
