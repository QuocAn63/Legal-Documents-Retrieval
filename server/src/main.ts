import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { TransformInterceptor } from './commons/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './commons/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { configSwagger } from './configs/swagger.config';

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

  configSwagger(app);

  await app.listen(3000);
  console.log(`App is running on ${await app.getUrl()}`);
}
bootstrap();
