import { z } from "zod";
import { dateSchema } from "./shared";

export const goalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  target_date: dateSchema.optional().nullable(),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  habit_frequency: z.string().max(100).optional().nullable(),
});

export type GoalInput = z.infer<typeof goalSchema>;
