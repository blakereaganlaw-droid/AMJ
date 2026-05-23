import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { createReminder, toggleReminderComplete, deleteReminder } from "@/lib/actions/reminders";
import { formatDateTime } from "@/lib/utils/dates";
import { NAV_ITEMS } from "@/lib/constants/app";

export default async function RemindersPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const showCompleted = params.view === "completed";
  const supabase = await createClient();

  let query = supabase
    .from("reminders")
    .select("*")
    .eq("user_id", user.id)
    .order("due_at", { ascending: true });

  if (showCompleted) {
    query = query.eq("is_completed", true);
  } else {
    query = query.eq("is_completed", false);
  }

  const { data: reminders } = await query;

  const moreLinks = NAV_ITEMS.filter((n) =>
    ["/tasks", "/goals", "/calendar", "/settings"].includes(n.href)
  );

  return (
    <>
      <PageHeader
        title="Reminders"
        description="In-app reminders for medications, appointments, and more."
        action={
          <div className="flex gap-2 text-sm">
            <Link href="/reminders" className={!showCompleted ? "font-medium text-sage" : "text-muted"}>
              Upcoming
            </Link>
            <Link href="/reminders?view=completed" className={showCompleted ? "font-medium text-sage" : "text-muted"}>
              Completed
            </Link>
          </div>
        }
      />

      {!showCompleted && (
        <Card className="mb-6">
          <form action={createReminder} className="space-y-4">
            <Input label="Title" name="title" required placeholder="e.g. Take evening medication" />
            <Textarea label="Description" name="description" rows={2} />
            <Input label="Due date & time" name="due_at" type="datetime-local" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Category"
                name="category"
                options={[
                  { value: "medication", label: "Medication" },
                  { value: "appointment", label: "Appointment" },
                  { value: "general", label: "General" },
                ]}
              />
              <Select
                label="Repeat"
                name="repeat_rule"
                options={[
                  { value: "none", label: "No repeat" },
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                ]}
              />
            </div>
            <Button type="submit">Add reminder</Button>
          </form>
        </Card>
      )}

      {reminders && reminders.length > 0 ? (
        <ul className="space-y-3">
          {reminders.map((r) => (
            <li key={r.id}>
              <Card>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-muted">{formatDateTime(r.due_at)}</p>
                    {r.description && <p className="mt-1 text-sm text-muted">{r.description}</p>}
                  </div>
                  <Badge variant="sky">{r.category}</Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  {!showCompleted && (
                    <form action={toggleReminderComplete.bind(null, r.id, true)}>
                      <Button type="submit" variant="secondary" size="sm">
                        Mark done
                      </Button>
                    </form>
                  )}
                  {showCompleted && (
                    <form action={toggleReminderComplete.bind(null, r.id, false)}>
                      <Button type="submit" variant="ghost" size="sm">
                        Mark incomplete
                      </Button>
                    </form>
                  )}
                  <form action={deleteReminder.bind(null, r.id)}>
                    <Button type="submit" variant="ghost" size="sm">
                      Delete
                    </Button>
                  </form>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={showCompleted ? "No completed reminders" : "No upcoming reminders"}
          description="Add one when you are ready — no pressure."
        />
      )}

      <nav className="mt-10 lg:hidden">
        <p className="mb-3 text-sm font-medium text-muted">More</p>
        <ul className="space-y-2">
          {moreLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-sm font-medium text-sage hover:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
