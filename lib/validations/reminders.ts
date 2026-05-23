import { z } from "zod";
import { datetimeSchema, reminderCategorySchema, reminderRepeatSchema } from "./shared";

export const reminderSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  due_at: datetimeSchema,
  repeat_rule: reminderRepeatSchema.default("none"),
  category: reminderCategorySchema.default("general"),
});

export type ReminderInput = z.infer<typeof reminderSchema>;
