import * as teamRepository from '../repositories/team.repository';

export const createTeamService = async (team: any) => {
  await teamRepository.createTeam(team);
};
