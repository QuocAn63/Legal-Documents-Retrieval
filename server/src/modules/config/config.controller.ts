import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ConfigService from './config.service';
import {
  DeleteConfigDTO,
  SaveConfigDTO,
  UpdateConfigDTO,
} from './dto/config.dto';
import { AuthGuard, RolesGuard } from 'src/commons/guards';
import { Roles } from 'src/commons/decorators/roles.decorator';

@ApiTags('configs')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('configs')
export default class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('')
  async getList() {
    return await this.configService.getList({}, {});
  }

  @Get(':configID')
  async get(@Param('configID') configID: string) {
    return await this.configService.get({ id: configID });
  }

  @Post('')
  async save(@Body() data: SaveConfigDTO) {
    return (await this.configService.save(data)).id;
  }

  @Patch('')
  async update(@Body() data: UpdateConfigDTO) {
    return await this.configService.update(data);
  }

  @Delete('')
  async delete(@Body() data: DeleteConfigDTO) {
    return this.configService.delete(data);
  }
}
