import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { createSymptom, deleteSymptom } from "@/lib/actions/symptoms";
import { formatDateTime } from "@/lib/utils/dates";

export default async function SymptomsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: symptoms } = await supabase
    .from("symptoms")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("occurred_at", { ascending: false })
    .limit(20);

  const now = new Date().toISOString();

  return (
    <>
      <PageHeader title="Symptoms" description="Notice patterns gently — no judgment." />
      <Card className="mb-6">
        <form action={createSymptom} className="space-y-4">
          <Input label="Symptom name" name="name" required placeholder="e.g. Headache" />
          <Input label="Severity (1–10)" name="severity" type="number" min={1} max={10} required defaultValue={5} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Body area" name="body_area" placeholder="e.g. Head" />
            <Input label="Category" name="category" placeholder="e.g. Pain" />
          </div>
          <Textarea label="Notes" name="notes" rows={2} />
          <input type="hidden" name="occurred_at" value={now} />
          <Button type="submit">Log symptom</Button>
        </form>
      </Card>
      {symptoms && symptoms.length > 0 ? (
        <ul className="space-y-3">
          {symptoms.map((s) => (
            <li key={s.id}>
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted">{formatDateTime(s.occurred_at)}</p>
                    {s.notes && <p className="mt-1 text-sm text-muted">{s.notes}</p>}
                  </div>
                  <Badge variant="lavender">{s.severity}/10</Badge>
                </div>
                <form action={deleteSymptom.bind(null, s.id)} className="mt-3">
                  <Button type="submit" variant="ghost" size="sm">
                    Remove
                  </Button>
                </form>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No symptoms logged" description="When something comes up, log it here." />
      )}
    </>
  );
}
