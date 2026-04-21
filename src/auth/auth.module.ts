import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { AUTH_REPOSITORY } from './application/ports/auth.repository.port';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtGuard } from './infrastructure/guards/jwt.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    JwtStrategy,
    JwtGuard,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
  ],
  exports: [JwtGuard],
})
export class AuthModule {}