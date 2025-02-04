import prisma from '../../../../core/config/prisma';
import {
  AddTeamMemberDto,
  TeamCreateDto,
  TeamUpdateDto,
} from '../schema/team.schema';

export const TeamRepository = {
  create: async (creatorId: number, team: TeamCreateDto) => {
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
  updateTeam: async (teamId: number, team: TeamUpdateDto) => {
    return await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        ...team,
      },
    });
  },
  getTeamById: async (teamId: number) => {
    return await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });
  },
  deleteTeam: async (teamId: number) => {
    return await prisma.$transaction(async (tx) => {
      await tx.teamMember.deleteMany({ where: { teamId } });
      await tx.team.delete({ where: { id: teamId } });
    });
  },
  addMember: async (teamId: number, member: AddTeamMemberDto) => {
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

  getMember: async (teamId: number, userId: number) => {
    return await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });
  },
  removeMember: async (teamId: number, userId: number) => {
    return await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });
  },
};
