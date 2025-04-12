/**
 * Service layer for user management operations
 * @module services/user.service
 */
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyResetToken,
} from '../../../../core/utils/token';
import { userRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import logger from '../../../../core/utils/logger';
import {
  createUserSchema,
  loginUserSchema,
  UpdateUserDto,
} from '../schema/user.schema';
import { sendEmail } from '../../../../core/utils/email';
import { ApiError } from '../../../../core/utils/ApiError';

export const createNewUser = async (user: unknown) => {
  const validated = createUserSchema.parse(user);

  const userExist = await userRepository.userByEmail(validated.email);

  if (userExist) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(validated.password, 10);

  const newUser = await userRepository.create({
    ...validated,
    password: hashedPassword,
  });
  const accessToken = generateAccessToken(newUser.id);
  const refreshToken = generateRefreshToken(newUser.id);
  await userRepository.updateRefreshToken(newUser.id, refreshToken);

  return { accessToken, refreshToken, newUser };
};

export const loginUserService = async (user: unknown) => {
  const validated = loginUserSchema.parse(user);
  const userFound = await userRepository.userByEmail(validated.email);

  if (!userFound) {
    throw new ApiError(401, 'user not found');
  }

  const isPasswordMatch = await bcrypt.compare(
    validated.password,
    userFound.passwordHash!
  );

  if (!isPasswordMatch) {
    throw new ApiError(401, 'user not found');
  }

  const accessToken = generateAccessToken(userFound.id);
  const refreshToken = generateRefreshToken(userFound.id);

  await userRepository.updateRefreshToken(userFound.id, refreshToken);

  const loggedUser = {
    id: userFound.id,
    username: userFound.name,
    email: userFound.email,
  };

  return { accessToken, refreshToken, loggedUser };
};
export const refreshTokenService = async (userId: string, token: string) => {
  const storedToken = await userRepository.getRefreshToken(userId);
  if (!storedToken || !storedToken.refreshToken)
    throw new ApiError(401, 'No user Found');
  if (storedToken.refreshToken !== token) {
    throw new ApiError(401, 'Refresh token mismatch');
  }
  const accessToken = generateAccessToken(userId);

  return { accessToken };
};
export const logoutUserService = async (email: string) => {
  const userFound = await userRepository.userByEmail(email);

  if (!userFound) {
    throw new ApiError(401, 'user not found');
  }

  await userRepository.logoutUser(userFound.email);
};

export const getAllUsersService = async () => {
  const users = await userRepository.getAllUsers();

  return users;
};
export const getUserByIdService = async (userId: string) => {
  if (!userId) {
    throw new Error('Invalid user id');
  }

  const user = await userRepository.userById(userId);

  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUserService = async (
  userId: string,
  user: Partial<UpdateUserDto>
) => {
  if (!userId || userId.trim() === '') {
    throw new Error('Invalid user id');
  }

  const updatedUser = await userRepository.updateUserById(userId, user);

  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser;
};

export const deleteUserService = async (userId: string) => {
  if (
    typeof userId !== 'string' ||
    isNaN(Number(userId)) ||
    Number(userId) <= 0
  ) {
    throw new Error('Invalid user id');
  }

  const deletedUser = await userRepository.deleteUserById(userId);

  if (!deletedUser) {
    throw new Error('User not found');
  }
  return deletedUser;
};

export const requestPasswordReset = async (email: string) => {
  const userEmail = email.trim();
  const userFound = await userRepository.userByEmail(userEmail);

  if (!userFound) {
    throw new Error('User not found');
  }
  const resetToken = generateResetToken(userFound.id);
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendEmail(
    email,
    'Password Reset Request',
    `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 10 minutes.</p>`
  );
};
export const resetPassword = async (token: string, newPassword: string) => {
  const { userId } = verifyResetToken(token);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.passwordReset(userId, hashedPassword);
  return { success: true, message: 'Password reset successfully' };
};

export const setPreferenceService = async (
  userId: string,
  preference: string
) => {
  if (
    typeof userId !== 'string' ||
    isNaN(Number(userId)) ||
    Number(userId) <= 0
  ) {
    throw new Error('Invalid user id');
  }

  const validPreference = ['MORNING', 'AFTERNOON', 'NIGHT'];
  if (!validPreference.includes(preference.toUpperCase())) {
    throw new Error('Invalid preference');
  }
  const changedPreference = await userRepository.setPreference(
    userId,
    preference.toUpperCase()
  );
  return changedPreference;
};

export const calendarStatusService = async (userId: string) => {
  if (!userId || userId) throw new Error('Invalid user Id');

  return await userRepository.calendarStatus(userId);
};

export const callbackCalendarService = async (
  userId: string,
  data: any,
  tokens: any
) => {
  return await userRepository.enableCalendar(userId, data, tokens);
};

export const disableCalendarService = async (
  userId: string,
  user: {
    googleCalendarEnabled?: boolean;
    googleAccessToken?: string | null;
    googleRefreshToken?: string | null;
    googleCalendarId?: string | null;
  }
) => {
  try {
    await userRepository.disableCalendar(userId, user);
  } catch (error) {
    logger.error('error in disabling calendar', error);
  }
};

export const getInvitationByToken = async (token: string) => {
  return await userRepository.getInvitation(token);
};

export const deleteInviteService = async (inviteId: string) => {
  return await userRepository.deleteInvite(inviteId);
};

export const addTeamMemberService = async (teamId: string, userId: string) => {
  return await userRepository.addTeamMember(teamId, userId);
};
