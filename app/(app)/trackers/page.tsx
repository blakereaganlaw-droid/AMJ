import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

const sections = [
  { href: "/trackers/symptoms", title: "Symptoms", description: "Log and review how you are feeling.", color: "lavender" },
  { href: "/trackers/medications", title: "Medications", description: "Track what you have taken.", color: "sky" },
  { href: "/trackers/check-ins", title: "Check-ins", description: "Mood, energy, pain, and sleep.", color: "sage" },
] as const;

export default function TrackersPage() {
  return (
    <>
      <PageHeader
        title="Trackers"
        description="Simple tools to notice patterns without overwhelm."
      />
      <div className="grid gap-4 sm:grid-cols-1">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardTitle>{s.title}</CardTitle>
              <CardDescription>{s.description}</CardDescription>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
