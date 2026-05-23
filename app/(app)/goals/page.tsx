import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { createGoal, updateGoal, completeGoal, deleteGoal } from "@/lib/actions/goals";
import { formatDate } from "@/lib/utils/dates";

export default async function GoalsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader title="Goals" description="Set gentle goals and track progress your way." />
      <Card className="mb-6">
        <form action={createGoal} className="space-y-4">
          <Input label="Goal" name="title" required placeholder="e.g. Walk 10 minutes daily" />
          <Textarea label="Description" name="description" rows={2} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Target date" name="target_date" type="date" />
            <Input label="Habit frequency" name="habit_frequency" placeholder="e.g. Daily" />
          </div>
          <Input label="Starting progress %" name="progress" type="number" min={0} max={100} defaultValue={0} />
          <Button type="submit">Add goal</Button>
        </form>
      </Card>
      {goals && goals.length > 0 ? (
        <ul className="space-y-4">
          {goals.map((g) => (
            <li key={g.id}>
              <Card>
                <div className="flex justify-between">
                  <p className="font-medium">{g.title}</p>
                  <span className="text-sm text-muted">{g.progress}%</span>
                </div>
                {g.description && <p className="mt-1 text-sm text-muted">{g.description}</p>}
                {g.target_date && (
                  <p className="text-xs text-muted">Target: {formatDate(g.target_date)}</p>
                )}
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream">
                  <div className="h-full rounded-full bg-sage" style={{ width: `${g.progress}%` }} />
                </div>
                <form action={updateGoal.bind(null, g.id)} className="mt-4 space-y-3">
                  <input type="hidden" name="title" value={g.title} />
                  <input type="hidden" name="description" value={g.description ?? ""} />
                  <input type="hidden" name="target_date" value={g.target_date ?? ""} />
                  <input type="hidden" name="habit_frequency" value={g.habit_frequency ?? ""} />
                  <div className="flex items-center gap-3">
                    <label className="text-sm">Progress</label>
                    <input
                      type="range"
                      name="progress"
                      min={0}
                      max={100}
                      defaultValue={g.progress}
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" variant="secondary">
                      Update
                    </Button>
                  </div>
                </form>
                <div className="mt-2 flex gap-2">
                  {!g.is_completed && (
                    <form action={completeGoal.bind(null, g.id, true)}>
                      <Button type="submit" size="sm">
                        Mark complete
                      </Button>
                    </form>
                  )}
                  <form action={deleteGoal.bind(null, g.id)}>
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
        <EmptyState title="No goals yet" description="When you are ready, set one small goal." />
      )}
    </>
  );
}
