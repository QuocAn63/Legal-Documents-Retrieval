import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import ConversationEntity from './entities/conversations.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class ChatService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  async getList() {}
}
