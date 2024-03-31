import { Module } from '@nestjs/common';
import DocumentService from './document.service';
import DocumentController from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { ConfigEntity } from '../config/entities/config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity, ConfigEntity])],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export default class DocumentModule {}
