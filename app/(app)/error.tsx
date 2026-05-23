"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="text-center">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted">
        Take a breath — your data is safe. Try refreshing this page.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </Card>
  );
}
