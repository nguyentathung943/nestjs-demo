import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { prisma } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt-authentication'
    ) {

    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET")
        });
    }

    async validate(payload: {sub: number, email:string}) {
        // return data here would pass the data into req.user
        const user = await this.prisma.user.findFirst({
            where: {
                id: payload.sub,
                email: payload.email
            }
        })
        
        delete user.hash
        return user
    }
}