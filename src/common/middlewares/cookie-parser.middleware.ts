import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants';

@Injectable()
export class CookieValidatorMiddleware implements NestMiddleware {
  constructor(private readonly userService:UsersService, private readonly jwtService: JwtService){

  }
  async use(req: any, res: any, next: () => void) {
    if(!req.cookies.__hit_http__session__){
      return res.redirect("/login")
    }
    let jwtStr = req.cookies.__hit_http__session__
    let {token} = this.jwtService.decode(jwtStr) as {token:string};

    let user = await this.userService.findOne({
      where:{token}
    })
    req.user = user;
    next();
  }
}
