import {
  Body,
  Controller,
  ForbiddenException,
  Post,
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
import { SaveDocumentDTO } from './dto/document.dto';
import { RequestWithFileValidation } from 'src/interfaces/request.interface';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('documents')
export default class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: SaveDocumentDTO,
  })
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async save_documents(
    @Req() request: RequestWithFileValidation,
    @Body() data: SaveDocumentDTO,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (request.fileValidation !== undefined) {
      throw new ForbiddenException(request.fileValidation);
    }

    return await this.documentService.save(data, file);
  }
}
