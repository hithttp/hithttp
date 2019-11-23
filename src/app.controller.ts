import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('/ping')
  @ApiOperation({ title: 'Ping Pong' })
  @ApiUseTags('Ping Pong')
  async ping() {
    return 'pong';
  }
}
