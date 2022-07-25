import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) {}

    signin() {
        return {msg: "I Have Sign In"}
    }

    signup() {
        return {msg: "I Have Sign Up"}
    }
}
