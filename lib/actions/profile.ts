"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/get-user";
import { profileSchema } from "@/lib/validations/profile";
import { sanitizeShortText } from "@/lib/utils/sanitize";
import { fail } from "@/lib/utils/errors";

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name"),
    timezone: formData.get("timezone"),
  });

  if (!parsed.success) fail("Please check your profile fields.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: sanitizeShortText(parsed.data.display_name, 100),
      timezone: parsed.data.timezone,
    })
    .eq("id", user.id);

  if (error) fail(error.message);
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}
