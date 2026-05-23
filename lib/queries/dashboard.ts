import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { todayISO } from "@/lib/utils/dates";
import { subHours } from "date-fns";

export async function getDashboardData() {
  const user = await requireUser();
  const supabase = await createClient();
  const today = todayISO();
  const twoDaysAgo = subHours(new Date(), 48).toISOString();

  const [
    profileRes,
    journalTodayRes,
    checkInTodayRes,
    nextReminderRes,
    symptomsRes,
    goalsRes,
  ] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
    supabase
      .from("journal_entries")
      .select("id, title, mood, notes, is_quick_entry")
      .eq("user_id", user.id)
      .eq("entry_date", today)
      .eq("is_archived", false)
      .maybeSingle(),
    supabase
      .from("check_ins")
      .select("id, mood, energy, pain, sleep")
      .eq("user_id", user.id)
      .eq("check_in_date", today)
      .maybeSingle(),
    supabase
      .from("reminders")
      .select("id, title, due_at, category")
      .eq("user_id", user.id)
      .eq("is_completed", false)
      .gte("due_at", new Date().toISOString())
      .order("due_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("symptoms")
      .select("id, name, severity, occurred_at")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .gte("occurred_at", twoDaysAgo)
      .order("occurred_at", { ascending: false })
      .limit(3),
    supabase
      .from("goals")
      .select("id, title, progress, target_date")
      .eq("user_id", user.id)
      .eq("is_archived", false)
      .eq("is_completed", false)
      .order("progress", { ascending: false })
      .limit(2),
  ]);

  return {
    displayName: profileRes.data?.display_name ?? "there",
    journalToday: journalTodayRes.data,
    checkInToday: checkInTodayRes.data,
    nextReminder: nextReminderRes.data,
    recentSymptoms: symptomsRes.data ?? [],
    activeGoals: goalsRes.data ?? [],
  };
}
