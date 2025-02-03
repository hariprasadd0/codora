/**
 * Service layer for project management operations
 * @module services/project.service
 */

import * as projectRepository from '../repositories/project.repository';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../schema/project.schema';

export const createProjectService = async (project: unknown) => {
  const validated = createProjectSchema.parse(project);
  await projectRepository.createProject(validated);
};

export const getProjectService = async (projectId: number) => {
  return await projectRepository.getProjectById(projectId);
};

export const listProjectService = async (userId: number) => {
  if (!userId) {
    throw new Error('dd');
  }
  return await projectRepository.listProject(userId);
};

export const updateProjectService = async (
  projectId: number,
  project: unknown
) => {
  const validated = updateProjectSchema.parse(project);
  await projectRepository.updateProjectById(projectId, validated);
};

export const deleteProjectService = async (projectId: number) => {
  await projectRepository.deleteProject(projectId);
};

export const addCollaboratorService = async (
  projectId: number,
  memberId: number
) => {
  return await projectRepository.addMemberToProject(projectId, memberId);
};
