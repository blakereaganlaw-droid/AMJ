"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ActionResult } from "@/lib/utils/action-result";

type AuthAction = (formData: FormData) => Promise<ActionResult>;

const initialState: ActionResult = { success: true };

export function AuthForm({
  action,
  mode,
  redirect,
}: {
  action: AuthAction;
  mode: "login" | "signup";
  redirect?: string;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => {
      const result = await action(formData);
      return result;
    },
    initialState
  );

  return (
    <Card>
      <h2 className="mb-6 text-xl font-semibold">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h2>
      <form action={formAction} className="space-y-4">
        {redirect && <input type="hidden" name="redirect" value={redirect} />}
        {mode === "signup" && (
          <Input label="Display name" name="display_name" type="text" autoComplete="name" />
        )}
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={8}
        />
        {!state.success && (
          <p className="text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Sign up"}
        </Button>
      </form>
    </Card>
  );
}
