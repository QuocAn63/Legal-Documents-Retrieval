import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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

  @Post('/fakeinvoke')
  async fakeInvoke(
    @AuthToken() authToken: IAuthToken,
    @Body() data: CreateConversationDTO,
  ) {
    return this.fakeBotService.create(authToken, data);
  }

  @Post('/invoke')
  async invoke(@AuthToken() authToken: IAuthToken, @Body() data: AskDTO) {
    return await this.botService.ask(
      data.chunkSize,
      data.chunkOverlap,
      data.input,
    );
  }
}
