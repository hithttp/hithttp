import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as rateLimit from 'express-rate-limit';
import * as hbs from "hbs";
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import cookieParser = require('cookie-parser');

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
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    etag: true,
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views/dashboard/partials'))
  hbs.registerHelper("date", function () {
    return new Date().getFullYear();
  })
  hbs.registerHelper("format-date", function (d) {
    let nd = new Date(d);
    return nd.toDateString() + " " + nd.getHours() + ":" + nd.getMinutes() + ":" + nd.getSeconds()
  })
  hbs.registerHelper("section", function (name, options) {
    if (!this._sections) this._sections = {};
    this._sections[name] = options.fn(this);
    return null;
  })
  hbs.registerHelper("ternary", function(var1, var2,res1,res2) {
   if(var1 == var2){
     return res1
   }
   else return res2;
});

  app.setViewEngine('hbs');
  app.use(helmet());
  app.enableCors();
  app.use(cookieParser())
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
