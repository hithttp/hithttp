import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
let  config = new ConfigService("development.env");

@Module({
  imports: [UsersModule,ConfigModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "127.0.0.1",
      port: 5432,
      username: config.get("DATABASE_USER"),
      password: config.get("DATABASE_PASSWORD"),
      database: config.get("DATABASE_NAME"),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule],
  controllers: [AppController],
})
export class AppModule { }
