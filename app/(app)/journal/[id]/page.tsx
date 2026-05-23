import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { JournalForm } from "@/components/forms/JournalForm";
import { updateJournalEntry, archiveJournalEntry, deleteJournalEntry } from "@/lib/actions/journal";
import { formatDate } from "@/lib/utils/dates";

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!entry) notFound();

  const updateAction = updateJournalEntry.bind(null, id);
  const deleteAction = deleteJournalEntry.bind(null, id);

  return (
    <>
      <PageHeader
        title={entry.title || `Entry — ${formatDate(entry.entry_date)}`}
        description={formatDate(entry.entry_date)}
        action={
          <Link href="/journal">
            <Button variant="ghost" size="sm">
              Back
            </Button>
          </Link>
        }
      />
      <Card>
        <JournalForm entry={entry} action={updateAction} quick={entry.is_quick_entry} />
      </Card>
      <div className="mt-6 flex flex-wrap gap-3">
        <form
          action={async () => {
            "use server";
            await archiveJournalEntry(id, !entry.is_archived);
          }}
        >
          <Button type="submit" variant="secondary" size="sm">
            {entry.is_archived ? "Unarchive" : "Archive"}
          </Button>
        </form>
        <form action={deleteAction}>
          <Button type="submit" variant="danger" size="sm">
            Delete
          </Button>
        </form>
      </div>
    </>
  );
}
