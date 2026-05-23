import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDateTime } from "@/lib/utils/dates";
import type { getDashboardData } from "@/lib/queries/dashboard";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export function DashboardCards({ data }: { data: DashboardData }) {
  const { journalToday, checkInToday, nextReminder, recentSymptoms, activeGoals } = data;

  return (
    <div className="space-y-4">
      <Card className="border-sage/20 bg-sage-light/30">
        <p className="text-sm font-medium text-sage">
          You are making progress, even on hard days.
        </p>
      </Card>

      <Card>
        <CardTitle>Today</CardTitle>
        <CardDescription className="mt-2">
          {journalToday
            ? "You have a journal entry for today."
            : "No journal entry yet — a few words is enough."}
          {checkInToday ? " Check-in recorded." : " No check-in yet."}
        </CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/journal/new">
            <Button>{journalToday ? "Edit today's note" : "Add today's note"}</Button>
          </Link>
          {!checkInToday && (
            <Link href="/trackers/check-ins">
              <Button variant="secondary">Quick check-in</Button>
            </Link>
          )}
        </div>
      </Card>

      <Card>
        <CardTitle>Next reminder</CardTitle>
        {nextReminder ? (
          <>
            <CardDescription className="mt-2">
              <span className="font-medium text-foreground">{nextReminder.title}</span>
              <br />
              {formatDateTime(nextReminder.due_at)}
            </CardDescription>
            <Badge variant="sky" className="mt-2">
              {nextReminder.category}
            </Badge>
          </>
        ) : (
          <CardDescription className="mt-2">Nothing scheduled soon. Enjoy the calm.</CardDescription>
        )}
        <Link href="/reminders" className="mt-4 inline-block text-sm font-medium text-sage hover:underline">
          View all reminders
        </Link>
      </Card>

      <Card>
        <CardTitle>Symptoms snapshot</CardTitle>
        {recentSymptoms.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {recentSymptoms.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <span>{s.name}</span>
                <Badge variant="lavender">Severity {s.severity}/10</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <CardDescription className="mt-2">No recent symptoms logged.</CardDescription>
        )}
        <Link href="/trackers/symptoms" className="mt-4 inline-block text-sm font-medium text-sage hover:underline">
          Log a symptom
        </Link>
      </Card>

      <Card>
        <CardTitle>Mood & energy</CardTitle>
        {checkInToday ? (
          <div className="mt-3 flex gap-4 text-sm">
            {checkInToday.mood != null && <span>Mood: {checkInToday.mood}/10</span>}
            {checkInToday.energy != null && <span>Energy: {checkInToday.energy}/10</span>}
          </div>
        ) : (
          <CardDescription className="mt-2">How are you feeling today?</CardDescription>
        )}
        <Link href="/trackers/check-ins" className="mt-4 inline-block">
          <Button variant="secondary" size="sm">
            {checkInToday ? "Update check-in" : "Check in now"}
          </Button>
        </Link>
      </Card>

      <Card>
        <CardTitle>Goal progress</CardTitle>
        {activeGoals.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {activeGoals.map((g) => (
              <li key={g.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{g.title}</span>
                  <span className="text-muted">{g.progress}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream">
                  <div
                    className="h-full rounded-full bg-sage transition-all"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
                {g.target_date && (
                  <p className="mt-1 text-xs text-muted">Target: {formatDate(g.target_date)}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <CardDescription className="mt-2">Set a gentle goal when you are ready.</CardDescription>
        )}
        <Link href="/goals" className="mt-4 inline-block text-sm font-medium text-sage hover:underline">
          View goals
        </Link>
      </Card>
    </div>
  );
}
