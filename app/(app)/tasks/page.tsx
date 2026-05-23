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
import { createTask, updateTask, archiveTask, deleteTask } from "@/lib/actions/tasks";
import { formatDate } from "@/lib/utils/dates";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const showArchived = params.archived === "true";
  const supabase = await createClient();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", showArchived)
    .order("due_date", { ascending: true, nullsFirst: false });

  return (
    <>
      <PageHeader
        title="Care plan"
        description="Lightweight tasks for your health projects — human-friendly, not overwhelming."
      />
      {!showArchived && (
        <Card className="mb-6">
          <form action={createTask} className="space-y-4">
            <Input label="Task" name="title" required placeholder="e.g. Schedule follow-up" />
            <Input label="Health category / project" name="project_category" placeholder="e.g. Physical therapy" />
            <Textarea label="Description" name="description" rows={2} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Select
                label="Status"
                name="status"
                options={[
                  { value: "todo", label: "To do" },
                  { value: "in_progress", label: "In progress" },
                  { value: "done", label: "Done" },
                ]}
              />
              <Select
                label="Priority"
                name="priority"
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
              />
              <Input label="Due date" name="due_date" type="date" />
            </div>
            <Button type="submit">Add task</Button>
          </form>
        </Card>
      )}
      {tasks && tasks.length > 0 ? (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li key={t.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{t.title}</p>
                    {t.project_category && (
                      <p className="text-sm text-muted">{t.project_category}</p>
                    )}
                    {t.due_date && (
                      <p className="text-xs text-muted">Due {formatDate(t.due_date)}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Badge variant={t.priority === "high" ? "lavender" : "neutral"}>{t.priority}</Badge>
                    <Badge variant="sage">{t.status.replace("_", " ")}</Badge>
                  </div>
                </div>
                <form action={updateTask.bind(null, t.id)} className="mt-4 flex flex-wrap gap-2">
                  <input type="hidden" name="title" value={t.title} />
                  <input type="hidden" name="description" value={t.description ?? ""} />
                  <input type="hidden" name="project_category" value={t.project_category ?? ""} />
                  <input type="hidden" name="priority" value={t.priority} />
                  <input type="hidden" name="due_date" value={t.due_date ?? ""} />
                  <input type="hidden" name="notes" value={t.notes ?? ""} />
                  {t.status !== "done" && (
                    <>
                      <input type="hidden" name="status" value={t.status === "todo" ? "in_progress" : "done"} />
                      <Button type="submit" variant="secondary" size="sm">
                        {t.status === "todo" ? "Start" : "Complete"}
                      </Button>
                    </>
                  )}
                </form>
                <div className="mt-2 flex gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await archiveTask(t.id, !t.is_archived);
                    }}
                  >
                    <Button type="submit" variant="ghost" size="sm">
                      {t.is_archived ? "Restore" : "Archive"}
                    </Button>
                  </form>
                  <form action={deleteTask.bind(null, t.id)}>
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
        <EmptyState title="No tasks yet" description="Add care plan items at your own pace." />
      )}
    </>
  );
}
