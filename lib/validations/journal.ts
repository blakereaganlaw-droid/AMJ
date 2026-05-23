import { z } from "zod";
import { dateSchema, scaleSchema } from "./shared";

export const journalEntrySchema = z.object({
  entry_date: dateSchema,
  title: z.string().max(200).optional().nullable(),
  notes: z.string().max(10000).optional().nullable(),
  symptoms_summary: z.string().max(2000).optional().nullable(),
  medications_taken: z.string().max(2000).optional().nullable(),
  hydration: z.coerce.number().int().min(0).max(20).optional().nullable(),
  sleep_hours: z.coerce.number().min(0).max(24).optional().nullable(),
  mood: scaleSchema,
  energy: scaleSchema,
  pain: scaleSchema,
  wins: z.string().max(2000).optional().nullable(),
  concerns: z.string().max(2000).optional().nullable(),
  is_quick_entry: z.coerce.boolean().optional().default(false),
  tag_names: z.string().optional(),
});

export const journalQuickSchema = z.object({
  entry_date: dateSchema,
  notes: z.string().max(10000).optional().nullable(),
  mood: scaleSchema,
});

export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
