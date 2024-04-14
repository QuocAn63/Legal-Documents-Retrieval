import { Module } from '@nestjs/common';
import SharedConversationController from './shared-conversation.controller';
import SharedConversationService from './shared-conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import SharedConversationEntity from './entities/sharedConversations.entity';
import { ConversationService } from '../conversation';
import ConversationEntity from '../conversation/entities/conversations.entity';
import { MessageModule } from '../message/message.module';
import { MessageService } from '../message/message.service';
import MessageEntity from '../message/entities/messages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SharedConversationEntity,
      ConversationEntity,
      MessageEntity,
    ]),
    MessageModule,
  ],
  controllers: [SharedConversationController],
  providers: [SharedConversationService, ConversationService, MessageService],
})
export default class SharedConversationModule {}
