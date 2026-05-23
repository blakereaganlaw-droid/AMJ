import { z } from "zod";
import { dateSchema, taskPrioritySchema, taskStatusSchema } from "./shared";

export const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  status: taskStatusSchema.default("todo"),
  priority: taskPrioritySchema.default("medium"),
  due_date: dateSchema.optional().nullable(),
  project_category: z.string().max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type TaskInput = z.infer<typeof taskSchema>;
