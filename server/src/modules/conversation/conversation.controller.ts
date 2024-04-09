import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthToken } from 'src/commons/decorators/auth.decorator';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { IQueryParams } from 'src/interfaces/query.interface';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import {
  DeleteConversationDTO,
  FilterConversationDTO,
  SaveConversationDTO,
  UpdateConversationDTO,
} from './dto/conversation.dto';
import ConversationService from './conversation.service';
import { AuthGuard } from 'src/commons/guards';
import ConversationEntity from '../chat/entities/conversations.entity';
import { FindOptionsWhere } from 'typeorm';
import { QueryTransformPipe } from 'src/commons/pipes/queryTransform.pipe';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('conversations')
@Controller('conversations')
export default class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('/')
  async getList_conversations(
    @AuthToken() authToken: IAuthToken,
    @Pagination(20) pagination: IQueryParams,
    @Query(QueryTransformPipe) queries: FilterConversationDTO,
  ) {
    console.log(queries);
    const { id } = authToken;
    const { pageIndex, pageSize } = pagination;
    return await this.conversationService.getList(
      { userID: id, isArchived: '0', ...queries },
      { pageIndex, pageSize },
    );
  }

  @Get('/archived')
  async getList_archivedConversations(
    @AuthToken() authToken: IAuthToken,
    @Pagination(20) pagination: IQueryParams,
  ) {
    const { id } = authToken;
    const { pageIndex, pageSize } = pagination;
    return this.conversationService.getList(
      { userID: id, isArchived: '1' },
      { pageIndex, pageSize },
    );
  }

  @Get('/:conversationID')
  async get_conversations(
    @AuthToken() authToken: IAuthToken,
    @Param('conversationID') conversationID: string,
  ) {
    if (!conversationID) {
      throw new NotFoundException('Không tìm thấy cuộc trò chuyện.');
    }

    const { id } = authToken;

    return this.conversationService.get({ userID: id, id: conversationID }, {});
  }

  //   @Get('/:conversationID/messages')
  //   async getList_messages(
  //     @AuthToken() authToken: IAuthToken,
  //     @Pagination(5) pagination: IQueryParams,
  //     @Param('conversationID') conversationID: string,
  //   ) {
  //     if (!conversationID) {
  //       throw new NotFoundException(
  //         'Không tìm thấy cuộc trò chuyện cũng như tin nhắn của cuộc trò chuyện này.',
  //       );
  //     }

  //     const { id } = authToken;
  //     const { pageIndex, pageSize, toDate } = pagination;

  //     return this.conversationService.getList(
  //       { userID: id, conversationID },
  //       { pageIndex, pageSize, toDate },
  //     );
  //   }

  @Post('/')
  async save_conversations(
    @AuthToken() authToken: IAuthToken,
    @Body() data: SaveConversationDTO,
  ) {
    return await this.conversationService.save(authToken, data);
  }

  @Patch('/')
  async update_conversation(
    @AuthToken() authToken: IAuthToken,
    @Body() data: UpdateConversationDTO,
  ) {
    return await this.conversationService.update(authToken, data);
  }

  @Delete('/conversations')
  async delete_conversation(
    @AuthToken() authToken: IAuthToken,
    @Body() data: DeleteConversationDTO,
  ) {
    return await this.conversationService.delete(authToken, data);
  }
}
