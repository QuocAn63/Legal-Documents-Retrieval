import { Module } from '@nestjs/common';
import DocumentService from './document.service';
import DocumentController from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { ConfigEntity } from '../config/entities/config.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService as AppConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { editedFilename, pdfFileFilter } from 'src/configs/multer.config';
import { ConfigModule, ConfigService } from '../config';
@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, ConfigEntity]),
    MulterModule.registerAsync({
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => {
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
    ConfigModule,
  ],
  providers: [DocumentService, ConfigService],
  controllers: [DocumentController],
})
export default class DocumentModule {}
