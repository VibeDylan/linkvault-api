
import { RegisterUseCase } from '../register.use-case';

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
});