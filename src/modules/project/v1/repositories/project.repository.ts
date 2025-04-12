import prisma from '../../../../core/config/prisma';
import { TeamRepository } from '../../../teams/v1/repositories/team.repository';
import { TeamCreateDto } from '../../../teams/v1/schema/team.schema';
import { CreateProjectDto, UpdateProjectDto } from '../schema/project.schema';
export const createProject = async (
  project: CreateProjectDto,
  userId: string
) => {
  return await prisma.project.create({
    data: {
      ...project,
      createdById: userId,
    },
  });
};
export const listProject = async (userId: string) => {
  return await prisma.project.findMany({
    where: { createdById: userId },
    orderBy: { createdAt: 'asc' },
  });
};
export const getProjectById = async (projectId: string) => {
  return await prisma.project.findUnique({
    where: { id: projectId },
  });
};

export const updateProjectById = async (
  projectId: string,
  project: Partial<UpdateProjectDto>
) => {
  return await prisma.project.update({
    where: { id: projectId },
    data: {
      ...project,
    },
  });
};

export const deleteProject = async (projectId: string) => {
  return await prisma.project.delete({
    where: { id: projectId },
  });
};

export const addMemberToProject = async (
  projectId: string,
  memberId: string
) => {
  return await prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({
      where: {
        id: projectId,
      },
      include: { team: true },
    });
    if (!project) throw new Error('Project not found');
    let teamId = project.teamId;
    if (!teamId) {
      const newTeam = await tx.team.create({
        data: {
          name: `Team ${project.name}`,
          createdById: project.createdById,
        },
      });
      await tx.project.update({
        where: {
          id: project.id,
        },
        data: { teamId: newTeam.id },
      });
      teamId = newTeam.id;
    }
    const existingMember = await tx.teamMember.findFirst({
      where: { teamId, userId: memberId },
    });
    if (existingMember) throw new Error('User already in the project');
    await tx.teamMember.create({
      data: { teamId, userId: memberId },
    });
    return { message: 'User added to project' };
  });
};

export const convertToTeam = async (projectId: string, teamId: string) => {
  return await prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new Error('Project not found');
    await tx.project.update({
      where: { id: projectId },
      data: { teamId },
    });
    return { message: 'Project converted to team' };
  });
};

export const createTeam = async (
  projectId: string,
  userId: string,
  team: TeamCreateDto
) => {
  return await prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new Error('Project not found');
    const newTeam = await TeamRepository.create(userId, team);
    await tx.project.update({
      where: { id: projectId },
      data: { teamId: newTeam.id },
    });
    return { message: 'Team created' };
  });
};
