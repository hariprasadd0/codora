import { z } from 'zod';

export const createUserSchema = z.object({
  user: z.object({
    name: z.string().nonempty().trim(),
    email: z.string().email(),
    password: z.string().min(6),
    preference: z.string().optional(),
  }),
});

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;
