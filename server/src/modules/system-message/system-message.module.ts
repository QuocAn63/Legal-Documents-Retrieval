import { Module } from '@nestjs/common';
import SystemMessageService from './system-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import SystemMessageEntity from './entities/systemMessage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemMessageEntity])],
  providers: [SystemMessageService],
})
export class SystemMessageModule {}
