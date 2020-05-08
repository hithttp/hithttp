import { Module } from '@nestjs/common';
import { UserFormController } from './user-form.controller';
import { UsersModule } from '../users/users.module';
import { ResourceModule } from '../resource/resource.module';
import { ApiModule } from '../api/api.module';

@Module({
  imports:[UsersModule,ResourceModule,ApiModule],
  controllers: [UserFormController]
})
export class UserFormModule {}
