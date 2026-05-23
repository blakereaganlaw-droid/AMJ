import { format, parseISO, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

export function formatDate(date: string | Date, pattern = "MMM d, yyyy") {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern);
}

export function formatDateTime(date: string | Date) {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy 'at' h:mm a");
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function todayStartISO() {
  return startOfDay(new Date()).toISOString();
}

export function todayEndISO() {
  return endOfDay(new Date()).toISOString();
}

export function monthRangeISO(year: number, month: number) {
  const date = new Date(year, month - 1, 1);
  return {
    start: startOfMonth(date).toISOString(),
    end: endOfMonth(date).toISOString(),
  };
}

export function greetingForHour(hour = new Date().getHours()) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
