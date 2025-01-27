/**
 * Service layer for project management operations
 * @module services/project.service
 */

import * as projectRepository from '../repositories/project.repository';
import { Project } from '../types/type';

export const createProjectService = async (project: Project) => {
  await projectRepository.createProject(project);
};

export const getProjectService = async (projectId: number) => {
  return await projectRepository.getProjectById(projectId);
};

export const listProjectService = async (userId: number) => {
  await projectRepository.listProject(userId);
};

export const updateProjectService = async (
  projectId: number,
  project: Project
) => {
  await projectRepository.updateProjectById(projectId, project);
};
