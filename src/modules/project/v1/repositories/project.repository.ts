import prisma from '../../../../core/config/prisma';
import { CreateProjectDto, UpdateProjectDto } from '../schema/project.schema';
export const createProject = async (project: CreateProjectDto) => {
  return await prisma.project.create({
    data: {
      ...project,
    },
  });
};
export const listProject = async (userId: number) => {
  return await prisma.project.findMany({
    where: { createdById: userId },
  });
};
export const getProjectById = async (projectId: number) => {
  return await prisma.project.findUnique({
    where: { id: projectId },
  });
};

export const updateProjectById = async (
  projectId: number,
  project: Partial<UpdateProjectDto>
) => {
  return await prisma.project.update({
    where: { id: projectId },
    data: {
      ...project,
    },
  });
};

export const deleteProject = async (projectId: number) => {
  return await prisma.project.delete({
    where: { id: projectId },
  });
};

export const addMemberToProject = async (
  projectId: number,
  memberId: number
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
