import prisma from '../../../../core/config/prisma';

export const createTeam = async (team: any) => {
  return await prisma.team.create({
    data: {
      ...team,
    },
  });
};

export const addMember = async (member: any) => {
  return await prisma.teamMember.create({
    data: {
      ...member,
    },
  });
};
