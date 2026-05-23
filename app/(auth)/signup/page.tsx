import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { signUp } from "@/lib/actions/auth";

export default function SignUpPage() {
  return (
    <div className="space-y-4">
      <AuthForm action={signUp} mode="signup" />
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-sage hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
