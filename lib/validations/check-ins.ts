import { z } from "zod";
import { dateSchema, scaleSchema } from "./shared";

export const checkInSchema = z.object({
  check_in_date: dateSchema,
  mood: scaleSchema,
  energy: scaleSchema,
  pain: scaleSchema,
  sleep: scaleSchema,
  notes: z.string().max(2000).optional().nullable(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
