import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ReportService from './report.service';
import { AuthGuard, RolesGuard } from 'src/commons/guards';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { QueryTransformPipe } from 'src/commons/pipes/queryTransform.pipe';
import { FilterReportDTO, SaveReportDTO } from './dto/reports.dto';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { IQueryParams } from 'src/interfaces/query.interface';
import { AuthToken } from 'src/commons/decorators/auth.decorator';
import { IAuthToken } from 'src/interfaces/auth.interface';

@ApiBearerAuth()
@ApiTags('reports')
@Roles('ADMIN')
@UseGuards(AuthGuard, RolesGuard)
@Controller('reports')
export default class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/')
  async getList_reports(
    @Query(QueryTransformPipe) queries: FilterReportDTO,
    @Pagination() pagination: IQueryParams,
  ) {
    return await this.reportService.getList(queries, pagination);
  }

  @Get('/:reportID')
  async get_reports(@Param('reportID') reportID: string) {
    return await this.reportService.get({ id: reportID });
  }

  @Post('/')
  async save_reports(@AuthToken() authToken: IAuthToken, data: SaveReportDTO) {
    return await this.reportService.save(authToken, data);
  }
}
