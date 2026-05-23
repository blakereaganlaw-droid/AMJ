import { AppShell } from "@/components/layout/AppShell";
import { requireUser, getProfile } from "@/lib/auth/get-user";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  const profile = await getProfile();
  const displayName = profile?.display_name ?? "there";

  return <AppShell displayName={displayName}>{children}</AppShell>;
}
