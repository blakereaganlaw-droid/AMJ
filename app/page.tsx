import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { APP_NAME } from "@/lib/constants/app";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <Logo className="mb-8 justify-center" />
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Your calm health companion
        </h1>
        <p className="mt-4 text-lg text-muted">
          {APP_NAME} helps you track symptoms, journal gently, manage reminders, and celebrate small wins — at your own pace.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Get started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Sign in
            </Button>
          </Link>
        </div>
        <p className="mt-12 text-sm text-muted italic">Gentle progress is still progress.</p>
      </div>
    </div>
  );
}
