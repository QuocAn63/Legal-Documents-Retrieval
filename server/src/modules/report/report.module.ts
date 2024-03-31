import { Module } from '@nestjs/common';
import ReportService from './report.service';
import ReportController from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ReportEntity from './entities/report.entity';
import ReportReasonEntity from './entities/reportReason.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity, ReportReasonEntity])],
  providers: [ReportService],
  controllers: [ReportController],
})
export default class ReportModule {}
