import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/dates";
import { Suspense } from "react";
import { JournalFilters } from "@/components/journal/JournalFilters";

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; archived?: string; sort?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: params.sort === "asc" });

  if (params.archived === "true") {
    query = query.eq("is_archived", true);
  } else {
    query = query.eq("is_archived", false);
  }

  if (params.q) {
    query = query.or(`notes.ilike.%${params.q}%,title.ilike.%${params.q}%`);
  }

  const { data: entries } = await query;

  return (
    <>
      <PageHeader
        title="Journal"
        description="Your private space to reflect, track, and celebrate small wins."
        action={
          <div className="flex gap-2">
            <Link href="/journal/new?quick=1">
              <Button variant="secondary" size="sm">
                Quick entry
              </Button>
            </Link>
            <Link href="/journal/new">
              <Button size="sm">New entry</Button>
            </Link>
          </div>
        }
      />

      <Suspense fallback={<div className="mb-6 h-20 animate-pulse rounded-xl bg-cream" />}>
        <JournalFilters />
      </Suspense>

      {entries && entries.length > 0 ? (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link href={`/journal/${entry.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {entry.title || formatDate(entry.entry_date)}
                      </p>
                      <p className="mt-1 text-sm text-muted line-clamp-2">
                        {entry.notes || "No notes"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-xs text-muted">{formatDate(entry.entry_date)}</span>
                      {entry.is_quick_entry && <Badge variant="teal">Quick</Badge>}
                      {entry.mood != null && <Badge variant="lavender">Mood {entry.mood}</Badge>}
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Your journal is waiting"
          description="Small steps matter. Start with a quick note about today."
          action={
            <Link href="/journal/new">
              <Button>Write your first entry</Button>
            </Link>
          }
        />
      )}
    </>
  );
}
