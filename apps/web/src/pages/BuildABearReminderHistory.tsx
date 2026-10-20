import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabase";

type Reminder = {
  reminder_minutes_before: number;
  due_at: string;
  status: string;
  attempted_at: string | null;
  accepted_at: string | null;
  attempt_count: number;
  appointment_is_current: boolean;
};

type Props = {
  livePageSlug: string;
  requestId: string;
  token: string;
};

const labels: Record<number, string> = {
  2880: "2 days before",
  1440: "1 day before",
  60: "1 hour before",
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function BuildABearReminderHistory({
  livePageSlug,
  requestId,
  token,
}: Props) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);
      setReminders([]);

      try {
        const { data, error } = await getSupabase().rpc(
          "get_starter_job_reminder_history",
          {
            p_live_page_slug: livePageSlug,
            p_admin_access_token: token,
            p_request_id: requestId,
          }
        );

        if (error) throw error;
        if (!cancelled) {
          setReminders((data ?? []) as Reminder[]);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (token && requestId) void load();
    else setLoading(false);

    return () => {
      cancelled = true;
    };
  }, [livePageSlug, requestId, token]);

  return (
    <details className="rounded-xl border border-[#DCE5DA] bg-[#FAFBF8] p-3">
      <summary className="cursor-pointer text-sm font-bold text-[#193C2B]">
        Reminder History
      </summary>

      <div className="mt-3 space-y-3">
        {loading && <p className="text-sm">Loading reminders...</p>}

        {error && (
          <p className="text-sm text-[#9A4B37]">
            Could not load reminder history.
          </p>
        )}

        {!loading && !error && reminders.length === 0 && (
          <p className="text-sm text-[#64776B]">
            No reminder records yet.
          </p>
        )}

        {!loading && !error && reminders.map((reminder, index) => {
          const status =
            reminder.status === "accepted"
              ? "Accepted by email provider"
              : reminder.status === "pending"
                ? "Pending"
                : reminder.status === "sending"
                  ? "Sending"
                  : reminder.status === "cancelled"
                    ? "Cancelled"
                    : "Failed";

          return (
            <div
              key={index}
              className="flex items-start justify-between gap-3 border-t border-[#DCE5DA] pt-3"
            >
              <div>
                <p className="text-sm font-bold text-[#193C2B]">
                  {labels[reminder.reminder_minutes_before] || "Reminder"}
                </p>
                <p className="text-xs text-[#64776B]">
                  {formatTime(reminder.due_at)} Eastern
                </p>
              </div>
              <span className="text-right text-xs font-bold text-[#267344]">
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </details>
  );
}
