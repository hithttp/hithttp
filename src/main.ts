import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as rateLimit from 'express-rate-limit';
import * as csurf from 'csurf';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const options = new DocumentBuilder()
    .setSchemes("https")
    .setTitle('Hit Http Api Docs')
    .setDescription('Find all the api info running on this server')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.useStaticAssets(join(__dirname, '..', 'public'),{
    index:false,
    etag:true,
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use(helmet());
  app.enableCors();

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.useGlobalPipes(new ValidationPipe())
  // app.use(csurf());
  await app.listen(3000);
}
bootstrap();
