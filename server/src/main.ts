import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  app.setGlobalPrefix('api');

  console.log(`App is running on ${await app.getUrl()}`);
}
bootstrap();
