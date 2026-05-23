"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { symptomSchema } from "@/lib/validations/symptoms";
import { sanitizeText } from "@/lib/utils/sanitize";
import { fail } from "@/lib/utils/errors";

function parseSymptomForm(formData: FormData) {
  return {
    name: formData.get("name"),
    severity: formData.get("severity"),
    body_area: formData.get("body_area"),
    category: formData.get("category"),
    notes: formData.get("notes"),
    occurred_at: formData.get("occurred_at"),
  };
}

export async function createSymptom(formData: FormData) {
  const user = await requireUser();
  const parsed = symptomSchema.safeParse(parseSymptomForm(formData));
  if (!parsed.success) fail("Please check symptom fields.");

  const supabase = await createClient();
  const d = parsed.data;
  const { error } = await supabase.from("symptoms").insert({
    user_id: user.id,
    name: sanitizeText(d.name, 200)!,
    severity: d.severity,
    body_area: sanitizeText(d.body_area, 100),
    category: sanitizeText(d.category, 100),
    notes: sanitizeText(d.notes),
    occurred_at: d.occurred_at,
  });

  if (error) fail(error.message);
  revalidatePath("/trackers");
  revalidatePath("/dashboard");
}

export async function updateSymptom(id: string, formData: FormData) {
  const user = await requireUser();
  const parsed = symptomSchema.safeParse(parseSymptomForm(formData));
  if (!parsed.success) fail("Please check symptom fields.");

  const supabase = await createClient();
  const d = parsed.data;
  const { error } = await supabase
    .from("symptoms")
    .update({
      name: sanitizeText(d.name, 200)!,
      severity: d.severity,
      body_area: sanitizeText(d.body_area, 100),
      category: sanitizeText(d.category, 100),
      notes: sanitizeText(d.notes),
      occurred_at: d.occurred_at,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) fail(error.message);
  revalidatePath("/trackers");
  revalidatePath("/dashboard");
}

export async function archiveSymptom(id: string, archived: boolean) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("symptoms")
    .update({ is_archived: archived })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) fail(error.message);
  revalidatePath("/trackers");
}

export async function deleteSymptom(id: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("symptoms").delete().eq("id", id).eq("user_id", user.id);
  if (error) fail(error.message);
  revalidatePath("/trackers");
}
