import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Resource } from '../resource/resource.entity';
import { ResourceModule } from '../resource/resource.module';

@Module({
  imports: [TypeOrmModule.forFeature([User,Resource]),ResourceModule],
  controllers: [ApiController],
  providers: [ApiService]
})
export class ApiModule {}
