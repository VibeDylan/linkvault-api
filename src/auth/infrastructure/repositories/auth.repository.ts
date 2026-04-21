import { Injectable } from "@nestjs/common";
import { IAuthRepository } from "src/auth/application/ports/auth.repository.port";
import { UserEntity } from "src/auth/domain/user.entity";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthRepository implements IAuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user ? new UserEntity(user.id, user.email, user.username, user.passwordHash, user.createdAt) : null;
    }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user ? new UserEntity(user.id, user.email, user.username, user.passwordHash, user.createdAt) : null;
    }

    async createUser(data: { email: string; username: string; passwordHash: string }): Promise<UserEntity> {
        const user = await this.prisma.user.create({data});
        return new UserEntity(user.id, user.email, user.username, user.passwordHash, user.createdAt);
    }

    async saveRefreshToken(data: { token: string; userId: string; expiresAt: Date }): Promise<void> {
        await this.prisma.refreshToken.create({ data });
    }

    async findRefreshToken(token: string): Promise<{ userId: string; expiresAt: Date } | null> {
        const rt = await this.prisma.refreshToken.findUnique({ where: { token } });
        return rt ? { userId: rt.userId, expiresAt: rt.expiresAt } : null;
    }

    async deleteRefreshToken(token: string): Promise<void> {
        await this.prisma.refreshToken.delete({ where: { token } });
    }
}