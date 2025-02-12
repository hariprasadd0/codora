import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
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
  res.status(200).json({ message: 'Login Success', accessToken });
});
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;
  await userService.logoutUserService(user);
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logout Success' });
});
export const passwordReset = asyncHandler(
  //controller for password reset
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    await userService.passwordResetService(email, password);
    res.status(200).json({ message: 'Password Reset Success' });
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    logger.info('token', token);
    if (!token) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET! as string
    ) as { userId: number };
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    const userId = decoded.userId;
    const { accessToken } = await userService.refreshTokenService(
      userId,
      token
    );
    res.status(201).json({ accessToken });
  }
);

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

export const setPreference = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt((req as any).user);
    const preference = req.body.preference;
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const updatedUser = await userService.setPreferenceService(id, preference);

    res.status(200).json({
      data: updatedUser,
      meta: {
        version: '1.0',
        timestamp: new Date().toISOString(),
      },
    });
  }
);
