"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { journalEntrySchema, journalQuickSchema } from "@/lib/validations/journal";
import { sanitizeText } from "@/lib/utils/sanitize";
import { fail } from "@/lib/utils/errors";

async function syncTags(userId: string, entryId: string, tagNamesRaw?: string | null) {
  if (!tagNamesRaw) return;
  const supabase = await createClient();
  const names = tagNamesRaw
    .split(",")
    .map((n) => n.trim().toLowerCase())
    .filter(Boolean);

  if (names.length === 0) return;

  const tagIds: string[] = [];
  for (const name of names) {
    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .eq("user_id", userId)
      .eq("name", name)
      .maybeSingle();

    if (existing) {
      tagIds.push(existing.id);
    } else {
      const { data: created } = await supabase
        .from("tags")
        .insert({ user_id: userId, name })
        .select("id")
        .single();
      if (created) tagIds.push(created.id);
    }
  }

  await supabase.from("journal_entry_tags").delete().eq("journal_entry_id", entryId);
  if (tagIds.length > 0) {
    await supabase.from("journal_entry_tags").insert(
      tagIds.map((tag_id) => ({ journal_entry_id: entryId, tag_id }))
    );
  }
}

function parseJournalForm(formData: FormData) {
  return {
    entry_date: formData.get("entry_date"),
    title: formData.get("title"),
    notes: formData.get("notes"),
    symptoms_summary: formData.get("symptoms_summary"),
    medications_taken: formData.get("medications_taken"),
    hydration: formData.get("hydration") || null,
    sleep_hours: formData.get("sleep_hours") || null,
    mood: formData.get("mood") || null,
    energy: formData.get("energy") || null,
    pain: formData.get("pain") || null,
    wins: formData.get("wins"),
    concerns: formData.get("concerns"),
    is_quick_entry: formData.get("is_quick_entry") === "true",
    tag_names: formData.get("tag_names")?.toString(),
  };
}

export async function createJournalEntry(formData: FormData): Promise<void> {
  const user = await requireUser();
  const isQuick = formData.get("is_quick_entry") === "true";
  const parsed = isQuick
    ? journalQuickSchema.safeParse({
        entry_date: formData.get("entry_date"),
        notes: formData.get("notes"),
        mood: formData.get("mood") || null,
      })
    : journalEntrySchema.safeParse(parseJournalForm(formData));

  if (!parsed.success) {
    fail("Please check your journal entry fields.");
  }

  const supabase = await createClient();
  const data = parsed.data;

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: user.id,
      entry_date: data.entry_date,
      title: "title" in data ? sanitizeText(data.title as string | null) : null,
      notes: sanitizeText(data.notes as string | null),
      symptoms_summary: "symptoms_summary" in data ? sanitizeText(data.symptoms_summary as string | null) : null,
      medications_taken: "medications_taken" in data ? sanitizeText(data.medications_taken as string | null) : null,
      hydration: "hydration" in data ? data.hydration : null,
      sleep_hours: "sleep_hours" in data ? data.sleep_hours : null,
      mood: data.mood ?? null,
      energy: "energy" in data ? data.energy : null,
      pain: "pain" in data ? data.pain : null,
      wins: "wins" in data ? sanitizeText(data.wins as string | null) : null,
      concerns: "concerns" in data ? sanitizeText(data.concerns as string | null) : null,
      is_quick_entry: isQuick,
    })
    .select("id")
    .single();

  if (error || !entry) {
    fail(error?.message ?? "Could not save journal entry.");
  }

  if (!isQuick && "tag_names" in data) {
    await syncTags(user.id, entry.id, data.tag_names as string | undefined);
  }

  revalidatePath("/journal");
  revalidatePath("/dashboard");
  redirect(`/journal/${entry.id}`);
}

export async function updateJournalEntry(id: string, formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = journalEntrySchema.safeParse(parseJournalForm(formData));

  if (!parsed.success) {
    fail("Please check your journal entry fields.");
  }

  const supabase = await createClient();
  const d = parsed.data;

  const { error } = await supabase
    .from("journal_entries")
    .update({
      entry_date: d.entry_date,
      title: sanitizeText(d.title),
      notes: sanitizeText(d.notes),
      symptoms_summary: sanitizeText(d.symptoms_summary),
      medications_taken: sanitizeText(d.medications_taken),
      hydration: d.hydration,
      sleep_hours: d.sleep_hours,
      mood: d.mood,
      energy: d.energy,
      pain: d.pain,
      wins: sanitizeText(d.wins),
      concerns: sanitizeText(d.concerns),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) fail(error.message);

  await syncTags(user.id, id, d.tag_names);
  revalidatePath("/journal");
  revalidatePath("/dashboard");
}

export async function archiveJournalEntry(id: string, archived: boolean): Promise<void> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("journal_entries")
    .update({ is_archived: archived })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) fail(error.message);
  revalidatePath("/journal");
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) fail(error.message);
  revalidatePath("/journal");
  redirect("/journal");
}
