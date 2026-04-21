import { UserEntity } from "src/auth/domain/user.entity";

export interface IAuthRepository {
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    createUser(data: {
        email: string;
        username: string;
        passwordHash: string;
    }): Promise<UserEntity>;
    saveRefreshToken(data: {
        token: string;
        userId: string;
        expiresAt: Date;
    }): Promise<void>;
    findRefreshToken(token: string): Promise<{userId: string, expiresAt: Date} | null>;
    deleteRefreshToken(token: string): Promise<void>;
}

export const AUTH_REPOSITORY = Symbol('IAuthRepository');