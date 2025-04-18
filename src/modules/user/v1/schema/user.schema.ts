import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().nonempty().trim(),
  email: z.string().email(),
  password: z.string().min(8),
  preference: z
    .enum(['MORNING', 'AFTERNOON', 'NIGHT'])
    .default('MORNING')
    .optional(),
});

export const updateUserSchema = z.object({
  name: z.string().nonempty().trim().optional(),
  email: z.string().email().optional(),
  preference: z
    .enum(['MORNING', 'AFTERNOON', 'NIGHT'])
    .default('MORNING')
    .optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
