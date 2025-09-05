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
  userById: async (userId: string) => {
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
  updateUserById: async (userId: string, user: Partial<UpdateUserDto>) => {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: user.name,
        email: user.email,
        preference: user.preference,
      },
    });
  },
  updateRefreshToken: async (userId: string, refreshToken: string) => {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
  },
  logoutUser: async (id: string) => {
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        refreshToken: '',
      },
    });
  },
  deleteUserById: async (userId: string) => {
    return await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  },
  passwordReset: async (id: string, password: string) => {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        passwordHash: password,
      },
    });
  },
  setPreference: async (userId: string, preference: any) => {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        preference: preference,
      },
    });
  },
  getRefreshToken: async (userId: string) => {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        refreshToken: true,
      },
    });
  },
  calendarStatus: async (userId: string) => {
    const Calstatus = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        googleCalendarId: true,
      },
    });
    return !!Calstatus?.googleCalendarId;
  },
  enableCalendar: async (userId: string, data: any, tokens: any) => {
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
  disableCalendar: async (userId: string, data: any) => {
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
  deleteInvite: async (inviteId: string) => {
    return await prisma.invitation.delete({
      where: {
        id: inviteId,
      },
    });
  },
  addTeamMember: async (teamId: string, userId: string) => {
    return await prisma.teamMember.create({
      data: {
        teamId: teamId,
        userId: userId,
        role: 'MEMBER',
      },
    });
  },
   getUserDailyTaskActivity : async (userId: string) => {
        // Step 1: Find all teamIds the user belongs to
        const teams = await prisma.teamMember.findMany({
            where: { userId },
            select: { teamId: true },
        });

        if (teams.length === 0) {
            throw new Error("User does not belong to any team");
        }

        const teamIds = teams.map((t) => t.teamId);

        // Step 2: Define today's range
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Step 3: Query tasks across all teams
        const [newTasks, completedTasks] = await Promise.all([
            // Tasks created today
            prisma.task.findMany({
                where: {
                    project: { teamId: { in: teamIds } },
                    createdAt: { gte: startOfDay, lte: endOfDay },
                },
                include: {
                    assignedTo: { select: { id: true, name: true, email: true } },
                    project: { select: { id: true, name: true, teamId: true } },
                },
                orderBy: { createdAt: "desc" },
            }),

            // Tasks completed today
            prisma.task.findMany({
                where: {
                    project: { teamId: { in: teamIds } },
                    status: "COMPLETED",
                    updatedAt: { gte: startOfDay, lte: endOfDay },
                },
                include: {
                    assignedTo: { select: { id: true, name: true, email: true } },
                    project: { select: { id: true, name: true, teamId: true } },
                },
                orderBy: { updatedAt: "desc" },
            }),
        ]);

        return { newTasks, completedTasks };
    }

};
