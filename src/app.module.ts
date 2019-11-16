import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ResourceModule } from './resource/resource.module';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
let config = {
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_NAME: process.env.DATABASE_NAME
};
if (!config.DATABASE_NAME) {
  let envConfig = dotenv.parse(fs.readFileSync('development.env'))
  config = {
    DATABASE_USER: envConfig.DATABASE_USER,
    DATABASE_PASSWORD: envConfig.DATABASE_PASSWORD,
    DATABASE_URL: envConfig.DATABASE_URL,
    DATABASE_NAME: envConfig.DATABASE_NAME
  }
}
@Module({
  imports: [UsersModule, ConfigModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: config.DATABASE_URL,
      port: 5432,
      username: config["DATABASE_USER"],
      password: config["DATABASE_PASSWORD"],
      database: config["DATABASE_NAME"],
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    ResourceModule],
  controllers: [AppController],
})
export class AppModule { }
