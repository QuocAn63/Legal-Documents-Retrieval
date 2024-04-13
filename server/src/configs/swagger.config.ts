import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('ChatBOT API')
    .setDescription('APIs for ChatBOT application')
    .setVersion('1.0')
    .addBearerAuth()
    .addOAuth2()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'ChatBOT API Documents',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
