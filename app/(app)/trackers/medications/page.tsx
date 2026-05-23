import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { createMedication, deleteMedication } from "@/lib/actions/medications";
import { formatDateTime } from "@/lib/utils/dates";

export default async function MedicationsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: meds } = await supabase
    .from("medications")
    .select("*")
    .eq("user_id", user.id)
    .order("taken_at", { ascending: false })
    .limit(20);

  const now = new Date().toISOString();

  return (
    <>
      <PageHeader title="Medications" description="A simple log of what you have taken." />
      <Card className="mb-6">
        <form action={createMedication} className="space-y-4">
          <Input label="Medication name" name="name" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Dosage" name="dosage" placeholder="e.g. 10mg" />
            <Input label="Frequency" name="frequency" placeholder="e.g. Daily" />
          </div>
          <Textarea label="Notes" name="notes" rows={2} />
          <input type="hidden" name="taken_at" value={now} />
          <Button type="submit">Log medication</Button>
        </form>
      </Card>
      {meds && meds.length > 0 ? (
        <ul className="space-y-3">
          {meds.map((m) => (
            <li key={m.id}>
              <Card>
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-muted">
                  {formatDateTime(m.taken_at)}
                  {m.dosage ? ` · ${m.dosage}` : ""}
                </p>
                <form action={deleteMedication.bind(null, m.id)} className="mt-3">
                  <Button type="submit" variant="ghost" size="sm">
                    Remove
                  </Button>
                </form>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No medications logged" description="Log when you take something — it helps you notice patterns." />
      )}
    </>
  );
}
