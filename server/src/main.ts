import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { TransformInterceptor } from './commons/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './commons/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 403,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('ChatBOT API')
    .setDescription('APIs for ChatBOT application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`App is running on ${await app.getUrl()}`);
}
bootstrap();
