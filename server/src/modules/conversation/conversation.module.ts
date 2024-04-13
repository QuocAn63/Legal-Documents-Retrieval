import { Module } from '@nestjs/common';
import ConversationService from './conversation.service';
import ConversationController from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConversationEntity from './entities/conversations.entity';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity]), MessageModule],
  providers: [ConversationService],
  controllers: [ConversationController],
  exports: [ConversationService],
})
export default class ConversationModule {}
