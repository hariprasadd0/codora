import prisma from '../../../../core/config/prisma';
import { Project } from '../types/type';
export const createProject = async (project: Project) => {
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
  project: Project
) => {
  return await prisma.project.update({
    where: { id: projectId },
    data: {
      ...project,
    },
  });
};
