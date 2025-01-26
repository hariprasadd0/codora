/**
 * Service layer for user management operations
 * @module services/user.service
 */
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../../../core/utils/token';
import * as userRepository from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import logger from '../../../../core/utils/logger';
import User from '../types/user';

export const createNewUser = async (user: User) => {
  if (user) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  const userExist = await userRepository.userByEmail(user.email);

  if (userExist) {
    throw new Error('User already exists');
  }
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  const newUser = await userRepository.createUser(user);
  await userRepository.updateUserById(newUser.id, {
    refreshToken: refreshToken,
  });

  return { accessToken, refreshToken, newUser };
};

export const loginUserService = async (user: User) => {
  const userFound = await userRepository.userByEmail(user.email);

  if (!userFound) {
    throw new Error('User not found');
  }

  const isPasswordMatch = await bcrypt.compare(
    user.password,
    userFound.passwordHash
  );

  if (!isPasswordMatch) {
    throw new Error('Invalid password');
  }

  const accessToken = generateAccessToken(userFound.id);
  const refreshToken = generateRefreshToken(userFound.id);

  await userRepository.updateUserById(userFound.id, {
    refreshToken: refreshToken,
  });

  return { accessToken, refreshToken };
};

export const getUserByIdService = async (userId: number) => {
  if (typeof userId !== 'number' || userId <= 0) {
    throw new Error('Invalid user id');
  }

  const user = await userRepository.userById(userId);

  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUserService = async (userId: number, user: User) => {
  if (typeof userId !== 'number' || userId <= 0) {
    throw new Error('Invalid user id');
  }
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  const updatedUser = await userRepository.updateUserById(userId, user);

  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser;
};

export const deleteUserService = async (userId: number) => {
  if (typeof userId !== 'number' || userId <= 0) {
    throw new Error('Invalid user id');
  }

  const deletedUser = await userRepository.deleteUserById(userId);

  if (!deletedUser) {
    throw new Error('User not found');
  }
  return deletedUser;
};
