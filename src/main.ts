import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import * as session from 'express-session';
// import createMemoryStore from 'memorystore';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  // const MemoryStore = createMemoryStore(session);
  // const configService = app.get(ConfigService);
  // app.use(
  //   session({
  //     secret: configService.get('AUTH_SERVICE'),
  //     resave: false,
  //     store: new MemoryStore({
  //       checkPeriod: configService.get('AUTH_CHECK_PERIOD'),
  //     }),
  //   }),
  // );
  const config = new DocumentBuilder()
    .setTitle('Gira')
    .setDescription('The Gira CRUD API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}

bootstrap();
