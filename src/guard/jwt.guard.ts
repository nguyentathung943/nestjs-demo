import { AuthGuard } from "@nestjs/passport";

export class JwtGuard extends AuthGuard('jwt-authentication') {
    constructor() {
        super();
    }
}