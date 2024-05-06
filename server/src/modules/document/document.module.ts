import { Module } from '@nestjs/common';
import DocumentService from './document.service';
import DocumentController from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { ConfigEntity } from '../config/entities/config.entity';
import { ConfigModule, ConfigService } from '../config';
@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, ConfigEntity]),
    ConfigModule,
  ],
  providers: [DocumentService, ConfigService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export default class DocumentModule {}
