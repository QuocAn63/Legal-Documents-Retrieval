import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ReportService from './report.service';
import { AuthGuard, RolesGuard } from 'src/commons/guards';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { QueryTransformPipe } from 'src/commons/pipes/queryTransform.pipe';
import {
  DeleteReportDTO,
  FilterReportDTO,
  SaveReportDTO,
  UpdateReportDTO,
} from './dto/reports.dto';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { IQueryParams } from 'src/interfaces/query.interface';
import { AuthToken } from 'src/commons/decorators/auth.decorator';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { PublicRoute } from 'src/commons/decorators/public.decorator';
import {
  DeleteReasonDTO,
  SaveReasonDTO,
  UpdateReasonDTO,
} from './dto/reasons.dto';

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

  @PublicRoute()
  @Get('/reasons')
  async getList_reasons() {
    return await this.reportService.getList_reasons();
  }

  @Get('/:reportID')
  async get_reports(@Param('reportID') reportID: string) {
    return await this.reportService.get({ id: reportID });
  }

  @Roles('ADMIN')
  @Post('/reasons')
  async save_reasons(@Body() data: SaveReasonDTO) {
    const newReason = await this.reportService.save_reasons(data);
    return newReason.id;
  }

  @Post('/')
  async save_reports(
    @AuthToken() authToken: IAuthToken,
    @Body() data: SaveReportDTO,
  ) {
    const newReport = await this.reportService.save(authToken, data);
    return newReport.id;
  }

  @Roles('ADMIN')
  @Patch('/reasons')
  async update_reasons(@Body() data: UpdateReasonDTO) {
    return await this.reportService.update_reasons(data);
  }

  @Roles('ADMIN')
  @Patch('/')
  async update_reports(@Body() data: UpdateReportDTO) {
    return await this.reportService.update(data);
  }

  @Roles('ADMIN')
  @Delete('/reasons')
  async delete_reasons(@Body() data: DeleteReasonDTO) {
    return await this.reportService.delete_reasons(data);
  }

  @Roles('ADMIN')
  @Delete('/')
  async delete_reports(@Body() data: DeleteReportDTO) {
    return await this.reportService.delete(data);
  }
}
