import { Module, HttpModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
@Module({
  imports: [TypeOrmModule.forFeature([User]),
  HttpModule,
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: jwtConstants.expiresIn },
  })],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService,JwtModule]
})
export class UsersModule { }
