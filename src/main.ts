import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as hbs from "hbs";
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import cookieParser = require('cookie-parser');
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(compression());
  const options = new DocumentBuilder()
    .addServer("https")
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
  hbs.registerHelper("ternary", function (var1, var2, res1, res2) {
    if (var1 == var2) {
      return res1
    }
    else return res2;
  });
  hbs.registerHelper('iff', function (v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });
  app.setViewEngine('hbs');
  app.use(helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "'unsafe-inline'", 'https://www.google.com', 'https://www.gstatic.com','https://cdnjs.cloudflare.com','https://www.googletagmanager.com','https://www.google-analytics.com'],
      "script-src-attr":["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", 'https://www.gstatic.com'],
      "frame-src": ['https://www.google.com']
    },
  }));
  app.enableCors(); ``
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe())
  // app.use(csurf());
  await app.listen(3000);
}
bootstrap();
