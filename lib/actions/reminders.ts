"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { reminderSchema } from "@/lib/validations/reminders";
import { sanitizeText } from "@/lib/utils/sanitize";
import { fail } from "@/lib/utils/errors";

function parseReminderForm(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    due_at: formData.get("due_at"),
    repeat_rule: formData.get("repeat_rule") || "none",
    category: formData.get("category") || "general",
  };
}

export async function createReminder(formData: FormData) {
  const user = await requireUser();
  const parsed = reminderSchema.safeParse(parseReminderForm(formData));
  if (!parsed.success) fail("Please check reminder fields.");

  const supabase = await createClient();
  const d = parsed.data;
  const { error } = await supabase.from("reminders").insert({
    user_id: user.id,
    title: sanitizeText(d.title, 200)!,
    description: sanitizeText(d.description),
    due_at: d.due_at,
    repeat_rule: d.repeat_rule,
    category: d.category,
  });

  if (error) fail(error.message);
  revalidatePath("/reminders");
  revalidatePath("/dashboard");
}

export async function updateReminder(id: string, formData: FormData) {
  const user = await requireUser();
  const parsed = reminderSchema.safeParse(parseReminderForm(formData));
  if (!parsed.success) fail("Please check reminder fields.");

  const supabase = await createClient();
  const d = parsed.data;
  const { error } = await supabase
    .from("reminders")
    .update({
      title: sanitizeText(d.title, 200)!,
      description: sanitizeText(d.description),
      due_at: d.due_at,
      repeat_rule: d.repeat_rule,
      category: d.category,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) fail(error.message);
  revalidatePath("/reminders");
  revalidatePath("/dashboard");
}

export async function toggleReminderComplete(id: string, completed: boolean) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("reminders")
    .update({ is_completed: completed })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) fail(error.message);
  revalidatePath("/reminders");
  revalidatePath("/dashboard");
}

export async function deleteReminder(id: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("reminders").delete().eq("id", id).eq("user_id", user.id);
  if (error) fail(error.message);
  revalidatePath("/reminders");
  revalidatePath("/dashboard");
}
