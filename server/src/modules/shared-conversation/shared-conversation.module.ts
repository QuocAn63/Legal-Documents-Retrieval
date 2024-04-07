import { Module } from '@nestjs/common';
import SharedConversationController from './shared-conversation.controller';
import SharedConversationService from './shared-conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import SharedConversationEntity from '../chat/entities/sharedConversations.entity';
import { ConversationService } from '../conversation';
import ConversationEntity from '../chat/entities/conversations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SharedConversationEntity, ConversationEntity]),
  ],
  controllers: [SharedConversationController],
  providers: [SharedConversationService, ConversationService],
})
export default class SharedConversationModule {}
