import asyncHandler from '../../../../core/utils/asyncHandler';
import { Request, Response } from 'express';
import * as projectService from '../services/project.service';

export const createProjectController = asyncHandler(
  async (req: Request, res: Response) => {
    const projectData = req.body;
    const project = await projectService.createProjectService(projectData);
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
    const userId = parseInt(req.params.userId);
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
