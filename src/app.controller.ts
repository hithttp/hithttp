import { Controller, Get, Render } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';

@Controller()
export class AppController {

  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }


  @Get('/ping')
  @ApiOperation({ title: 'Ping Pong' })
  @ApiUseTags('Ping Pong')
  async ping() {
    return 'pong';
  }
}
