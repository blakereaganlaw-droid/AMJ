"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { taskSchema } from "@/lib/validations/tasks";
import { sanitizeText } from "@/lib/utils/sanitize";
import { fail } from "@/lib/utils/errors";

function parseTaskForm(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status") || "todo",
    priority: formData.get("priority") || "medium",
    due_date: formData.get("due_date") || null,
    project_category: formData.get("project_category"),
    notes: formData.get("notes"),
  };
}

export async function createTask(formData: FormData) {
  const user = await requireUser();
  const parsed = taskSchema.safeParse(parseTaskForm(formData));
  if (!parsed.success) fail("Please check task fields.");

  const supabase = await createClient();
  const d = parsed.data;
  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title: sanitizeText(d.title, 200)!,
    description: sanitizeText(d.description),
    status: d.status,
    priority: d.priority,
    due_date: d.due_date,
    project_category: sanitizeText(d.project_category, 100),
    notes: sanitizeText(d.notes),
  });

  if (error) fail(error.message);
  revalidatePath("/tasks");
}

export async function updateTask(id: string, formData: FormData) {
  const user = await requireUser();
  const parsed = taskSchema.safeParse(parseTaskForm(formData));
  if (!parsed.success) fail("Please check task fields.");

  const supabase = await createClient();
  const d = parsed.data;
  const { error } = await supabase
    .from("tasks")
    .update({
      title: sanitizeText(d.title, 200)!,
      description: sanitizeText(d.description),
      status: d.status,
      priority: d.priority,
      due_date: d.due_date,
      project_category: sanitizeText(d.project_category, 100),
      notes: sanitizeText(d.notes),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) fail(error.message);
  revalidatePath("/tasks");
}

export async function archiveTask(id: string, archived: boolean) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ is_archived: archived })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) fail(error.message);
  revalidatePath("/tasks");
}

export async function deleteTask(id: string) {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id);
  if (error) fail(error.message);
  revalidatePath("/tasks");
}
