import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { NetworkHelper } from '../network/network.helper';

describe('UsersService', () => {
  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        TypeOrmModule.forRoot({
          type: "postgres",
          host: "localhost",
          port: 5432,
          username: "root",
          password: "root",
          database: "sooils",
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        UsersModule
      ],
      providers: [UsersService,NetworkHelper],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
