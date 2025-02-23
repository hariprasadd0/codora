import { TeamRepository } from '../repositories/team.repository';
import { TeamCreateSchema, TeamUpdateSchema } from '../schema/team.schema';
import { ApiError } from '../../../../core/utils/ApiError';
import { generateToken } from '../../../../core/utils/token';
import { sendEmail } from '../../../../core/utils/email';
export const createTeamService = async (creatorId: number, team: any) => {
  const validated = TeamCreateSchema.parse(team);
  return await TeamRepository.create(creatorId, validated);
};

export const getTeamService = async (teamId: number) => {
  const team = await TeamRepository.getTeamById(teamId);
  return team;
};
export const updateTeamService = async (teamId: number, team: unknown) => {
  const validated = TeamUpdateSchema.parse(team);
  const updatedTeam = await TeamRepository.updateTeam(teamId, validated);
  return updatedTeam;
};
export const deleteTeamService = async (teamId: number) => {
  await TeamRepository.deleteTeam(teamId);
};
export const addMemberService = async (teamId: number, email: string) => {
  const user = await TeamRepository.getMemberByEmail(email);
  if (user) {
    const memberExists = await TeamRepository.getMember(teamId, user.id);
    if (memberExists) {
      throw new ApiError(409, 'Member already exists in the team');
    } else {
      const member = await TeamRepository.addMember(teamId, {
        userId: user.id,
        role: 'MEMBER',
      });
      return member;
    }
  } else {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const invitation = await TeamRepository.createInvite(
      teamId,
      email,
      token,
      expiresAt
    );
    const inviteLink = `${process.env.FRONTEND_URL}/teams/invite/${token}`;
    await sendEmail(email, 'Team Invite', inviteLink);
  }
};

export const getTeamMembersService = async (teamId: number, userId: number) => {
  await TeamRepository.getMember(teamId, userId);
};

export const isUserTeamLead = async (userId: number, teamId: number) => {
  return await TeamRepository.isTeamLead(userId, teamId);
};

export const removeTeamMemberService = async (
  teamId: number,
  userId: number
) => {
  await TeamRepository.removeMember(teamId, userId);
};

export const getInvitationService = async (token: string) => {
  return await TeamRepository.getInvitation(token);
};
