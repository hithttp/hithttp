import { Controller, Get, Render, Res,Request, UseGuards, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiUseTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService:AppService){}

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
  @Get("forgot-password")
  @Render('dashboard/forgot-password')
  forgotPW(@Request() req:any) {
    return { user: req.user };
  }

  @ApiExcludeEndpoint()
  @Get("dashboard")
  dashboard(@Request() req:any,@Res() res :Response) {
    return  res.render("dashboard/index",{ layout: "dashboard/layout/dashboard", user: req.user });
  }

/** Models operation start */
@ApiExcludeEndpoint()
  @Get("models")
  async models(@Request() req:any,@Res() res :Response) {
    let models = await this.appService.getModels(req.user.id)
   
    return  res.render("dashboard/pages/models/index",{ layout: "dashboard/layout/dashboard", user: req.user,models });
  }
  @ApiExcludeEndpoint()
  @Get("models/new")
  async newModels(@Request() req:any,@Res() res :Response) {
    let models = await this.appService.getModels(req.user.id)
   
    return  res.render("dashboard/pages/models/create",{ layout: "dashboard/layout/dashboard", user: req.user,models });
  }

  @ApiExcludeEndpoint()
  @Get("models/:id/view")
  async viewModel(@Request() req:any,@Res() res :Response) {
    let model = await this.appService.getModelDetails(req.params.id)
    return  res.render("dashboard/pages/models/view",{ layout: "dashboard/layout/dashboard", user: req.user,model });
  }

   @ApiExcludeEndpoint()
  @Get("models/:id/edit")
  async editModel(@Request() req:any,@Res() res :Response) {
    let models = await this.appService.getModels(req.user.id)
   
    return  res.render("dashboard/pages/models/edit",{ layout: "dashboard/layout/dashboard", user: req.user,models });
  }

  @ApiExcludeEndpoint()
  @Get("models/:id/delete")
  async deleteModel(@Request() req:any,@Res() res :Response) {
    let models = await this.appService.getModels(req.user.id)
   
    return  res.render("dashboard/pages/models/delete",{ layout: "dashboard/layout/dashboard", user: req.user,models });
  }

  
/** Models operation end */

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
  @ApiOperation({ title: 'Ping Pong' })
  @ApiUseTags('Ping Pong')
  async ping() {
    return 'pong';
  }
}
