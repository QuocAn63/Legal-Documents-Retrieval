import { Module } from '@nestjs/common';
import DocumentService from './document.service';
import DocumentController from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { ConfigEntity } from '../config/entities/config.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { diskStorage } from 'multer';
import { editedFilename, pdfFileFilter } from 'src/configs/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, ConfigEntity]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dest = configService.getOrThrow('DOCUMENT_PATH');

        return {
          storage: diskStorage({
            filename: editedFilename,
            destination: dest,
          }),
          fileFilter: pdfFileFilter,
        };
      },
    }),
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export default class DocumentModule {}
