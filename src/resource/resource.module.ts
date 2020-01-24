import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { Resource } from './resource.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieValidatorMiddleware } from '../common/middlewares/cookie-parser.middleware';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[UsersModule,TypeOrmModule.forFeature([Resource])],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports:[ResourceService]
})
export class ResourceModule  implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieValidatorMiddleware)
      .forRoutes(
        { path: 'resource/new', method: RequestMethod.GET },
        { path: 'resource/list', method: RequestMethod.GET },
        { path: 'resource/:id/view', method: RequestMethod.GET },
        { path: 'resource/:id/edit', method: RequestMethod.GET },
        { path: 'resource/:id/delete', method: RequestMethod.GET },
      )
  }
}
