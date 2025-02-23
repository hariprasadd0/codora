import prisma from '../../../../core/config/prisma';
import { CreateUserDto, UpdateUserDto } from '../schema/user.schema';

export const userRepository = {
  create: async (user: CreateUserDto) => {
    return await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        passwordHash: user.password,
      },
      omit: {
        passwordHash: true,
      },
    });
  },
  getAllUsers: async () => {
    return await prisma.user.findMany({
      omit: {
        passwordHash: true,
        refreshToken: true,
      },
    });
  },
  userById: async (userId: number) => {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        passwordHash: true,
        refreshToken: true,
      },
    });
  },
  userByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  },
  updateUserById: async (userId: number, user: Partial<UpdateUserDto>) => {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: user.name,
        email: user.email,
      },
    });
  },
  updateRefreshToken: async (userId: number, refreshToken: string) => {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
  },
  logoutUser: async (email: string) => {
    return await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        refreshToken: '',
      },
    });
  },
  deleteUserById: async (userId: number) => {
    return await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  },
  passwordReset: async (id: number, password: string) => {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        passwordHash: password,
      },
    });
  },
  setPreference: async (userId: number, preference: any) => {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        preference: preference,
      },
    });
  },
  getRefreshToken: async (userId: number) => {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        refreshToken: true,
      },
    });
  },
  calendarStatus: async (userId: number) => {
    const Calstatus = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        googleCalendarId: true,
      },
    });
    return !!Calstatus?.googleCalendarId;
  },
  enableCalendar: async (userId: number, data: any, tokens: any) => {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        googleCalendarEnabled: true,
        googleCalendarId: data.id,
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
      },
    });
  },
  disableCalendar: async (userId: number, data: any) => {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
      },
    });
  },
  getInvitation: async (token: string) => {
    return await prisma.invitation.findUnique({
      where: {
        token: token,
      },
    });
  },
  deleteInvite: async (inviteId: number) => {
    return await prisma.invitation.delete({
      where: {
        id: inviteId,
      },
    });
  },
  addTeamMember: async (teamId: number, userId: number) => {
    return await prisma.teamMember.create({
      data: {
        teamId: teamId,
        userId: userId,
        role: 'MEMBER',
      },
    });
  },
};
