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
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard, RolesGuard } from 'src/commons/guards';
import ChatService from './chat.service';
import ConversationEntity from './entities/conversations.entity';
import { AuthToken } from 'src/commons/decorators/auth.decorator';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { IQueryParams } from 'src/interfaces/query.interface';
import MessageEntity from './entities/messages.entity';
import SharedConversationEntity from './entities/sharedConversations.entity';
import {
  DeleteConversationDTO,
  SaveConversationDTO,
  UpdateConversationDTO,
} from './dto/conversation.dto';
import { DeleteMessageDTO, SaveMessageDTO } from './dto/message.dto';
import {
  DeleteSharedConversationDTO,
  SaveSharedConversationDTO,
  UpdateSharedConversationDTO,
} from './dto/sharedConversation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@UseGuards(AuthGuard, RolesGuard)
@Roles('USER')
@Controller('/chat')
export default class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/conversations')
  async getList_conversations(
    @AuthToken() authToken: IAuthToken,
    @Pagination(20) pagination: IQueryParams,
  ) {
    const { id } = authToken;
    const { pageIndex, pageSize } = pagination;
    return await this.chatService.getList<ConversationEntity>(
      { userID: id, isArchived: '0' },
      { pageIndex, pageSize },
    );
  }

  @Get('/conversations/archived')
  async getList_archivedConversations(
    @AuthToken() authToken: IAuthToken,
    @Pagination(20) pagination: IQueryParams,
  ) {
    const { id } = authToken;
    const { pageIndex, pageSize } = pagination;
    return this.chatService.getList<ConversationEntity>(
      { userID: id, isArchived: '1' },
      { pageIndex, pageSize },
    );
  }

  @Get('/conversations/shared')
  async getList_sharedConversations(
    @AuthToken() authToken: IAuthToken,
    @Pagination(20) pagination: IQueryParams,
  ) {
    const { id } = authToken;
    const { pageIndex, pageSize } = pagination;
    return this.chatService.getList<SharedConversationEntity>(
      { userID: id },
      { pageIndex, pageSize },
    );
  }

  @Get('/conversations/:conversationID')
  async getList_messages(
    @AuthToken() authToken: IAuthToken,
    @Pagination(5) pagination: IQueryParams,
    @Param('conversationID') conversationID: string,
  ) {
    if (!conversationID) {
      throw new NotFoundException(
        'Không tìm thấy cuộc trò chuyện cũng như tin nhắn của cuộc trò chuyện này.',
      );
    }

    const { id } = authToken;
    const { pageIndex, pageSize, toDate } = pagination;

    return this.chatService.getList<MessageEntity>(
      { userID: id, conversationID },
      { pageIndex, pageSize, toDate },
    );
  }

  @Post('/conversations')
  async save_conversations(
    @AuthToken() authToken: IAuthToken,
    @Body() data: SaveConversationDTO,
  ) {
    const { id } = authToken;

    return await this.chatService.save<SaveConversationDTO>(id, data);
  }

  @Post('/messages')
  async save_messages(
    @AuthToken() authToken: IAuthToken,
    @Body() data: SaveMessageDTO,
  ) {
    const { id } = authToken;

    return await this.chatService.save<SaveMessageDTO>(id, data);
  }

  @Post('/conversations/shared')
  async save_sharedConversation(
    @AuthToken() authToken: IAuthToken,
    @Body() data: SaveSharedConversationDTO,
  ) {
    const { id } = authToken;

    return await this.chatService.save<SaveSharedConversationDTO>(id, data);
  }

  @Patch('/conversations')
  async update_conversation(
    @AuthToken() authToken: IAuthToken,
    @Body() data: UpdateConversationDTO,
  ) {
    const { id } = authToken;

    return await this.chatService.update<UpdateConversationDTO>(id, data);
  }

  @Patch('/conversations/shared')
  async update_sharedConversation(
    @AuthToken() authToken: IAuthToken,
    @Body() data: UpdateSharedConversationDTO,
  ) {
    const { id } = authToken;

    return await this.chatService.update<UpdateSharedConversationDTO>(id, data);
  }

  @Delete('/conversations')
  async delete_conversation(
    @AuthToken() authToken: IAuthToken,
    @Body() data: DeleteConversationDTO,
  ) {
    const { id } = authToken;

    return await this.chatService.delete<DeleteConversationDTO>(id, data);
  }

  @Delete('/conversations/shared')
  async delete_sharedConversation(
    @AuthToken() authToken: IAuthToken,
    @Body() data: DeleteSharedConversationDTO,
  ) {
    const { id } = authToken;

    return await this.chatService.delete<DeleteSharedConversationDTO>(id, data);
  }

  @Delete('/conversations/messages')
  async delete_messages(
    @AuthToken() authToken: IAuthToken,
    @Body() data: DeleteMessageDTO,
  ) {
    const { id } = authToken;

    return await this.chatService.delete<DeleteMessageDTO>(id, data);
  }

  // Reports
  @Post('/messages/:messageID/report')
  async report_messages() {}
}
