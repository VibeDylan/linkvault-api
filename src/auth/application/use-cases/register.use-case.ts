import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AUTH_REPOSITORY } from '../ports/auth.repository.port';
import type { IAuthRepository } from '../ports/auth.repository.port';


@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: IAuthRepository,
        private readonly jwtService: JwtService,
    ) {}

    async execute(data: { email: string; username: string; password: string }) {
        const existingUser = await this.authRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        const user = await this.authRepository.createUser({
            email: data.email,
            username: data.username,
            passwordHash,
        });

        const tokens = await this.generateTokens(user.id);

        return { user, ...tokens}
    }

    private async generateTokens(userId: string) {
        const accessToken = this.jwtService.sign({ sub: userId },{ expiresIn: '15m' },);

        const refreshToken = this.jwtService.sign({ sub: userId },{ expiresIn: '7d' },);

        const expiresAt = new Date();
        
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.authRepository.saveRefreshToken({
        token: refreshToken,
        userId,
        expiresAt,
        });

        return { accessToken, refreshToken };
    }
}