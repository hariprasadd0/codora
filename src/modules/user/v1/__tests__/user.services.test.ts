import * as userService from '../services/user.service';
import { userRepository } from '../repositories/user.repository';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../../../core/utils/token';
import * as bcrypt from 'bcrypt';

jest.mock('../repositories/user.repository', () => ({
  userRepository: {
    userByEmail: jest.fn(),
    create: jest.fn(),
    updateRefreshToken: jest.fn(),
    getRefreshToken: jest.fn(),
    updateUserById: jest.fn(),
  },
}));

jest.mock('../../../../core/utils/token', () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('userService', () => {
  const mockUserData = {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createNewUser should create a user and return tokens', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
    (userRepository.userByEmail as jest.Mock).mockResolvedValue(null);
    (userRepository.create as jest.Mock).mockResolvedValue({
      id: 1,
      email: mockUserData.email,
      name: mockUserData.name,
      passwordHash: 'hashedPassword123',
    });
    (generateAccessToken as jest.Mock).mockReturnValue('mockAccessToken');
    (generateRefreshToken as jest.Mock).mockReturnValue('mockRefreshToken');

    const result = await userService.createNewUser(mockUserData);
    expect(userRepository.userByEmail).toHaveBeenCalledWith(mockUserData.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
    expect(userRepository.create).toHaveBeenCalledWith({
      ...mockUserData,
      password: 'hashedPassword123',
    });
    expect(generateAccessToken).toHaveBeenCalledWith(1);
    expect(generateRefreshToken).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      newUser: {
        id: 1,
        email: mockUserData.email,
        name: mockUserData.name,
        passwordHash: 'hashedPassword123',
      },
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    });
  });
  test('loginUserService should authenticate and return value ', async () => {
    (userRepository.userByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (generateAccessToken as jest.Mock).mockReturnValue('mockAccessToken');
    (generateRefreshToken as jest.Mock).mockReturnValue('mockRefreshToken');

    const result = await userService.loginUserService({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(userRepository.userByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'password123',
      'hashedPassword123'
    );
    expect(generateAccessToken).toHaveBeenCalledWith(1);
    expect(generateRefreshToken).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
      userFound: {
        email: 'test@example.com',
        id: 1,
        passwordHash: 'hashedPassword123',
      },
    });
  });
  test('refreshTokenService should return new accessToken', async () => {
    (userRepository.getRefreshToken as jest.Mock).mockResolvedValue({
      refreshToken: 'valid_refresh_token',
    });
    (generateAccessToken as jest.Mock).mockReturnValue('mockAccessToken');

    const result = await userService.refreshTokenService(
      1,
      'valid_refresh_token'
    );

    expect(userRepository.getRefreshToken).toHaveBeenCalledWith(1);
    expect(generateAccessToken).toHaveBeenCalledWith(1);
    expect(result).toEqual({ accessToken: 'mockAccessToken' });
  });

  test('refreshTokenService should throw error if user not found', async () => {
    (userRepository.getRefreshToken as jest.Mock).mockResolvedValue(null);

    await expect(
      userService.refreshTokenService(1, 'valid_refresh_token')
    ).rejects.toThrow('No user Found');
  });

  test('refreshTokenService should throw error if refresh token does not match', async () => {
    (userRepository.getRefreshToken as jest.Mock).mockResolvedValue({
      refreshToken: 'valid_refresh_token',
    });

    await expect(
      userService.refreshTokenService(1, 'invalid_refresh_token')
    ).rejects.toThrow('Refresh token mismatch');
  });
});
