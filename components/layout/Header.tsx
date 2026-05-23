import { getDailyAffirmation } from "@/lib/utils/affirmations";
import { greetingForHour } from "@/lib/utils/dates";

export function Header({ displayName }: { displayName: string }) {
  const greeting = greetingForHour();
  const affirmation = getDailyAffirmation();

  return (
    <header className="mb-6 space-y-1">
      <p className="text-sm text-muted">{affirmation}</p>
      <h1 className="text-2xl font-semibold text-foreground">
        {greeting}, {displayName}
      </h1>
    </header>
  );
}
