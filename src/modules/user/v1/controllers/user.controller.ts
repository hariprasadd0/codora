import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as userService from '../services/user.service';
import asyncHandler from '../../../../core/utils/asyncHandler';
import logger from '../../../../core/utils/logger';
import { getOAuthClient } from '../../../../core/utils/calendar';
import { google } from 'googleapis';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;
  const { newUser, accessToken, refreshToken } =
    await userService.createNewUser(user);

  const tk = (req.session as any).invitationToken || req.query.inviteToken;
  const token = tk ? tk.toString() : null;

  if (token && newUser) {
    const invitation = await userService.getInvitationByToken(token);
    if (invitation && invitation.email === user.email) {
      await userService.addTeamMemberService(invitation.teamId, newUser?.id);
      await userService.deleteInviteService(invitation.id);
      delete (req.session as any).invitationToken; // Clear session
    } else {
      res.status(400).send('Email mismatch or invalid invitation');
      return;
    }
  }
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({ data: newUser, accessToken });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;

  const { accessToken, refreshToken, loggedUser } =
    await userService.loginUserService(user);
  const tk = (req.session as any).invitationToken || req.query.inviteToken;
  const token = tk ? tk.toString() : null;

  if (token && loggedUser) {
    const invitation = await userService.getInvitationByToken(token);
    if (invitation && invitation.email === user.email) {
      await userService.addTeamMemberService(invitation.teamId, loggedUser.id);
      await userService.deleteInviteService(invitation.id);
      delete (req.session as any).invitationToken; // Clear session
    } else {
      res.status(400).send('Email mismatch or invalid invitation');
    }
  }
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  logger.info('User logged in', { email: user.email });
  res.status(200).json({ message: 'Login Success', loggedUser, accessToken });
});
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body;
  await userService.logoutUserService(user);
  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Logout Success' });
});
export const requestPasswordResetController = asyncHandler(
  //controller for password reset
  async (req: Request, res: Response) => {
    const { email } = req.body;
    await userService.requestPasswordReset(email);
    res
      .status(200)
      .json({ message: 'Password Reset Email sent to your Registered email' });
  }
);
export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    await userService.resetPassword(token, newPassword);
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
    ) as { userId: string };
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    const userId = decoded.userId;
    const { accessToken } = await userService.refreshTokenService(
      userId,
      token
    );
    return res.status(201).json({ accessToken });
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
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const user = await userService.getUserByIdService(id);

  logger.info(`User found: id=${user.id}`);

  res.status(200).json({
    ...user,
    meta: {
      version: '1.0',
      timestamp: new Date().toISOString(),
    },
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = (req as any).user.userId;
  const user = req.body;

  if (!id) {
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
    const id = (req as any).user;
    const preference = req.body.preference;
    if (!id) {
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

export const calendarStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    if (!userId) throw new Error('Invalid user Id');

    const status = await userService.calendarStatusService(userId);
    res.status(200).json({
      data: status,
      meta: {
        version: '1.0',
        timestamp: new Date().toISOString(),
      },
    });
  }
);

export const calendarEnableController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const oauthClient = getOAuthClient();
    const authUrl = oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
      prompt: 'consent',
      state: userId.toString(),
    });
    res.status(200).json({ authUrl });
  }
);

export const calendarCallbackController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, state } = req.query;

    const userId = state as string;
    if (!userId) throw new Error('userid mismatch');

    if (!code || !userId) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    try {
      const oauthClient = getOAuthClient();
      const { tokens } = await oauthClient.getToken(code as string);

      if (!tokens.access_token || !tokens.refresh_token) {
        throw new Error('Failed to retrieve tokens');
      }

      oauthClient.setCredentials(tokens);

      const calendar = google.calendar({ version: 'v3', auth: oauthClient });
      const { data } = await calendar.calendars.get({ calendarId: 'primary' });
      if (!data.id) throw new Error('No google id');
      await userService.callbackCalendarService(userId, data, tokens);
      res.redirect(`${process.env.FRONTEND_URL}/calendar/success`);
    } catch (error) {
      logger.error('Calendar enable error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/calendar/error`);
    }
  }
);
export const calendarDisableController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    await userService.disableCalendarService(userId, {
      googleCalendarEnabled: false,
      googleAccessToken: null,
      googleRefreshToken: null,
      googleCalendarId: null,
    });
    res.status(200).json({ message: 'Google Calendar disabled' });
  }
);
