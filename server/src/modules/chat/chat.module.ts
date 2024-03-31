import { Module } from '@nestjs/common';
import ChatController from './chat.controller';
import ChatService from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConversationEntity from './entities/conversations.entity';
import MessageEntity from './entities/messages.entity';
import SharedConversationEntity from './entities/sharedConversations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationEntity,
      MessageEntity,
      SharedConversationEntity,
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [],
})
export default class ChatModule {}
