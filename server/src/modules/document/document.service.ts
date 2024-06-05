import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import IBaseService from 'src/interfaces/baseService.interface';
import { IQueryParams } from 'src/interfaces/query.interface';
import OffsetUtil from 'src/utils/offset.util';
import {
  DeleteDocumentDTO,
  SaveDocumentDTO,
  UpdateDocumentDTO,
} from './dto/document.dto';
import { ConfigService } from '../config';
import SystemMessageService from '../system-message/system-message.service';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { join } from 'path';
import { unlinkSync, writeFileSync } from 'fs';

@Injectable()
export default class DocumentService implements IBaseService<DocumentEntity> {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,
    private readonly configService: ConfigService,
    private readonly sysMsgServce: SystemMessageService,
  ) {}

  async getList(
    entityParams: FindOptionsWhere<DocumentEntity>,
    pagination: IQueryParams,
    ...props: any
  ): Promise<DocumentEntity[]> {
    let responseData = [];

    responseData = await this.documentRepo.find({
      where: entityParams,
      skip: OffsetUtil.getOffset(pagination),
      take: pagination.pageSize,
      order: {
        rank: 'asc',
      },
    });

    return responseData;
  }

  async get(
    entityParams: FindOptionsWhere<DocumentEntity>,
    ...props: any
  ): Promise<DocumentEntity> {
    let responseData: DocumentEntity | null = null;

    responseData = await this.documentRepo.findOneBy(entityParams);

    if (responseData === null) {
      await this.sysMsgServce.getSysMessageAndThrowHttpException(
        'DOCUMENT_NOT_EXISTS',
        404,
      );
    }

    return responseData;
  }

  async save(data: SaveDocumentDTO): Promise<DocumentEntity> {
    const { configID } = data;

    const config = await this.configService.get({ id: configID });

    const saveResponse = await this.documentRepo.save({
      config,
      ...data,
    });

    if (saveResponse === null) {
      await this.sysMsgServce.getSysMessageAndThrowHttpException(
        'UPDATE_ERROR',
      );
    }

    return saveResponse;
  }

  async update(data: UpdateDocumentDTO): Promise<string> {
    const updateResponse = await this.documentRepo.update(
      { id: data.documentID },
      { label: data.label, rank: data.rank, content: data.content },
    );

    if (!updateResponse.affected) {
      await this.sysMsgServce.getSysMessageAndThrowHttpException(
        'UPDATE_ERROR',
      );
    }

    return await this.sysMsgServce.getSysMessage('UPDATE_SUCCESS');
  }

  async delete(data: DeleteDocumentDTO): Promise<string | string[]> {
    const deleteResponse = await this.documentRepo.delete({ id: In(data.IDs) });

    if (!deleteResponse.affected) {
      await this.sysMsgServce.getSysMessageAndThrowHttpException(
        'DELETE_ERROR',
      );
    }

    return await this.sysMsgServce.getSysMessage('DELETE_SUCCESS');
  }

  async extractText(file: Express.Multer.File): Promise<string> {
    console.log(file);
    const tempFilePath = join(
      __dirname,
      '../../../',
      'db/documents/',
      file.originalname,
    );
    writeFileSync(tempFilePath, file.buffer);

    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();

    unlinkSync(tempFilePath);

    const text = docs.map((doc) => doc.pageContent).join('\n');

    return text;
  }
}
