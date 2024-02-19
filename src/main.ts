import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.enableCors({ credentials: true, origin: true });

  const configService = app.get(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter(configService));

  const config = new DocumentBuilder()
    .setTitle('My Cloud')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(configService.get('PORT'));
}

bootstrap();
