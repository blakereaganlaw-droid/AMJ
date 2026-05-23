"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export function JournalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/journal?${params.toString()}`);
  }

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      <Input
        label="Search"
        placeholder="Search notes…"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => update("q", e.target.value)}
      />
      <Select
        label="Show"
        options={[
          { value: "", label: "Active" },
          { value: "true", label: "Archived" },
        ]}
        value={searchParams.get("archived") ?? ""}
        onChange={(e) => update("archived", e.target.value)}
      />
      <Select
        label="Sort"
        options={[
          { value: "", label: "Newest first" },
          { value: "asc", label: "Oldest first" },
        ]}
        value={searchParams.get("sort") ?? ""}
        onChange={(e) => update("sort", e.target.value)}
      />
    </div>
  );
}
