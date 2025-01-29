import asyncHandler from '../../../../core/utils/asyncHandler';
import * as teamService from '../services/team.service';
import { Request, Response } from 'express';

export const createTeamController = asyncHandler(
  async (req: Request, res: Response) => {
    const team = req.body;
    const teamCreated = teamService.createTeamService(team);

    res.status(200).json({
      data: teamCreated,
      meta: {
        version: '1.0',
        timestamp: new Date().toISOString(),
      },
    });
  }
);
