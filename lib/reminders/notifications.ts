/**
 * Extension point for future email/push notification delivery.
 * v1 uses in-app reminders only (dashboard + reminders page).
 */

export type NotificationChannel = "email" | "push";

export interface ReminderNotificationPayload {
  reminderId: string;
  userId: string;
  title: string;
  dueAt: string;
}

export async function scheduleReminderNotification(
  payload: ReminderNotificationPayload,
  channels: NotificationChannel[] = []
): Promise<void> {
  void payload;
  void channels;
  // Future: integrate with Supabase Edge Functions, Resend, or push service
}

export async function cancelReminderNotification(reminderId: string): Promise<void> {
  void reminderId;
  // Future: cancel scheduled notification
}
