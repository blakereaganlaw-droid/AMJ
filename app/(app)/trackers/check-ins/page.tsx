import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ScaleInput } from "@/components/ui/ScaleInput";
import { upsertCheckIn } from "@/lib/actions/check-ins";
import { todayISO } from "@/lib/utils/dates";

export default async function CheckInsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const today = todayISO();

  const { data: todayCheckIn } = await supabase
    .from("check_ins")
    .select("*")
    .eq("user_id", user.id)
    .eq("check_in_date", today)
    .maybeSingle();

  const { data: recent } = await supabase
    .from("check_ins")
    .select("check_in_date, mood, energy, pain, sleep")
    .eq("user_id", user.id)
    .order("check_in_date", { ascending: false })
    .limit(7);

  return (
    <>
      <PageHeader title="Daily check-in" description="A gentle pulse on how you are feeling." />
      <Card className="mb-6">
        <form action={upsertCheckIn} className="space-y-5">
          <input type="hidden" name="check_in_date" value={today} />
          <ScaleInput name="mood" label="Mood" defaultValue={todayCheckIn?.mood} />
          <ScaleInput name="energy" label="Energy" defaultValue={todayCheckIn?.energy} />
          <ScaleInput name="pain" label="Pain" defaultValue={todayCheckIn?.pain} lowLabel="None" highLabel="High" />
          <ScaleInput name="sleep" label="Sleep quality" defaultValue={todayCheckIn?.sleep} lowLabel="Poor" highLabel="Great" />
          <Textarea label="Notes (optional)" name="notes" defaultValue={todayCheckIn?.notes ?? ""} rows={2} />
          <Button type="submit">{todayCheckIn ? "Update check-in" : "Save check-in"}</Button>
        </form>
      </Card>
      {recent && recent.length > 0 && (
        <Card>
          <h3 className="mb-4 text-sm font-semibold">Recent week</h3>
          <div className="space-y-3">
            {recent.map((c) => (
              <div key={c.check_in_date} className="flex items-end gap-2">
                <span className="w-20 shrink-0 text-xs text-muted">{c.check_in_date}</span>
                <div className="flex flex-1 gap-1">
                  {c.mood != null && (
                    <div
                      className="rounded bg-lavender-light"
                      style={{ height: `${c.mood * 8}px`, width: "12px" }}
                      title={`Mood ${c.mood}`}
                    />
                  )}
                  {c.energy != null && (
                    <div
                      className="rounded bg-sage-light"
                      style={{ height: `${c.energy * 8}px`, width: "12px" }}
                      title={`Energy ${c.energy}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">Lavender = mood, sage = energy</p>
        </Card>
      )}
    </>
  );
}
