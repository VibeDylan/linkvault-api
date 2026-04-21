import { Injectable } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AUTH_REPOSITORY, IAuthRepository } from "src/auth/application/ports/auth.repository.port";

export interface JwtPayload {
    sub: string;
    iat: number;
    exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: IAuthRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || ''
        })
    }

    async validate(payload: JwtPayload): Promise<any> {
        const user = await this.authRepository.findById(payload.sub);
        if (!user) {
            throw new Error("User not found");
        }
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
}