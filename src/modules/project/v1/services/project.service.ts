/**
 * Service layer for project management operations
 * @module services/project.service
 */

import { ApiError } from '../../../../core/utils/ApiError';
import { TeamCreateDto } from '../../../teams/v1/schema/team.schema';
import * as projectRepository from '../repositories/project.repository';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../schema/project.schema';

export const createProjectService = async (
  project: unknown,
  userId: string
) => {
  const validated = createProjectSchema.parse(project);
  return await projectRepository.createProject(validated, userId);
};

export const getProjectService = async (projectId: string) => {
  if (!projectId) {
    throw new ApiError(409, 'projectId not found');
  }
  return await projectRepository.getProjectById(projectId);
};

export const listProjectService = async (userId: string) => {
  if (!userId) {
    throw new ApiError(409, 'userId not found');
  }
  return await projectRepository.listProject(userId);
};

export const updateProjectService = async (
  projectId: string,
  project: unknown
) => {
  const validated = updateProjectSchema.parse(project);
  await projectRepository.updateProjectById(projectId, validated);
};

export const deleteProjectService = async (projectId: string) => {
  await projectRepository.deleteProject(projectId);
};

export const addCollaboratorService = async (
  projectId: string,
  memberId: string
) => {
  return await projectRepository.addMemberToProject(projectId, memberId);
};

export const convertToTeamService = async (
  projectId: string,
  teamId: string
) => {
  if (teamId) {
    throw new ApiError(409, 'Team ID not found');
  }
  return await projectRepository.convertToTeam(projectId, teamId);
};

export const createTeamService = async (
  projectId: string,
  userId: string,
  team: TeamCreateDto
) => {
  return await projectRepository.createTeam(projectId, userId, team);
};
