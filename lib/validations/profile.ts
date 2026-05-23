import { z } from "zod";

export const profileSchema = z.object({
  display_name: z.string().min(1).max(100),
  timezone: z.string().min(1).max(64),
});

export type ProfileInput = z.infer<typeof profileSchema>;
