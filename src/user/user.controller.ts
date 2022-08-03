import { Controller, Get, HttpCode, HttpStatus, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/guard';

@Controller('users')
export class UserController {

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(
        @GetUser() user: User,
        @GetUser('email') userEmail: string
    ) {
    
        console.log(userEmail)
        return user
    }

    @Patch()
    editUser() {

    }
}
