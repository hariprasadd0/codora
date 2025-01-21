import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import asyncHandler from '../../../core/utils/asyncHandler';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { user } = req.body;

  const newUser = await userService.createNewUser(user);

  res.status(201).json({ success: true, data: newUser });
});
