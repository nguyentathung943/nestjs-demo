import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    async signup(dto: AuthDto) {
        // Generate the password hashed
        const hash = await argon.hash(dto.password)

        // Save user into database
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    hash
                }
            })

            // Return the saved user
            delete user.hash
            return user
        }
        catch(error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException("Credentials taken")
                }
            }
        }
    }

    async signin(dto: AuthDto) {
        // Find the user by email
        const user = await this.prismaService.user.findFirst({
            where:{
                email: dto.email
            }
        })
        // if user does not exist, throw exception
        if (!user) {
            throw new ForbiddenException("Wrong Credentials")
        }

        // compare password
        const isPasswordValid = await argon.verify(user.hash, dto.password)

        // if passowrd incorrect, throw exception
        if (!isPasswordValid) {
            throw new ForbiddenException("Wrong password!")
        }

        // return user info
        return this.signToken(user.id, user.email)
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get("JWT_SECRET")
        })

        return {
            access_token: token
        }
    }
}
