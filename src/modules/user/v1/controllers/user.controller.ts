import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import asyncHandler from '../../../../core/utils/asyncHandler';
import logger from '../../../../core/utils/logger';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;
  try {
    const { newUser, accessToken, refreshToken } =
      await userService.createNewUser(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ data: newUser, accessToken });
  } catch (err) {
    logger.error('Failed to create user', { err });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;

  const { accessToken, refreshToken } =
    await userService.loginUserService(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  logger.info('User logged in', { email: user.email });
  res.status(201).json({ message: 'Login Success', accessToken });
});
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;
  await userService.logoutUserService(user);
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logout Success' });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsersService();

  logger.info('Users found', { count: users.length });

  res.status(200).json({
    data: users,
    meta: {
      version: '1.0',
      timestamp: new Date().toISOString(),
    },
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const user = await userService.getUserByIdService(id);

  logger.info(`User found: id=${user.id}`);

  res.status(200).json({
    data: user,
    meta: {
      version: '1.0',
      timestamp: new Date().toISOString(),
    },
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt((req as any).user);
  const user = req.body;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const updatedUser = await userService.updateUserService(id, user);

  res.status(200).json({
    data: updatedUser,
    meta: {
      version: '1.0',
      timestamp: new Date().toISOString(),
    },
  });
});
