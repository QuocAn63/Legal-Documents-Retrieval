import { Module } from '@nestjs/common';
import BotController from './bot.controller';
import FakeBotService from './fakebot.service';
import { ConversationModule } from '../conversation';
import { MessageModule } from '../message/message.module';
import BotService from './bot.service';
import { DocumentModule } from '../document';

@Module({
  imports: [ConversationModule, MessageModule, DocumentModule],
  providers: [BotService, FakeBotService],
  controllers: [BotController],
})
export default class BotModule {}
