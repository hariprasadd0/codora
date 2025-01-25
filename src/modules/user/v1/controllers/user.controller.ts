import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import asyncHandler from '../../../../core/utils/asyncHandler';
import logger from '../../../../core/utils/logger';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;
  const { newUser, accessToken, refreshToken } =
    await userService.createNewUser(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({ data: newUser, accessToken });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;
  logger.info('User logged in', { email: user.email });
  const { accessToken, refreshToken } =
    await userService.loginUserService(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ accessToken });
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
  const id = parseInt(req.params.id);
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
