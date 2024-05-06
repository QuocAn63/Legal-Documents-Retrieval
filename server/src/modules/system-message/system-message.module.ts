import { Module } from '@nestjs/common';
import SystemMessageService from './system-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import SystemMessageEntity from './entities/systemMessage.entity';
import { DynamicModule } from '@nestjs/common';
@Module({
  imports: [TypeOrmModule.forFeature([SystemMessageEntity])],
  providers: [SystemMessageService],
  exports: [SystemMessageService],
})
export class SystemMessageModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: SystemMessageModule,
    };
  }
}
