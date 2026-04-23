
import { mock } from 'node:test';
import { RegisterUseCase } from '../register.use-case';
import { ConflictException } from '@nestjs/common';

const mockRepository = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    saveRefreshToken: jest.fn(),
    findRefreshToken: jest.fn(),
    deleteRefreshToken: jest.fn(),
    findById: jest.fn(),

}

const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
}

describe('RegisterUseCase', () => {
    let useCase: RegisterUseCase;

    beforeEach(() => {
        useCase = new RegisterUseCase(mockRepository as any, mockJwtService as any);
    })

    jest.clearAllMocks();

    it('should register a new user successfully', async () => {
        mockRepository.findByEmail.mockResolvedValue(null);
        mockRepository.createUser.mockResolvedValue({
            id: 'user-id',
            email: "test@example.com",
            username: "testuser",
            password: "hashedpassword",
            createdAt: new Date()
        })

        const result = await useCase.execute({
            email: "test@example.com",
            username: "testuser",
            password: "password123"
        });


        expect(result.user.email).toBe("test@example.com");
        expect(result.user.username).toBe("testuser");
        expect(mockRepository.createUser).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if email already exists', async () => {
        mockRepository.findByEmail.mockResolvedValue({
            id: 'uuid-123',
            email: 'test@test.com',
        });

        // ACT + ASSERT
        await expect(
            useCase.execute({
                email: 'test@test.com',
                username: 'testuser',
                password: 'password123',
            }),
        ).rejects.toThrow(ConflictException);

        expect(mockRepository.createUser).not.toHaveBeenCalled();
    });
})