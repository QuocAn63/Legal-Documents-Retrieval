import {
  HttpException,
  HttpExceptionOptions,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SystemMessageEntity from './entities/systemMessage.entity';
import { Repository } from 'typeorm';
import { ValidateMessages } from 'src/enum/validateMessages';

@Injectable()
export default class SystemMessageService {
  constructor(
    @InjectRepository(SystemMessageEntity)
    private readonly sysMsgRepo: Repository<SystemMessageEntity>,
  ) {}

  async getSysMessage(messageID: string | ValidateMessages): Promise<string> {
    const message =
      (await this.sysMsgRepo.findOneBy({ id: messageID })).content || 'Lỗi';

    return message;
  }

  async getSysMessageAndThrowHttpException(
    messageID: string | ValidateMessages,
    status = 500,
  ) {
    const message = await this.getSysMessage(messageID);

    throw new HttpException(message, status);
  }
}
