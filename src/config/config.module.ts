import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
console.log(`${process.env.NODE_ENV || 'development'}.env`)
@Module({
    providers: [
      {
        provide: ConfigService,
        useValue: new ConfigService(`${process.env.NODE_ENV || 'development'}.env`),
      },
    ],
    exports: [ConfigService],
  })
  export class ConfigModule {}