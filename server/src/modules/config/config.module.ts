import { Module } from '@nestjs/common';
import ConfigController from './config.controller';
import ConfigService from './config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEntity } from './entities/config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntity])],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export default class ConfigModule {}
