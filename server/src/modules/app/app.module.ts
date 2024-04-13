import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { DatabaseModule } from '../database';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user';
import { DocumentModule } from '../document';
import { SystemMessageModule } from '../system-message/system-message.module';
import { ReportModule } from '../report';
import { ConversationModule } from '../conversation';
import { SharedConversationModule } from '../shared-conversation';
import { MessageModule } from '../message/message.module';
import { BotModule } from '../bot';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule.forRootAsync(),
    ConversationModule,
    SharedConversationModule,
    MessageModule,
    AuthModule,
    UserModule,
    ConfigModule,
    DocumentModule,
    SystemMessageModule,
    ReportModule,
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
