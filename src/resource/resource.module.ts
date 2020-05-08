import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { Resource } from './resource.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieValidatorMiddleware } from '../common/middlewares/cookie-parser.middleware';
import { UsersModule } from '../users/users.module';
import { Api } from '../api/api.entity';

@Module({
  imports:[UsersModule,TypeOrmModule.forFeature([Resource,Api])],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports:[ResourceService,TypeOrmModule]
})
export class ResourceModule  {}
