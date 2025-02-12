import { TeamRepository } from '../repositories/team.repository';
import { TeamCreateSchema } from '../schema/team.schema';
import { ApiError } from '../../../../core/utils/ApiError';
export const createTeamService = async (creatorId: number, team: any) => {
  const validated = TeamCreateSchema.parse(team);
  return await TeamRepository.create(creatorId, validated);
};

export const getTeamService = async (teamId: number) => {
  const team = await TeamRepository.getTeamById(teamId);
  return team;
};
export const updateTeamService = async (teamId: number, team: any) => {
  const updatedTeam = await TeamRepository.updateTeam(teamId, team);
  return updatedTeam;
};
export const deleteTeamService = async (teamId: number) => {
  await TeamRepository.deleteTeam(teamId);
};
export const addMemberService = async (teamId: number, member: any) => {
  const memberExists = await TeamRepository.getMember(teamId, member.userId);
  if (memberExists) {
    throw new ApiError(409, 'Member already exists in the team');
  }
  const newMember = await TeamRepository.addMember(teamId, member);
  return newMember;
};

export const getTeamMembersService = async (teamId: number, userId: number) => {
  await TeamRepository.getMember(teamId, userId);
};

export const removeTeamMemberService = async (
  teamId: number,
  userId: number
) => {
  await TeamRepository.removeMember(teamId, userId);
};
