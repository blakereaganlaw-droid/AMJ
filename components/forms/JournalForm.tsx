import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ScaleInput } from "@/components/ui/ScaleInput";
import { JOURNAL_PROMPTS } from "@/lib/constants/app";
import { todayISO } from "@/lib/utils/dates";
import type { JournalEntry } from "@/types/database";

export function JournalForm({
  entry,
  action,
  quick = false,
}: {
  entry?: JournalEntry;
  action: (formData: FormData) => void | Promise<void>;
  quick?: boolean;
}) {
  const date = entry?.entry_date ?? todayISO();

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="entry_date" value={date} />
      <input type="hidden" name="is_quick_entry" value={quick ? "true" : "false"} />

      {!quick && (
        <>
          <Input label="Title (optional)" name="title" defaultValue={entry?.title ?? ""} />
          <p className="text-sm text-muted italic">
            {JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]}
          </p>
        </>
      )}

      <Textarea
        label={quick ? "How was today?" : "Notes"}
        name="notes"
        defaultValue={entry?.notes ?? ""}
        rows={quick ? 4 : 6}
        placeholder="Write as much or as little as feels right…"
      />

      <ScaleInput
        name="mood"
        label="Mood"
        defaultValue={entry?.mood}
        lowLabel="Low"
        highLabel="Great"
      />

      {!quick && (
        <>
          <Textarea
            label="Symptoms (summary)"
            name="symptoms_summary"
            defaultValue={entry?.symptoms_summary ?? ""}
            rows={2}
          />
          <Textarea
            label="Medications taken"
            name="medications_taken"
            defaultValue={entry?.medications_taken ?? ""}
            rows={2}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Hydration (glasses)"
              name="hydration"
              type="number"
              min={0}
              max={20}
              defaultValue={entry?.hydration ?? ""}
            />
            <Input
              label="Sleep (hours)"
              name="sleep_hours"
              type="number"
              min={0}
              max={24}
              step={0.5}
              defaultValue={entry?.sleep_hours ?? ""}
            />
          </div>
          <ScaleInput name="energy" label="Energy" defaultValue={entry?.energy} />
          <ScaleInput name="pain" label="Pain" defaultValue={entry?.pain} lowLabel="None" highLabel="Severe" />
          <Textarea label="Small wins" name="wins" defaultValue={entry?.wins ?? ""} rows={2} />
          <Textarea label="Concerns" name="concerns" defaultValue={entry?.concerns ?? ""} rows={2} />
          <Input
            label="Tags (comma-separated)"
            name="tag_names"
            placeholder="recovery, sleep, exercise"
          />
        </>
      )}

      <Button type="submit" className="w-full sm:w-auto">
        {entry ? "Save changes" : quick ? "Save quick entry" : "Save entry"}
      </Button>
    </form>
  );
}
