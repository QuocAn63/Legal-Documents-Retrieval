import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseOptions from './database.provider';

@Module({})
export default class DatabaseModule {
  static forRootAsync(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forRootAsync(DatabaseOptions)],
      exports: [DatabaseModule],
    };
  }
}
