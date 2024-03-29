import { Module } from '@nestjs/common';
import { ChatModule } from '../chat';
import { ConfigModule } from '@nestjs/config';
import DatabaseModule from '../database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule.forRootAsync(),
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
