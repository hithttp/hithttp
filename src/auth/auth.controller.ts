import { Controller, Get, Request, Post, UseGuards, HttpCode, HttpStatus, Body, NotFoundException, ConflictException } from '@nestjs/common';
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
  async login(@Request() req: any,@Body() body:LoginUser) {
    return this.authService.login(req.user);
  }


  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiOperation({ title: 'Log out' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: any) {

    await this.userService.logout(req.user.id);

    return {
      "statusCode": HttpStatus.OK,
      "success": true
    }
  }
}
