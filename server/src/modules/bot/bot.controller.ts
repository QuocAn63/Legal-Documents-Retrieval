import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthToken } from 'src/commons/decorators/auth.decorator';
import { AuthGuard } from 'src/commons/guards';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { AskDTO, CreateConversationDTO } from './bot.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import FakeBotService from './fakebot.service';
import BotService from './bot.service';

@ApiBearerAuth()
@ApiTags('bot')
@UseGuards(AuthGuard)
@Controller('bot')
export default class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly fakeBotService: FakeBotService,
  ) {}

  @Post('/invoke')
  async invoke(@AuthToken() authToken: IAuthToken, @Body() data: AskDTO) {
    return await this.botService.bot(
      data.input,
      authToken,
      [],
      data.conversationID,
    );
  }

  @Get('/load')
  async load() {
    return await this.botService.load();
  }
}
