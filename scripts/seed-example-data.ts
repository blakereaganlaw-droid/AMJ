/**
 * Dev-only seed script. Requires SUPABASE_SERVICE_ROLE_KEY.
 * Run: npx tsx scripts/seed-example-data.ts
 *
 * Note: Create a test user via signup first, then set SEED_USER_ID below.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const userId = process.env.SEED_USER_ID;

if (!url || !serviceKey || !userId) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SEED_USER_ID");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function seed() {
  const today = new Date().toISOString().split("T")[0];

  await supabase.from("journal_entries").insert({
    user_id: userId,
    entry_date: today,
    title: "A gentle start",
    notes: "Took things slowly today. Small steps matter.",
    mood: 6,
    energy: 5,
    is_quick_entry: false,
  });

  await supabase.from("reminders").insert({
    user_id: userId,
    title: "Evening medication",
    due_at: new Date(Date.now() + 86400000).toISOString(),
    category: "medication",
    repeat_rule: "daily",
  });

  await supabase.from("goals").insert({
    user_id: userId,
    title: "10-minute walk",
    progress: 30,
    habit_frequency: "Daily",
  });

  console.log("Seed data inserted for user", userId);
}

seed().catch(console.error);
