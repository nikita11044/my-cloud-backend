import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@my-cloud/shared/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionsFilter } from '@my-cloud/shared/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.enableCors({ credentials: true, origin: true });

  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new HttpExceptionFilter(configService),
    new GlobalExceptionsFilter(httpAdapterHost),
  );

  const config = new DocumentBuilder()
    .setTitle('My Cloud')
    .setVersion('1.0')
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
