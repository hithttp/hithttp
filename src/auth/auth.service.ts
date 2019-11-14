
import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { LoginUser } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(loginUser:LoginUser): Promise<any> {
        const user = await this.usersService.findOne({ where: {email: loginUser.email} });
        if (user && compareSync(loginUser.password,user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

       async login(user: any) {
        const payload = { token: user.token};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}