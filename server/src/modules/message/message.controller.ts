import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/commons/guards';
import { AuthToken } from 'src/commons/decorators/auth.decorator';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { IQueryParams } from 'src/interfaces/query.interface';
import {
  DeleteMessageDTO,
  SaveMessageDTO,
  UpdateMessageDTO,
} from './dto/message.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/')
  async getList_messages(
    @AuthToken() authToken: IAuthToken,
    @Pagination(5) pagination: IQueryParams,
  ) {
    return await this.messageService.getList(
      { userID: authToken.id },
      pagination,
    );
  }

  @Get('/:messageID')
  async get_messages(
    @AuthToken() authToken: IAuthToken,
    @Param('messageID') messageID: string,
  ) {
    return await this.messageService.get({
      userID: authToken.id,
      id: messageID,
    });
  }

  @Post('/')
  async save_messages(
    @AuthToken() authToken: IAuthToken,
    @Body() data: SaveMessageDTO,
  ) {
    return await this.messageService.save(authToken, data);
  }

  @Patch('/')
  async update_messages(
    @AuthToken() authToken: IAuthToken,
    @Body() data: UpdateMessageDTO,
  ) {
    return await this.messageService.update(authToken, data);
  }

  @Delete('/')
  async delete_messages(
    @AuthToken() authToken: IAuthToken,
    @Body() data: DeleteMessageDTO,
  ) {
    return await this.messageService.delete(authToken, data);
  }
}
