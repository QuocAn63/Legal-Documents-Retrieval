import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import SQLStoreProcedure from 'src/utils/proc.utils';
import ConversationEntity from './entities/conversations.entity';

@Injectable()
export default class ChatService {
  private storedProcedure: SQLStoreProcedure<{ title: string }>;
  constructor(private conversationRepository: Repository<{ title: string }>) {
    this.storedProcedure = new SQLStoreProcedure(conversationRepository);
  }

  async getList() {
    return this.storedProcedure.executeProcedure(
      'sp_conversations',
      'GetDataAll',
      {},
    );
  }
}
