import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { JournalForm } from "@/components/forms/JournalForm";
import { createJournalEntry } from "@/lib/actions/journal";

export default async function NewJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ quick?: string }>;
}) {
  const params = await searchParams;
  const quick = params.quick === "1";

  return (
    <>
      <PageHeader
        title={quick ? "Quick entry" : "New journal entry"}
        description={
          quick
            ? "Low energy day? A few words is enough."
            : "Take your time — there is no right way to journal."
        }
      />
      <Card>
        <JournalForm action={createJournalEntry} quick={quick} />
      </Card>
    </>
  );
}
