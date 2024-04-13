import { Module } from '@nestjs/common';
import BotController from './bot.controller';
import BotService from './fakebot.service';
import { ConversationModule } from '../conversation';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [ConversationModule, MessageModule],
  providers: [BotService],
  controllers: [BotController],
})
export default class BotModule {}
