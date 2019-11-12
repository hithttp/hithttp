import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
let  config = dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV || 'development'}.env`));

@Module({
  imports: [UsersModule,ConfigModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "hithttp.cr7x02jfhqxs.us-east-2.rds.amazonaws.com",
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
