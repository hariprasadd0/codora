import { z } from 'zod';

const ProjectStatus = z.enum([
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'DELAYED',
]);

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).optional(),
  teamId: z.string().optional(),
  newTeam: z
    .object({
      name: z.string().min(1, 'Team name is required').max(100),
      description: z.string().max(500).optional(),
    })
    .optional(),
  deadline: z.string().datetime().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  deadline: z.string().datetime().optional(),
  status: ProjectStatus.optional(),
});

export const ConvertToTeamProjectSchema = z.object({
  teamId: z.string().optional(),
  newTeam: z
    .object({
      name: z.string().min(1, 'Team name is required').max(100),
      description: z.string().max(500).optional(),
    })
    .optional(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
