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
  userId: number
) => {
  const validated = createProjectSchema.parse(project);
  return await projectRepository.createProject(validated, userId);
};

export const getProjectService = async (projectId: number) => {
  if (!projectId) {
    throw new ApiError(409, 'projectId not found');
  }
  return await projectRepository.getProjectById(projectId);
};

export const listProjectService = async (userId: number) => {
  if (!userId) {
    throw new ApiError(409, 'userId not found');
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

export const convertToTeamService = async (
  projectId: number,
  teamId: number
) => {
  if (isNaN(teamId)) {
    throw new ApiError(409, 'Team ID not found');
  }
  return await projectRepository.convertToTeam(projectId, teamId);
};

export const createTeamService = async (
  projectId: number,
  userId: number,
  team: TeamCreateDto
) => {
  return await projectRepository.createTeam(projectId, userId, team);
};
