export const APP_NAME = "Health Journal";

export const AFFIRMATIONS = [
  "You are making progress, even on hard days.",
  "Small steps matter.",
  "One day at a time.",
  "Gentle progress is still progress.",
  "Showing up for yourself counts.",
  "Rest is part of healing.",
  "Your pace is enough.",
] as const;

export const JOURNAL_PROMPTS = [
  "What felt manageable today?",
  "One small win you noticed?",
  "Anything you want to remember for your care team?",
  "How did your body feel overall?",
] as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" as const },
  { href: "/journal", label: "Journal", icon: "BookOpen" as const },
  { href: "/trackers", label: "Trackers", icon: "Activity" as const },
  { href: "/reminders", label: "Reminders", icon: "Bell" as const },
  { href: "/tasks", label: "Care plan", icon: "ClipboardList" as const },
  { href: "/goals", label: "Goals", icon: "Target" as const },
  { href: "/calendar", label: "Calendar", icon: "Calendar" as const },
  { href: "/settings", label: "Settings", icon: "Settings" as const },
] as const;

export const MOBILE_NAV_ITEMS = [
  { href: "/dashboard", label: "Today", icon: "LayoutDashboard" as const },
  { href: "/journal", label: "Journal", icon: "BookOpen" as const },
  { href: "/trackers", label: "Trackers", icon: "Activity" as const },
  { href: "/reminders", label: "More", icon: "Menu" as const },
] as const;

export const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth/callback"] as const;
