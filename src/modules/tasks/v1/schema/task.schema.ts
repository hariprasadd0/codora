import { z } from 'zod';

const Status = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED']);
const Priority = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  status: Status.default('PENDING'),
  priority: Priority.default('MEDIUM'),
  assignedToId: z.string().optional(),
  dependencyTaskId: z.string().optional(),
  deadline: z.coerce.date().optional(),
});
export const updateTaskSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  status: Status.default('PENDING').optional(),
  priority: Priority.default('MEDIUM').optional(),
  assignedToId: z.string().optional(),
  dependencyTaskId: z.string().optional(),
  deadline: z.coerce.date().optional(),
});

export type createTaskDto = z.infer<typeof createTaskSchema>;
export type updateTaskDto = z.infer<typeof updateTaskSchema>;
