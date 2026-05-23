import { Header } from "@/components/layout/Header";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { getDashboardData } from "@/lib/queries/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <>
      <Header displayName={data.displayName} />
      <DashboardCards data={data} />
    </>
  );
}
