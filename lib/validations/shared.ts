import { z } from "zod";

export const scaleSchema = z.coerce.number().int().min(1).max(10).optional().nullable();
export const uuidSchema = z.string().uuid();
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const datetimeSchema = z
  .string()
  .min(1)
  .transform((value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    return date.toISOString();
  });

export const reminderRepeatSchema = z.enum(["none", "daily", "weekly", "monthly"]);
export const reminderCategorySchema = z.enum(["medication", "appointment", "general"]);
export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);
export const taskPrioritySchema = z.enum(["low", "medium", "high"]);
