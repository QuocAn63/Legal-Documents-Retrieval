import { Injectable } from '@nestjs/common';
import { DocumentService } from '../document';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { AttributeInfo } from 'langchain/schema/query_constructor';
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import {
  FunctionalTranslator,
  SelfQueryRetriever,
} from 'langchain/retrievers/self_query';
import { Document } from '@langchain/core/documents';
import { ConversationService } from '../conversation';
import { MessageService } from '../message/message.service';
import { IAuthToken } from 'src/interfaces/auth.interface';
import ConversationEntity from '../conversation/entities/conversations.entity';

@Injectable()
export default class BotService {
  constructor(
    private readonly documentService: DocumentService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  async ask(
    chunkSize: number,
    chunkOverlap: number,
    input: string,
    authToken: IAuthToken,
    conversationID?: string,
  ) {
    // load all documents
    const dbDocuments = await this.documentService.getList(
      { configID: '9DD530E3-3908-EF11-9765-7C67A2EE2BB7' },
      { pageIndex: 1, pageSize: 500 },
    );

    const splitter = new CharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });

    let documents = [];

    for (const doc of dbDocuments) {
      const newDoc = new Document({
        pageContent: doc.content,
        metadata: {
          source: doc.id,
          title: doc.label,
        },
      });
      documents.push(newDoc);
    }

    const attributeInfo: AttributeInfo[] = [
      {
        name: 'title',
        description: 'Tiêu đề của văn bản luật',
        type: 'string',
      },
      {
        name: 'source',
        description: 'ID của tài liệu trong cơ sở dữ liệu',
        type: 'string',
      },
    ];

    const vectorStore = await MemoryVectorStore.fromDocuments(
      documents,
      new OpenAIEmbeddings({ model: 'text-embedding-3-small' }),
    );

    const llm = new OpenAI({
      model: 'gpt-3.5-turbo-0125',
      temperature: 0,
    });

    try {
      const selfQueryRetriever = SelfQueryRetriever.fromLLM({
        llm,
        vectorStore,
        documentContents:
          'Văn bản luật đất đai 2013 của CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
        attributeInfo,
        structuredQueryTranslator: new FunctionalTranslator(),
      });

      // const response = await selfQueryRetriever.invoke(input);
      const response = await llm.invoke(input);

      const messages = await this.saveMessages(
        input,
        response,
        authToken,
        conversationID,
      );
      return {
        response,
        ...messages,
      };
    } catch (err) {
      console.log(err);

      return;
    }
  }

  private async saveMessages(
    userInput: string,
    botResponse: string,
    authToken: IAuthToken,
    conversationID?: string,
  ) {
    try {
      let conversation: ConversationEntity;
      if (conversationID) {
        conversation = await this.conversationService.get({
          id: conversationID,
        });
      } else {
        conversation = await this.conversationService.save(authToken, {
          title: userInput.substring(0, 100),
        });
      }

      const newUserMessage = await this.messageService.save(
        authToken,
        {
          content: userInput,
          conversationID: conversation.id,
        },
        false,
      );
      const newBotMessage = await this.messageService.save(
        { id: '5E17D4A0-ABF8-EE11-9758-7C67A2EE2BB7' },
        {
          content: botResponse,
          conversationID: conversation.id,
          replyToMessageID: newUserMessage.id,
        },
        true,
      );

      return {
        conversationID: conversation.id,
        messageID: newUserMessage.id,
        botMessageID: newBotMessage.id,
      };
    } catch (err) {
      throw new err();
    }
  }
}
