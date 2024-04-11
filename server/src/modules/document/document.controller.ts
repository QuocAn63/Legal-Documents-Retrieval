import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import DocumentService from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateMessages } from 'src/enum/validateMessages';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from 'src/commons/guards';
import { Roles } from 'src/commons/decorators/roles.decorator';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('documents')
export default class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('document'))
  async save_documents(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 3000000,
            message: ValidateMessages.DOCUMENT_FILE_SIZE,
          }),
          new FileTypeValidator({ fileType: 'pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
  }
}
