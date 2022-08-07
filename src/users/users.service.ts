import { Injectable, Request, InternalServerErrorException, Logger, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { v4 } from 'uuid';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { generate } from 'randomstring';
import { JwtService } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { handlebars } from 'hbs';
import { RegisterUser } from './dtos/register.dto';


const logger = new Logger("UsersService")

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService
    ) {
        super(userRepository);
    }
    reCaptchaVerifyUrl = "https://www.google.com/recaptcha/api/siteverify"
    siteKey = "6LeHf_YUAAAAAPAE49jLjZbwHqdMdRnulV2rshtZ" //process.env.RECAPTCHA_SITE_KEY

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
            // ses.sendEmail(params, (err, data) => {
            //     if (err) console.log(err, err.stack)
            //     else console.log(data)
            // })
            return {
                success: true
            }

        } catch (e) {
            logger.error(e)
            throw new InternalServerErrorException("Failed to Initiate otp for user");
        }
    }
    async register(userReq: RegisterUser): Promise<any> {
        let { data } = await this.httpService.post(`${this.reCaptchaVerifyUrl}?secret=${this.siteKey}&response=${userReq.captchaRes}`).toPromise();
        if (!data.success) {
            throw new BadRequestException("Captcha Verification failed");
        }
        let existinguser = await this.userRepository.findOne({ where: { email: userReq.email } });
        if (existinguser) {
            throw new ConflictException("User already registered");
        }

        let user = this.userRepository.create(userReq);
        user.password = hashSync(user.password, 10);
        user.token = v4();
        user.uniqkey = generate({
            length: 8,
            charset: 'alphanumeric'
        });
        try {
            await this.userRepository.save(user);
            delete user.password;
            return {
                success: true,
                message: "Successfully Registered"
            };
        } catch (e) {
            logger.error(e)
            throw new InternalServerErrorException("Failed to register user");
        }
    }

    async updatePassword(email: string, otp: string, password: string): Promise<any> {
        try {
            let existinguser = await this.userRepository.findOne({ where: { otp, email } });
            if (!existinguser) {
                throw new ForbiddenException("User not registered");
            }
            if (existinguser.otpcreatedon && (+new Date() - +new Date(existinguser.otpcreatedon) >= 600000)) {
                throw new ForbiddenException("OTP expired")
            }
            existinguser.password = hashSync(password, 10);
            existinguser.otp = null;
            existinguser.otpcreatedon = null;

            await this.userRepository.save(existinguser);

            return {
                success: true
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
