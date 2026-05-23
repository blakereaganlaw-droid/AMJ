import {
  Activity,
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Settings,
  Target,
} from "lucide-react";

const icons = {
  LayoutDashboard,
  BookOpen,
  Activity,
  Bell,
  ClipboardList,
  Target,
  Calendar,
  Settings,
  Menu,
} as const;

export function NavIcon({ name, className }: { name: keyof typeof icons; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} size={20} strokeWidth={1.75} aria-hidden />;
}
