import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUser } from './dto/login.dto';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req:any ): Promise<any> {
    let loginUser = new LoginUser();
    loginUser.email = req.body.email;
    loginUser.password = req.body.password;
    const user = await this.authService.validateUser(loginUser);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}