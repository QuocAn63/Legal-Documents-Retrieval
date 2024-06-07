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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
import {
  QueryTransformPipe,
  filterKeys,
} from 'src/commons/pipes/queryTransform.pipe';
import { MessageService } from '../message/message.service';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('conversations')
@Controller('conversations')
export default class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  @Get('/')
  async getList_conversations(
    @AuthToken() authToken: IAuthToken,
    @Pagination(20) pagination: IQueryParams,
    @Query(QueryTransformPipe) queries: FilterConversationDTO,
  ) {
    const { id } = authToken;

    const filteredQueries = filterKeys<FilterConversationDTO>(queries, [
      'title',
    ]);
    return await this.conversationService.getList(
      { userID: id, isArchived: false, ...filteredQueries },
      pagination,
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
      { userID: id, isArchived: true },
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

  @Get('/:conversationID/messages')
  async getList_messages(
    @AuthToken() authToken: IAuthToken,
    @Pagination(5) pagination: IQueryParams,
    @Param('conversationID') conversationID: string,
  ) {
    const { id } = authToken;
    const conversation = await this.conversationService.get({
      id: conversationID,
      userID: id,
    });

    const messages = await this.messageService.getList(
      { conversationID: conversation.id },
      pagination,
    );

    return {
      ...conversation,
      messages,
    };
  }

  @Post('/')
  async save_conversations(
    @AuthToken() authToken: IAuthToken,
    @Body() data: SaveConversationDTO,
  ) {
    const newConversation = await this.conversationService.save(
      authToken,
      data,
    );

    return newConversation.id;
  }

  @Patch('/')
  async update_conversation(
    @AuthToken() authToken: IAuthToken,
    @Body() data: UpdateConversationDTO,
  ) {
    return await this.conversationService.update(authToken, data);
  }

  @Delete('/all')
  async deleteAll_conversation(@AuthToken() authToken: IAuthToken) {
    return await this.conversationService.deleteAll(authToken);
  }

  @Delete('/')
  async delete_conversation(
    @AuthToken() authToken: IAuthToken,
    @Body() data: DeleteConversationDTO,
  ) {
    return await this.conversationService.delete(authToken, data);
  }
}
