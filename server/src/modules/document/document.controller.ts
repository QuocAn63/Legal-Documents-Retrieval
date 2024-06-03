import {
  Body,
  Controller,
  FileTypeValidator,
  ForbiddenException,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import DocumentService from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from 'src/commons/guards';
import { Roles } from 'src/commons/decorators/roles.decorator';
import {
  FilterDocumentDTO,
  SaveDocumentDTO,
  UpdateDocumentDTO,
} from './dto/document.dto';
import { RequestWithFileValidation } from 'src/interfaces/request.interface';
import { QueryTransformPipe } from 'src/commons/pipes/queryTransform.pipe';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { IQueryParams } from 'src/interfaces/query.interface';
import { diskStorage, memoryStorage } from 'multer';
import { join } from 'path';
import { editedFilename, pdfFileFilter } from 'src/configs/multer.config';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('documents')
export default class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('/')
  async getList_documents(
    @Query(QueryTransformPipe) queries: FilterDocumentDTO,
    @Pagination() pagination: IQueryParams,
  ) {
    return this.documentService.getList(queries, pagination);
  }

  @Get('/:documentID')
  async get_document(@Param('documentID') documentID: string) {
    return this.documentService.get({ id: documentID });
  }

  @ApiBody({
    type: SaveDocumentDTO,
  })
  @Post('/')
  async save_documents(@Body() data: SaveDocumentDTO) {
    const newDocument = await this.documentService.save(data);
    return newDocument.id;
  }

  @Patch('/')
  async update_documents(@Body() data: UpdateDocumentDTO) {
    return await this.documentService.update(data);
  }

  @ApiConsumes('multipart/form-data')
  @Post('/extract')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: pdfFileFilter,
    }),
  )
  async extractText_documents(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this.documentService.extractText(file);
  }
}
