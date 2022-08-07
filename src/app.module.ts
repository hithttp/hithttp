import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ResourceModule } from './resource/resource.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ApiModule } from './api/api.module';
import { CookieValidatorMiddleware } from './common/middlewares/cookie-parser.middleware';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserFormModule } from './user-form/user-form.module';
import { ThrottlerModule } from '@nestjs/throttler';
let config = {
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_PORT: process.env.DATABASE_PORT
};
if (!config.DATABASE_NAME) {
  let envConfig = dotenv.parse(fs.readFileSync('development.env'))
  config = {
    DATABASE_USER: envConfig.DATABASE_USER,
    DATABASE_PASSWORD: envConfig.DATABASE_PASSWORD,
    DATABASE_URL: envConfig.DATABASE_URL,
    DATABASE_NAME: envConfig.DATABASE_NAME,
    DATABASE_PORT: envConfig.DATABASE_PORT
  }
}
@Module({
  imports: [
    UsersModule, ConfigModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: config.DATABASE_URL,
      port: +config["DATABASE_PORT"] | 5432,
      username: config["DATABASE_USER"],
      password: config["DATABASE_PASSWORD"],
      database: config["DATABASE_NAME"],
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      // logging:"all"
    }),
    AuthModule,
    ResourceModule,
    ApiModule,
    DashboardModule,
    UserFormModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieValidatorMiddleware)
      .forRoutes(
        { path: 'dashboard', method: RequestMethod.GET },
        { path: 'models', method: RequestMethod.GET },
        { path: 'models/*', method: RequestMethod.GET },
        { path: 'apis', method: RequestMethod.GET },
        { path: 'access-logs', method: RequestMethod.GET }
      )
  }

}
