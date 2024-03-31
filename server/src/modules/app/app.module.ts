import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { ChatModule } from '../chat';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user';
import { DocumentModule } from '../document';
import { SystemMessageModule } from '../system-message/system-message.module';
import { ReportModule } from '../report';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule.forRootAsync(),
    ChatModule,
    AuthModule,
    UserModule,
    ConfigModule,
    DocumentModule,
    SystemMessageModule,
    ReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
