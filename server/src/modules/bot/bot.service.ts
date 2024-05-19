import { Injectable } from '@nestjs/common';
import { DocumentService } from '../document';
import {
  CharacterTextSplitter,
  RecursiveCharacterTextSplitter,
} from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { AttributeInfo } from 'langchain/schema/query_constructor';
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import {
  FunctionalTranslator,
  SelfQueryRetriever,
} from 'langchain/retrievers/self_query';
import { Document } from '@langchain/core/documents';
import { ConversationService } from '../conversation';
import { MessageService } from '../message/message.service';
import { IAuthToken } from 'src/interfaces/auth.interface';
import ConversationEntity from '../conversation/entities/conversations.entity';
import { ConfigService } from '../config';
import { PromptTemplate } from '@langchain/core/prompts';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { IMessage } from 'src/interfaces/chat.interface';
import { join } from 'path';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

@Injectable()
export default class BotService {
  constructor(
    private readonly documentService: DocumentService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
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

  async bot(
    input: string,
    authToken: IAuthToken,
    messages: IMessage[],
    conversationID?: string,
  ) {
    const config = await this.configService.get({
      id: '9DD530E3-3908-EF11-9765-7C67A2EE2BB7',
    });
    const documentsResponse = await this.documentService.getList(
      {
        configID: config.id,
      },
      { pageIndex: 1, pageSize: 500 },
    );
    let documents = documentsResponse.map(
      (doc) =>
        new Document({
          pageContent: doc.content,
          metadata: {
            id: doc.id,
            label: doc.label,
          },
        }),
    );
    const prompt = PromptTemplate.fromTemplate(config.promptContent);
    const llm = new OpenAI({
      model: 'gpt-3.5-turbo-0125',
      temperature: 0,
      streaming: true,
      verbose: true,
    });
    const embedding = new OpenAIEmbeddings({ model: 'text-embedding-3-small' });
    let processedDocs: Document[] = documents;

    // Splitting
    if (config.splitted) {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkOverlap: Number.parseInt(config.chunkOverlap),
        chunkSize: Number.parseInt(config.chunkSize),
      });

      processedDocs = await splitter.splitDocuments(documents);
    }

    // Storing as vector
    const vectorStore = await MemoryVectorStore.fromDocuments(
      processedDocs,
      embedding,
    );

    // Creating retriever instance
    const retriever = vectorStore.asRetriever({
      k: Number.parseInt(config.k),
    });

    // Creating chains
    const combineDocsChain = await createStuffDocumentsChain({
      llm,
      prompt,
    });

    const retrieverChain = await createRetrievalChain({
      combineDocsChain,
      retriever,
    });

    const response = await retrieverChain.invoke({
      input,
      chat_history: messages
        .map((message) => `${message.role}: ${message.content}`)
        .join('\n'),
    });

    const saveMessageResponse = await this.saveMessages(
      input,
      response.answer,
      authToken,
      conversationID,
    );

    return {
      response,
      ...saveMessageResponse,
    };
  }

  async load() {
    const dir = join(__dirname, '../../../db/documents/luatdatdai2013.pdf');
    const loader = new PDFLoader(dir, {
      splitPages: false,
    });

    const docs = await loader.load();

    const response = await this.documentService.save({
      configID: '9DD530E3-3908-EF11-9765-7C67A2EE2BB7',
      content: docs[0].pageContent,
      label: '',
      rank: 0,
    });

    return response.id;
  }
}
