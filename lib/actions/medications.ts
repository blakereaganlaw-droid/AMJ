"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { medicationSchema } from "@/lib/validations/medications";
import { sanitizeText } from "@/lib/utils/sanitize";
import { fail } from "@/lib/utils/errors";

export async function createMedication(formData: FormData) {
  const user = await requireUser();
  const parsed = medicationSchema.safeParse({
    name: formData.get("name"),
    dosage: formData.get("dosage"),
    frequency: formData.get("frequency"),
    notes: formData.get("notes"),
    taken_at: formData.get("taken_at"),
    journal_entry_id: formData.get("journal_entry_id") || null,
  });

  if (!parsed.success) fail("Please check medication fields.");

  const supabase = await createClient();
  const d = parsed.data;
  const { error } = await supabase.from("medications").insert({
    user_id: user.id,
    name: sanitizeText(d.name, 200)!,
    dosage: sanitizeText(d.dosage, 100),
    frequency: sanitizeText(d.frequency, 100),
    notes: sanitizeText(d.notes),
    taken_at: d.taken_at,
    journal_entry_id: d.journal_entry_id,
  });

  if (error) fail(error.message);
  revalidatePath("/trackers");
}

export async function deleteMedication(id: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("medications").delete().eq("id", id).eq("user_id", user.id);
  if (error) fail(error.message);
  revalidatePath("/trackers");
}
