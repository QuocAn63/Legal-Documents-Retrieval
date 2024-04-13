import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthToken } from 'src/commons/decorators/auth.decorator';
import { AuthGuard } from 'src/commons/guards';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { CreateConversationDTO } from './bot.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import BotService from './fakebot.service';

@ApiBearerAuth()
@ApiTags('bot')
@UseGuards(AuthGuard)
@Controller('bot')
export default class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('/invoke')
  async invoke(
    @AuthToken() authToken: IAuthToken,
    @Body() data: CreateConversationDTO,
  ) {
    return this.botService.create(authToken, data);
  }
}
