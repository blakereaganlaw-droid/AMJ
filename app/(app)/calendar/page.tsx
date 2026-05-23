import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDateTime } from "@/lib/utils/dates";
import { startOfMonth, endOfMonth, format } from "date-fns";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const now = new Date();
  const year = parseInt(params.year ?? String(now.getFullYear()), 10);
  const month = parseInt(params.month ?? String(now.getMonth() + 1), 10);
  const rangeStart = startOfMonth(new Date(year, month - 1));
  const rangeEnd = endOfMonth(rangeStart);

  const supabase = await createClient();

  const [journalsRes, remindersRes, checkInsRes] = await Promise.all([
    supabase
      .from("journal_entries")
      .select("id, entry_date, title")
      .eq("user_id", user.id)
      .gte("entry_date", format(rangeStart, "yyyy-MM-dd"))
      .lte("entry_date", format(rangeEnd, "yyyy-MM-dd")),
    supabase
      .from("reminders")
      .select("id, title, due_at, category")
      .eq("user_id", user.id)
      .gte("due_at", rangeStart.toISOString())
      .lte("due_at", rangeEnd.toISOString()),
    supabase
      .from("check_ins")
      .select("id, check_in_date, mood")
      .eq("user_id", user.id)
      .gte("check_in_date", format(rangeStart, "yyyy-MM-dd"))
      .lte("check_in_date", format(rangeEnd, "yyyy-MM-dd")),
  ]);

  const journalRows = (journalsRes.data ?? []) as Pick<
    import("@/types/database").JournalEntry,
    "id" | "entry_date" | "title"
  >[];
  const reminderRows = (remindersRes.data ?? []) as Pick<
    import("@/types/database").Reminder,
    "id" | "title" | "due_at" | "category"
  >[];
  const checkInRows = (checkInsRes.data ?? []) as Pick<
    import("@/types/database").CheckIn,
    "id" | "check_in_date" | "mood"
  >[];

  type TimelineItem = {
    id: string;
    date: string;
    label: string;
    type: "journal" | "reminder" | "checkin";
    href: string;
    extra?: string;
  };

  const items: TimelineItem[] = [
    ...journalRows.map((j) => ({
      id: j.id,
      date: j.entry_date,
      label: j.title || "Journal entry",
      type: "journal" as const,
      href: `/journal/${j.id}`,
    })),
    ...reminderRows.map((r) => ({
      id: r.id,
      date: r.due_at.split("T")[0],
      label: r.title,
      type: "reminder" as const,
      href: "/reminders",
      extra: r.category,
    })),
    ...checkInRows.map((c) => ({
      id: c.id,
      date: c.check_in_date,
      label: `Check-in${c.mood != null ? ` (mood ${c.mood})` : ""}`,
      type: "checkin" as const,
      href: "/trackers/check-ins",
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const prevMonth = month === 1 ? { m: 12, y: year - 1 } : { m: month - 1, y: year };
  const nextMonth = month === 12 ? { m: 1, y: year + 1 } : { m: month + 1, y: year };

  return (
    <>
      <PageHeader
        title="Calendar"
        description="A calm timeline of your journal, reminders, and check-ins."
      />
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/calendar?year=${prevMonth.y}&month=${prevMonth.m}`} className="text-sm text-sage hover:underline">
          ← Previous
        </Link>
        <span className="font-medium">{format(rangeStart, "MMMM yyyy")}</span>
        <Link href={`/calendar?year=${nextMonth.y}&month=${nextMonth.m}`} className="text-sm text-sage hover:underline">
          Next →
        </Link>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={`${item.type}-${item.id}`}>
              <Link href={item.href}>
                <Card className="transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted">
                        {item.type === "reminder"
                          ? formatDateTime(
                              reminderRows.find((r) => r.id === item.id)?.due_at ?? item.date
                            )
                          : formatDate(item.date)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.type === "journal"
                          ? "sage"
                          : item.type === "reminder"
                            ? "sky"
                            : "lavender"
                      }
                    >
                      {item.type}
                    </Badge>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="text-center py-12">
          <p className="text-muted">Nothing on the calendar this month yet.</p>
          <p className="mt-2 text-sm text-muted italic">One day at a time.</p>
        </Card>
      )}
    </>
  );
}
