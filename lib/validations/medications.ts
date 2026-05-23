import { z } from "zod";
import { datetimeSchema, uuidSchema } from "./shared";

export const medicationSchema = z.object({
  name: z.string().min(1).max(200),
  dosage: z.string().max(100).optional().nullable(),
  frequency: z.string().max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  taken_at: datetimeSchema,
  journal_entry_id: uuidSchema.optional().nullable(),
});

export type MedicationInput = z.infer<typeof medicationSchema>;
