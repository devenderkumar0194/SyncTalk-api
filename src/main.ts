import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './filter/validation-exception.filter';
import fs from 'fs';
import { config } from 'dotenv';
config();

const SSL = process.env.SSL;
const CERT = process.env.SSL_CERT;
const PRIV_KEY = process.env.SSL_PRIV_KEY;

async function bootstrap() {

  let httpsOptions = {};
  if (SSL == 'true') {
    httpsOptions = {
      key: fs.readFileSync(PRIV_KEY),
      cert: fs.readFileSync(CERT),
    };
  }
  const app =
    SSL
      ? await NestFactory.create(AppModule, { httpsOptions })
      : await NestFactory.create(AppModule);
  app.enableCors();
  // app.set('trust proxy', true);

  const config = new DocumentBuilder()
    .setTitle('SyncTalk')
    .setDescription('SyncTalk API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', name: 'authorization', in: 'header' }, 'authorization')
    .addServer(`http://localhost:${process.env.PORT}/`, 'Local Server')
    .addServer(`https://api.nprajpur.in/`, 'Dev Server')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // automatically removes non-whitelisted properties
    forbidNonWhitelisted: true, // throws an error when non-whitelisted properties are present
    transform: true, // automatically transforms payloads to DTOs
  }));

  app.useGlobalFilters(new ValidationExceptionFilter());


  await app.listen(process.env.APP_PORT ?? 3000, '0.0.0.0');
  Logger.log(`🚀 Application is running on: http://localhost:${process.env.APP_PORT}`)
}
bootstrap();
