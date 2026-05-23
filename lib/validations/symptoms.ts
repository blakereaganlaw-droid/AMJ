import { z } from "zod";
import { datetimeSchema } from "./shared";

export const symptomSchema = z.object({
  name: z.string().min(1).max(200),
  severity: z.coerce.number().int().min(1).max(10),
  body_area: z.string().max(100).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  occurred_at: datetimeSchema,
});

export type SymptomInput = z.infer<typeof symptomSchema>;
