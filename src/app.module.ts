import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
let config = {
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_NAME:process.env.DATABASE_NAME
};

console.log(config)
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
    AuthModule],
  controllers: [AppController],
})
export class AppModule { }
