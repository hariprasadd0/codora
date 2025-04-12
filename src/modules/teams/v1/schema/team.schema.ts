import { z } from 'zod';

const TeamRole = z.enum(['MEMBER', 'TEAM_LEAD']);

const TeamCreateSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100),
  description: z.string().max(500).optional(),
});

const TeamUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

const AddTeamMemberSchema = z.object({
  userId: z.string(),
  role: TeamRole.default('MEMBER'),
});

const RemoveTeamMemberSchema = z.object({
  userId: z.string(),
});

export type TeamCreateDto = z.infer<typeof TeamCreateSchema>;
export type TeamUpdateDto = z.infer<typeof TeamUpdateSchema>;
export type AddTeamMemberDto = z.infer<typeof AddTeamMemberSchema>;

export {
  TeamCreateSchema,
  TeamUpdateSchema,
  AddTeamMemberSchema,
  RemoveTeamMemberSchema,
};
