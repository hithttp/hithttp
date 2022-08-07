import { Controller, Get, Render, Res,Request, UseGuards, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ResourceService } from './resource/resource.service';


@Controller()
export class AppController {
  constructor(
    private readonly appService:AppService,
    private readonly resService:ResourceService
    
    ){}

  @ApiExcludeEndpoint()
  @Get()
  @Render('index')
  root(@Request() req:any) {
    return { user: req.user };
  }
  @ApiExcludeEndpoint()
  @Get("login")
  @Render('dashboard/login')
  login(@Request() req:any) {
    return { user: req.user };
  }
  @ApiExcludeEndpoint()
  @Get("register")
  @Render('dashboard/register')
  register(@Request() req:any) {
    return { user: req.user };
  }


  @ApiExcludeEndpoint()
  @Get("dashboard")
  dashboard(@Request() req:any,@Res() res :Response) {
    return  res.render("dashboard/index",{ layout: "dashboard/layout/dashboard", user: req.user });
  }



 @ApiExcludeEndpoint()
  @Get("apis")
  apis(@Request() req:any,@Res() res :Response) {

    return  res.render("dashboard/apis",{ layout: "dashboard/layout/dashboard", user: req.user });
  }

  @ApiExcludeEndpoint()
  @Get("access-logs")
  accessLogs(@Request() req:any,@Res() res :Response) {

    return  res.render("dashboard/access-logs",{ layout: "dashboard/layout/dashboard", user: req.user });
  }
  
  @Get('/ping')
  @ApiOperation({ summary: 'Ping Pong' })
  @ApiTags('Ping Pong')
  async ping() {
    return 'pong';
  }
}
