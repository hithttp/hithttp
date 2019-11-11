import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('/')
  @ApiOperation({ title: 'Ping Pong' })
  @ApiUseTags('Ping Pong')
  async hello() {
    return 'This is the default open endpoint to check server is running. Soon we will be having a dashboard <br/> checkout the developed endpoints on <a href="/api-docs">Api Docs</a>';
  }
}
