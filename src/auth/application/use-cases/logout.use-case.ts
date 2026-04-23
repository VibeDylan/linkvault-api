import { Inject, Injectable } from '@nestjs/common';
import { AUTH_REPOSITORY, IAuthRepository } from '../ports/auth.repository.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(refreshToken: string) {
    try {
      await this.authRepository.deleteRefreshToken(refreshToken);
    } catch {}
  }
}