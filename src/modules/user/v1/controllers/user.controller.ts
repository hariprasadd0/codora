import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import asyncHandler from '../../../../core/utils/asyncHandler';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;

  const newUser = await userService.createNewUser(user);

  res.status(201).json({ data: newUser });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const user = await userService.getUserByIdService(id);

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
