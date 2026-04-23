import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_REPOSITORY, IAuthRepository } from '../ports/auth.repository.port';

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(refreshToken: string) {
    const stored = await this.authRepository.findRefreshToken(refreshToken);
    if (!stored) throw new UnauthorizedException('Invalid refresh token');

    if (stored.expiresAt < new Date()) {
      await this.authRepository.deleteRefreshToken(refreshToken);
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.authRepository.deleteRefreshToken(refreshToken);

    // 4. Générer un nouvel access token
    const accessToken = this.jwtService.sign(
      { sub: stored.userId },
      { expiresIn: '15m' },
    );

    const newRefreshToken = this.jwtService.sign(
      { sub: stored.userId },
      { expiresIn: '7d' },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 6. Sauvegarder le nouveau refresh token
    await this.authRepository.saveRefreshToken({
      token: newRefreshToken,
      userId: stored.userId,
      expiresAt,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}