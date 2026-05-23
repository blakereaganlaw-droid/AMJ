import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { signIn } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-4">
      <AuthForm action={signIn} mode="login" redirect={params.redirect} />
      {params.error && (
        <p className="text-center text-sm text-red-600">Sign in failed. Please try again.</p>
      )}
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-medium text-sage hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
