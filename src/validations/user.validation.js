import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  email: z.string().email().optional(),
  role: z.enum(['user', 'admin']).optional(),
});
