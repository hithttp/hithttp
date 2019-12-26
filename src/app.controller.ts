import { Controller, Get, Render, Res,Request } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';

@Controller()
export class AppController {

  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }

  @Get("login")
  @Render('dashboard/login')
  login() {
    return { message: 'Hello world!' };
  }


  @Get("dashboard")
  dashboard(@Request() req:any,@Res() res :Response) {
   if(!req.cookies.__hit_http__session__){
     return res.redirect("login")
   }
    return  res.render("dashboard/index",{ layout: "dashboard/layout/dashboard", message: 'Hello world!' });
  }
  @Get("models")
  models(@Request() req:any,@Res() res :Response) {
   if(!req.cookies.__hit_http__session__){
     return res.redirect("login")
   }
    return  res.render("dashboard/models",{ layout: "dashboard/layout/dashboard", message: 'Hello world!' });
  }
  @Get("apis")
  apis(@Request() req:any,@Res() res :Response) {
   if(!req.cookies.__hit_http__session__){
     return res.redirect("login")
   }
    return  res.render("dashboard/apis",{ layout: "dashboard/layout/dashboard", message: 'Hello world!' });
  }
  @Get("access-logs")
  accessLogs(@Request() req:any,@Res() res :Response) {
   if(!req.cookies.__hit_http__session__){
     return res.redirect("login")
   }
    return  res.render("dashboard/access-logs",{ layout: "dashboard/layout/dashboard", message: 'Hello world!' });
  }
  
  @Get('/ping')
  @ApiOperation({ title: 'Ping Pong' })
  @ApiUseTags('Ping Pong')
  async ping() {
    return 'pong';
  }
}
