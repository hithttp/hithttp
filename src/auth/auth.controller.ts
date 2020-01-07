import { Controller, Get, Request, Post, UseGuards, HttpCode, HttpStatus, Body, NotFoundException, ConflictException, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { LoginUser } from './dto/login.dto';

@ApiUseTags('Auth')
@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) { }

  @UseGuards(AuthGuard('custom'))
  @Post('login')
  @ApiOperation({ title: 'Login User' })
  async login(@Request() req: any,@Body() body:LoginUser,@Res() res :any) {
    let loginRes = await this.authService.login(req.user)
    res.cookie("__hit_http__session__", loginRes.access_token,{maxAge: 86400000}); 
   return  res.json(loginRes)
  }


  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiOperation({ title: 'Log out' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: any,@Res() res :any) {
    await this.userService.logout(req.user.id);
    res.clearCookie("__hit_http__session__")
    res.json({
      "statusCode": HttpStatus.OK,
      "success": true
    })
  }
}
