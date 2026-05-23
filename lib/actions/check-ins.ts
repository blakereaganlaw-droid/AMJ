"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { checkInSchema } from "@/lib/validations/check-ins";
import { sanitizeText } from "@/lib/utils/sanitize";
import { fail } from "@/lib/utils/errors";

export async function upsertCheckIn(formData: FormData) {
  const user = await requireUser();
  const parsed = checkInSchema.safeParse({
    check_in_date: formData.get("check_in_date"),
    mood: formData.get("mood") || null,
    energy: formData.get("energy") || null,
    pain: formData.get("pain") || null,
    sleep: formData.get("sleep") || null,
    notes: formData.get("notes"),
  });

  if (!parsed.success) fail("Please check your check-in values.");

  const supabase = await createClient();
  const d = parsed.data;

  const { error } = await supabase.from("check_ins").upsert(
    {
      user_id: user.id,
      check_in_date: d.check_in_date,
      mood: d.mood ?? null,
      energy: d.energy ?? null,
      pain: d.pain ?? null,
      sleep: d.sleep ?? null,
      notes: sanitizeText(d.notes),
    },
    { onConflict: "user_id,check_in_date" }
  );

  if (error) fail(error.message);
  revalidatePath("/trackers");
  revalidatePath("/dashboard");
}
