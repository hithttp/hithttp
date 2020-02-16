import { Injectable, Request, InternalServerErrorException, Logger, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { v4 } from 'uuid';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { generate } from 'randomstring';
import { JwtService } from '@nestjs/jwt';
import { SES } from 'aws-sdk'
import { readFileSync } from 'fs';
import { handlebars } from 'hbs';

const ses = new SES()

const logger = new Logger("UsersService")

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {
        super(userRepository);
    }
    async initResetPw(email: string): Promise<any> {
        let existinguser = await this.userRepository.findOne({ where: { email } });
        if (!existinguser) {
            throw new ForbiddenException("User not registered");
        }
        existinguser.otp = generate({
            length: 6,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        });
        existinguser.otpcreatedon = new Date().toISOString();
        try {
            await this.userRepository.save(existinguser);
        } catch (e) {
            logger.error(e)
            throw new InternalServerErrorException("Failed to Initiate otp for user");
        }
        try {
            let data = readFileSync(__dirname + "/../../views/email/forget-password.hbs", { encoding: "utf8" })
            let mailhtml = handlebars.compile(data)({
                otp: existinguser.otp,
                fullname: existinguser.fullname,
                year: new Date().getFullYear()
            });
            const params = {
                Destination: {
                    ToAddresses: [email]
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: 'UTF-8',
                            Data: mailhtml
                        },
                        Text: {
                            Charset: 'UTF-8',
                            Data: 'Your password reset otp is ' + existinguser.otp
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'Reset Password'
                    }
                },
                ReturnPath: "no-reply@hithttp.com",
                Source: "no-reply@hithttp.com"
            };
            ses.sendEmail(params, (err, data) => {
                if (err) console.log(err, err.stack)
                else console.log(data)
            })
            return {
                success: true
            }

        } catch (e) {
            logger.error(e)
            throw new InternalServerErrorException("Failed to Initiate otp for user");
        }
    }
    async register(req: User): Promise<any> {
        let existinguser = await this.userRepository.findOne({ where: { email: req.email } });
        if (existinguser) {
            throw new ConflictException("User Already registered");
        }
        let user = this.userRepository.create(req);
        user.password = hashSync(user.password, 10);
        user.token = v4();
        user.uniqkey = generate({
            length: 8,
            charset: 'alphanumeric'
        });
        try {
            await this.userRepository.save(user);
            delete user.password;
            const payload = {
                token: user.token
            };
            return {
                access_token: this.jwtService.sign(payload),
                uniqkey: user.uniqkey
            };
        } catch (e) {
            logger.error(e)
            throw new InternalServerErrorException("Failed to register user");
        }
    }

    async updatePassword(email:string,otp: string,password:string): Promise<any> {
        try {
            let existinguser = await this.userRepository.findOne({ where: { otp,email } });
            if (!existinguser) {
                throw new ForbiddenException("User not registered");
            }
            if(existinguser.otpcreatedon && (+new Date() - +new Date(existinguser.otpcreatedon) >= 600000)){
                throw new ForbiddenException("OTP expired")
            }
            existinguser.password = hashSync(password, 10);
            existinguser.otp = null;
            existinguser.otpcreatedon = null;

            await this.userRepository.save(existinguser);

            return {
                success:true
            }


        } catch (e) {
            logger.error(e)
            throw e
        }
    }
    async logout(userId: string): Promise<Object> {
        try {
            return this.userRepository.update(userId, {
                token: v4()
            });

        } catch (e) {
            logger.error(e)
            throw new InternalServerErrorException();
        }
    }
}
