"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { goalSchema } from "@/lib/validations/goals";
import { sanitizeText } from "@/lib/utils/sanitize";
import { fail } from "@/lib/utils/errors";

function parseGoalForm(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    target_date: formData.get("target_date") || null,
    progress: formData.get("progress") || 0,
    habit_frequency: formData.get("habit_frequency"),
  };
}

export async function createGoal(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = goalSchema.safeParse(parseGoalForm(formData));
  if (!parsed.success) fail("Please check goal fields.");

  const supabase = await createClient();
  const d = parsed.data;
  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    title: sanitizeText(d.title, 200)!,
    description: sanitizeText(d.description),
    target_date: d.target_date,
    progress: d.progress,
    habit_frequency: sanitizeText(d.habit_frequency, 100),
  });

  if (error) fail(error.message);
  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function updateGoal(id: string, formData: FormData) {
  const user = await requireUser();
  const parsed = goalSchema.safeParse(parseGoalForm(formData));
  if (!parsed.success) fail("Please check goal fields.");

  const supabase = await createClient();
  const d = parsed.data;
  const { error } = await supabase
    .from("goals")
    .update({
      title: sanitizeText(d.title, 200)!,
      description: sanitizeText(d.description),
      target_date: d.target_date,
      progress: d.progress,
      habit_frequency: sanitizeText(d.habit_frequency, 100),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) fail(error.message);
  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function completeGoal(id: string, completed: boolean) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("goals")
    .update({
      is_completed: completed,
      ...(completed ? { progress: 100 } : {}),
    })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) fail(error.message);
  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function archiveGoal(id: string, archived: boolean) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("goals")
    .update({ is_archived: archived })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) fail(error.message);
  revalidatePath("/goals");
}

export async function deleteGoal(id: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id);
  if (error) fail(error.message);
  revalidatePath("/goals");
}
