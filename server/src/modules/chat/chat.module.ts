import { Module } from '@nestjs/common';
import ChatController from './chat.controller';
import ChatService from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConversationEntity from './entities/conversations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [],
})
export default class ChatModule {}
