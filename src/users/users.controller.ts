import { Controller, Get, Request, Post, UseGuards, HttpCode, HttpStatus, Body, NotFoundException, ConflictException, BadRequestException, Render, ForbiddenException, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service'
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBadRequestResponse,
    ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { RegisterUser } from './dtos/register.dto';


@Controller('')
@ApiTags('Users')
export class UsersController {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly userService: UsersService

    ) { }
    /**
     * 
     * Get current user details
     */
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get my details' })
    @Get('me')
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully fetched.',
    })
    @ApiBearerAuth()
    async getProfile(@Request() req: any) {
        let users = await this.userService.find({ where: { token: req.user.token }, select: ["email", "uniqkey"] });
        if (!users.length) {
            throw new NotFoundException("User Not Found");
        }
        if (users.length > 1) {
            throw new ConflictException("Multiple users found. Please re-login");
        }

        let user = users[0];

        return user;
    }


    @Post('register')
    @ApiExcludeEndpoint()
    async register(@Body() user: RegisterUser, @Request() req) {

        return this.userService.register(user);
    }

    @ApiExcludeEndpoint()
    @Get("forgot-password")
    @Render('dashboard/forgot-password')
    forgotPW(@Request() req: any) { }

    @Post('verify-email')
    @ApiOperation({ summary: 'Register User' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @ApiBadRequestResponse({ description: "Invalid Data" })
    async resetPw(@Request() req, @Res() res) {
        let email = req.body.email;
        if (!email) {
            throw new BadRequestException("Email required to reset password")
        }
        let ress = await this.userService.initResetPw(email);
        res.set({ "X-Redirect-Url": "reset-password" }).json(ress)
    }

    @Get('reset-password')
    @ApiOperation({ summary: 'Reset Password' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @Render('dashboard/reset-password')
    @ApiBadRequestResponse({ description: "Invalid Data" })
    async resetPassword(@Request() req) {
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset Password' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @ApiBadRequestResponse({ description: "Invalid Data" })
    async newPassword(@Body() body) {
        let otp = body.otp;
        let email = body.email;
        let password = body.password;
        if (!otp) {
            throw new BadRequestException("OTP is required to reset password")
        }
        if (!email) {
            throw new BadRequestException("Email is required to reset password")
        }
        if (!password) {
            throw new BadRequestException("password is required to reset password")
        }

        return await this.userService.updatePassword(email, otp, password);
        //  res.set({"X-Redirect-Url":"reset-password"}).json(ress)

    }
}
