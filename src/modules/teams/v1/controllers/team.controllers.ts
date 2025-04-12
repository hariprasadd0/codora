import asyncHandler from '../../../../core/utils/asyncHandler';
import * as teamService from '../services/team.service';
import { Request, Response } from 'express';
import { ApiError } from '../../../../core/utils/ApiError';
import logger from '../../../../core/utils/logger';

export const createTeamController = asyncHandler(
  async (req: Request, res: Response) => {
    const team = req.body;

    const creatorId = (req as any).user.userId;
    if (!creatorId) {
      throw new ApiError(400, 'creator required');
    }
    const teamCreated = await teamService.createTeamService(creatorId, team);

    res.status(200).json({
      success: true,
      data: teamCreated,
      meta: {
        version: '1.0',
        timestamp: new Date().toISOString(),
      },
    });
  }
);
export const getTeamController = asyncHandler(
  async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const id = teamId;
    const team = await teamService.getTeamService(id);
    res.status(200).json({
      data: team,
      meta: {
        version: '1.0',
        timestamp: new Date().toISOString(),
      },
    });
  }
);
export const updateTeamController = asyncHandler(
  async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const id = teamId;
    const team = req.body;

    const updatedTeam = await teamService.updateTeamService(id, team);
    res.status(200).json({
      data: updatedTeam,
      meta: {
        version: '1.0',
        timestamp: new Date().toISOString(),
      },
    });
  }
);
export const deleteTeamController = asyncHandler(
  async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const id = teamId;
    const team = await teamService.getTeamService(id);

    if (team?.createdById !== (req as any).user.userId)
      throw new ApiError(403, 'Unauthorized');
    await teamService.deleteTeamService(id);
    res.status(204).end();
  }
);
export const addTeamMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const id = teamId;
    const { email } = req.body;
    const member = await teamService.addMemberService(id, email);
    res.status(200).json({
      data: member,
      meta: {
        version: '1.0',
        timestamp: new Date().toISOString(),
      },
    });
  }
);

export const removeTeamMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const { teamId, userId } = req.params;

    const teamIdInt = teamId;
    const id = userId;
    await teamService.removeTeamMemberService(teamIdInt, id);
    res.status(200).json({
      data: null,
      meta: {
        version: '1.0',
        timestamp: new Date().toISOString(),
      },
    });
  }
);

export const getTeamMembersController = asyncHandler(
  async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const teamIdInt = teamId;
    if (teamIdInt) {
      throw new ApiError(400, 'Invalid team ID');
    }
    const { userId } = req.body;
    const members = await teamService.getTeamMembersService(teamIdInt, userId);
    res.status(200).json({
      data: members,
      meta: {
        version: '1.0',
        timestamp: new Date().toISOString(),
      },
    });
  }
);

export const inviteController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    if (!token || typeof token !== 'string') {
      return res.status(400).send('Invalid invitation link');
    }
    const invitation = await teamService.getInvitationService(token);
    if (!invitation || invitation.expiresAt < new Date()) {
      return res.status(400).send('Invalid or expired invitation');
    }
    (req.session as any).invitationToken = token;
    res.redirect(`/login?inviteToken=${token}`);
  }
);
