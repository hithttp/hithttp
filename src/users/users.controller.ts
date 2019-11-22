import { Controller, Get, Request, Post, UseGuards, HttpCode, HttpStatus, Body, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service'
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiUseTags,
    ApiBadRequestResponse,
} from '@nestjs/swagger';


@Controller('')
@ApiUseTags('Users')
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
    @ApiOperation({ title: 'Get my details' })
    @Get('me')
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully fetched.',
    })
    @ApiBearerAuth()
    async getProfile(@Request() req: any) {
        let users = await this.userService.find({ where: { token: req.user.token }, select: [ "email"] });
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
    @ApiOperation({ title: 'Register User' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @ApiBadRequestResponse({ description: "Invalid Data" })
    async register(@Body() user: User, @Request() req) {
        return this.userService.register(user);
    }
}
