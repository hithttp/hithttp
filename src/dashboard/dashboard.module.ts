import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { CookieValidatorMiddleware } from '../common/middlewares/cookie-parser.middleware';
import { UsersModule } from '../users/users.module';
import { ResourceModule } from '../resource/resource.module';
import { ApiModule } from '../api/api.module';

@Module({
  imports:[UsersModule,ResourceModule,ApiModule],
  controllers: [DashboardController]
})
export class DashboardModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieValidatorMiddleware)
      .forRoutes(
        { path: 'dashboard/resource/new', method: RequestMethod.GET },
        { path: 'dashboard/resource/list', method: RequestMethod.GET },
        { path: 'dashboard/resource/:id/view', method: RequestMethod.GET },
        { path: 'dashboard/resource/:id/edit', method: RequestMethod.GET },
        { path: 'dashboard/resource/:id/api-data', method: RequestMethod.GET },
        { path: 'dashboard/resource/:resId/api-data/new', method: RequestMethod.GET },
        { path: 'dashboard/resource/:resId/api-data/list', method: RequestMethod.GET },
        { path: 'dashboard/resource/:resId/api-data/:id/view', method: RequestMethod.GET },
        { path: 'dashboard/resource/:resId/api-data/:id/edit', method: RequestMethod.GET },
      )
  }
}
