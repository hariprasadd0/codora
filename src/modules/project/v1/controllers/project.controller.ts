import asyncHandler from '../../../../core/utils/asyncHandler';
import { Request, Response } from 'express';
import * as projectService from '../services/project.service';
import logger from '../../../../core/utils/logger';
import { ApiError } from '../../../../core/utils/ApiError';

export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectData = req.body;
    const userId = (req as any).user.userId;
    const project = await projectService.createProjectService(
      projectData,
      userId
    );
    res.status(200).json({ message: 'Project created', project });
  }
);

export const getProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);
    const project = await projectService.getProjectService(projectId);
    res.status(200).json({ project });
  }
);

export const listProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    const projects = await projectService.listProjectService(userId);

    res.status(200).json({ projects });
  }
);

export const updateProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);
    const projectData = req.body;
    const project = await projectService.updateProjectService(
      projectId,
      projectData
    );
    res.status(200).json({ message: 'Project updated', project });
  }
);

export const deleteProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);
    await projectService.deleteProjectService(projectId);
    res.status(200).json({ message: 'Project deleted' });
  }
);

export const convertToTeamController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const projectId = parseInt(req.params.projectId);
    const teamId = parseInt(req.body.teamId);
    const team = req.body;

    if (!teamId && !team) {
      logger.error('Team ID or Team data not found');
      throw new ApiError(400, 'Team ID or Team data not found');
    }
    const project = await projectService.getProjectService(projectId);
    if (project?.teamId !== null) {
      throw new ApiError(400, 'Project already have a team');
    }
    if (teamId) {
      await projectService.convertToTeamService(projectId, teamId);
    } else {
      await projectService.createTeamService(projectId, userId, team);
    }

    res.status(200).json({ message: 'Convert to team' });
  }
);

export const addCollaboratorController = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId, memberId } = req.body;
    await projectService.addCollaboratorService(projectId, memberId);
    res.status(200).json({ message: 'Collaborator Added' });
  }
);
