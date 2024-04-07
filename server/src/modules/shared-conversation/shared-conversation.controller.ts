import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import SharedsharedService from './shared-conversation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthToken } from 'src/commons/decorators/auth.decorator';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { IQueryParams } from 'src/interfaces/query.interface';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import {
  DeleteSharedConversationDTO,
  SaveSharedConversationDTO,
  UpdateSharedConversationDTO,
} from '../chat/dto/sharedConversation.dto';
import { AuthGuard } from 'src/commons/guards';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('sharedConversations')
@Controller('sharedConversations')
export default class SharedConversationController {
  constructor(private readonly sharedService: SharedsharedService) {}

  @Get('/')
  async getList_sharedConversations(
    @AuthToken() authToken: IAuthToken,
    @Pagination(20) pagination: IQueryParams,
  ) {
    const { id } = authToken;
    const { pageIndex, pageSize } = pagination;

    return await this.sharedService.getList(
      { userID: id },
      { pageIndex, pageSize },
    );
  }

  @Get('/:sharedConversationID')
  async get_sharedConversations(
    @AuthToken() authToken: IAuthToken,
    @Param('sharedConversationID') sharedConversationID: string,
  ) {
    if (!sharedConversationID) {
      throw new NotFoundException('Không tìm thấy cuộc trò chuyện.');
    }

    const { id } = authToken;

    return this.sharedService.get({ userID: id, id: sharedConversationID }, {});
  }

  @Post('/')
  async save_sharedConversations(
    @AuthToken() authToken: IAuthToken,
    @Body() data: SaveSharedConversationDTO,
  ) {
    return await this.sharedService.save(authToken, data);
  }

  @Patch('/')
  async update_conversation(
    @AuthToken() authToken: IAuthToken,
    @Body() data: UpdateSharedConversationDTO,
  ) {
    return await this.sharedService.update(authToken, data);
  }

  @Delete('/conversations')
  async delete_conversation(
    @AuthToken() authToken: IAuthToken,
    @Body() data: DeleteSharedConversationDTO,
  ) {
    return await this.sharedService.delete(authToken, data);
  }
}
