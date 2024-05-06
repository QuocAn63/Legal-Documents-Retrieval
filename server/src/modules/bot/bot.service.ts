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

@Injectable()
export default class BotService {
  constructor(private readonly documentService: DocumentService) {}

  async ask(chunkSize: number, chunkOverlap: number, input: string) {
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

      const response = await selfQueryRetriever.invoke(input);

      return response;
    } catch (err) {
      console.log(err);

      return;
    }
  }
}
