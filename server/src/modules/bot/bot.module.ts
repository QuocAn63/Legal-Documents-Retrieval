import { Module } from '@nestjs/common';
import { default as BotController } from './bot.controller';
import { default as BotService } from './bot.service';

@Module({
  controllers: [BotController],
  providers: [BotService],
})
export default class BotModule {}
