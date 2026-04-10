import { z } from 'zod';

export const contentSchema = z.object({
  key: z.string().min(1),
  title: z.string().optional(),
  value: z.string().min(1),
  type: z.string().default('text'),
});
