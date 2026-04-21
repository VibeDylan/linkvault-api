import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AUTH_REPOSITORY } from "../ports/auth.repository.port";
import type { IAuthRepository } from "../ports/auth.repository.port";
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: IAuthRepository,
        private readonly jwtService: JwtService,
    ) {}

    async execute(data: { email: string, password: string}) {
        const user = await this.authRepository.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await bcrypt.compare(data.password, user.passwordHash);
        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });

        const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.authRepository.saveRefreshToken({
            token: refreshToken,
            userId: user.id,
            expiresAt,
        });

        return { user, accessToken, refreshToken };
    }
}