import prisma from '../../../../core/config/prisma';
import {
  AddTeamMemberDto,
  TeamCreateDto,
  TeamUpdateDto,
} from '../schema/team.schema';

export const TeamRepository = {
  create: async (creatorId: string, team: TeamCreateDto) => {
    return await prisma.team.create({
      data: {
        name: team.name,
        description: team.description,
        createdById: creatorId,
        members: {
          create: {
            userId: creatorId,
            role: 'TEAM_LEAD',
          },
        },
      },
    });
  },
  updateTeam: async (teamId: string, team: TeamUpdateDto) => {
    return await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        ...team,
      },
    });
  },
  getTeamById: async (teamId: string) => {
    return await prisma.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
  },
  getMemberByEmail: async (email: string) => {
    return await prisma.user.findFirst({
      where: {
        email,
      },
    });
  },
  deleteTeam: async (teamId: string) => {
    return await prisma.$transaction(async (tx) => {
      await tx.teamMember.deleteMany({ where: { teamId } });
      await tx.team.delete({ where: { id: teamId } });
    });
  },
  addMember: async (teamId: string, member: AddTeamMemberDto) => {
    return await prisma.$transaction(async (tx) => {
      const existingMember = await tx.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: member.userId,
          },
        },
      });
      if (existingMember) {
        throw new Error('Member already exists in the team');
      }
      const newMember = await tx.teamMember.create({
        data: {
          userId: member.userId,
          teamId,
          role: member.role,
        },
      });
      return newMember;
    });
  },
  isTeamLead: async (userId: string, teamId: string) => {
    const teamMember = await prisma.teamMember.findFirst({
      where: { userId, teamId, role: 'TEAM_LEAD' },
    });
    return !!teamMember;
  },

  getMember: async (teamId: string, userId: string) => {
    return await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });
  },
  removeMember: async (teamId: string, userId: string) => {
    return await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });
  },
  getInvitation: async (token: string) => {
    return await prisma.invitation.findUnique({
      where: {
        token,
      },
    });
  },
  createInvite: async (
    teamId: string,
    email: string,
    token: string,
    expiresAt: Date
  ) => {
    return await prisma.invitation.create({
      data: {
        teamId,
        email,
        token,
        expiresAt,
      },
    });
  },
};
