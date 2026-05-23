export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ReminderRepeat = "none" | "daily" | "weekly" | "monthly";
export type ReminderCategory = "medication" | "appointment" | "general";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Profile {
  id: string;
  display_name: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  title: string | null;
  notes: string | null;
  symptoms_summary: string | null;
  medications_taken: string | null;
  hydration: number | null;
  sleep_hours: number | null;
  mood: number | null;
  energy: number | null;
  pain: number | null;
  wins: string | null;
  concerns: string | null;
  is_quick_entry: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Symptom {
  id: string;
  user_id: string;
  name: string;
  severity: number;
  body_area: string | null;
  category: string | null;
  notes: string | null;
  occurred_at: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  notes: string | null;
  taken_at: string;
  journal_entry_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_at: string;
  repeat_rule: ReminderRepeat;
  category: ReminderCategory;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  project_category: string | null;
  notes: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  progress: number;
  habit_frequency: string | null;
  is_completed: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckIn {
  id: string;
  user_id: string;
  check_in_date: string;
  mood: number | null;
  energy: number | null;
  pain: number | null;
  sleep: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface JournalEntryTag {
  journal_entry_id: string;
  tag_id: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> };
      journal_entries: { Row: JournalEntry; Insert: Omit<JournalEntry, "id" | "created_at" | "updated_at">; Update: Partial<JournalEntry> };
      symptoms: { Row: Symptom; Insert: Omit<Symptom, "id" | "created_at" | "updated_at">; Update: Partial<Symptom> };
      medications: { Row: Medication; Insert: Omit<Medication, "id" | "created_at" | "updated_at">; Update: Partial<Medication> };
      reminders: { Row: Reminder; Insert: Omit<Reminder, "id" | "created_at" | "updated_at">; Update: Partial<Reminder> };
      tasks: { Row: Task; Insert: Omit<Task, "id" | "created_at" | "updated_at">; Update: Partial<Task> };
      goals: { Row: Goal; Insert: Omit<Goal, "id" | "created_at" | "updated_at">; Update: Partial<Goal> };
      check_ins: { Row: CheckIn; Insert: Omit<CheckIn, "id" | "created_at" | "updated_at">; Update: Partial<CheckIn> };
      tags: { Row: Tag; Insert: Omit<Tag, "id" | "created_at">; Update: Partial<Tag> };
      journal_entry_tags: { Row: JournalEntryTag; Insert: JournalEntryTag; Update: never };
    };
  };
}
