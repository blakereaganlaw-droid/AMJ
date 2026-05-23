import { requireUser, getProfile } from "@/lib/auth/get-user";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { updateProfile } from "@/lib/actions/profile";
import { signOut } from "@/lib/actions/auth";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export default async function SettingsPage() {
  const user = await requireUser();
  const profile = await getProfile();

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and account." />
      <Card className="mb-6">
        <form action={updateProfile} className="space-y-4">
          <Input
            label="Display name"
            name="display_name"
            defaultValue={profile?.display_name ?? ""}
            required
          />
          <Select
            label="Timezone"
            name="timezone"
            defaultValue={profile?.timezone ?? "UTC"}
            options={TIMEZONES.map((tz) => ({ value: tz, label: tz }))}
          />
          <Button type="submit">Save profile</Button>
        </form>
      </Card>
      <Card>
        <p className="text-sm text-muted mb-1">Email</p>
        <p className="font-medium">{user.email}</p>
        <p className="mt-4 text-xs text-muted">Email cannot be changed here.</p>
      </Card>
      <form action={signOut} className="mt-8">
        <Button type="submit" variant="secondary">
          Sign out
        </Button>
      </form>
    </>
  );
}
