import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabase";
import BuildABearReminderHistory from "./BuildABearReminderHistory";

type Props = {
  livePageSlug: string;
  requestId: string;
  token: string;
};

type Appointment = {
  job_date: string;
  job_time: string;
  time_zone: string;
  remind_48h: boolean;
  remind_24h: boolean;
  remind_1h: boolean;
};

export default function BuildABearJobSchedule({
  livePageSlug,
  requestId,
  token,
}: Props) {
  const [jobDate, setJobDate] = useState("");
  const [jobTime, setJobTime] = useState("");
  const [remind48h, setRemind48h] = useState(false);
  const [remind24h, setRemind24h] = useState(true);
  const [remind1h, setRemind1h] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    setJobDate("");
    setJobTime("");
    setRemind48h(false);
    setRemind24h(true);
    setRemind1h(true);
    setSaved(false);
    setMessage("");
    setErrorMessage("");
    setLoading(true);

    async function load() {
      try {
        const { data, error } = await getSupabase().rpc(
          "get_starter_job_appointment",
          {
            p_live_page_slug: livePageSlug,
            p_admin_access_token: token,
            p_request_id: requestId,
          }
        );
        if (error) throw error;
        if (cancelled) return;

        const row = ((data ?? []) as Appointment[])[0];
        if (row) {
          setJobDate(row.job_date);
          setJobTime(row.job_time.slice(0, 5));
          setRemind48h(row.remind_48h);
          setRemind24h(row.remind_24h);
          setRemind1h(row.remind_1h);
          setSaved(true);
          setSavedSnapshot([row.job_date, row.job_time.slice(0, 5), row.remind_48h, row.remind_24h, row.remind_1h].join("|"));
        }
      } catch {
        if (!cancelled) setErrorMessage("Could not load the appointment.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [livePageSlug, requestId, token]);

  const currentSnapshot = [
    jobDate,
    jobTime,
    remind48h,
    remind24h,
    remind1h,
  ].join("|");

  const hasUnsavedChanges = !saved || currentSnapshot !== savedSnapshot;
  async function saveAppointment() {
    if (!jobDate || !jobTime || saving || loading || !token || !hasUnsavedChanges) return;

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const { error } = await getSupabase().rpc(
        "save_starter_job_appointment",
        {
          p_live_page_slug: livePageSlug,
          p_admin_access_token: token,
          p_request_id: requestId,
          p_job_date: jobDate,
          p_job_time: jobTime,
          p_time_zone: "America/New_York",
          p_remind_48h: remind48h,
          p_remind_24h: remind24h,
          p_remind_1h: remind1h,
        }
      );
      if (error) throw error;
      setSaved(true);
      setSavedSnapshot(currentSnapshot);
    } catch {
      setErrorMessage("Could not save appointment. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="rounded-2xl border border-[#C9DDCE] bg-white p-4">
      <summary className="cursor-pointer font-black text-[#193C2B]">
        Schedule Job {saved ? "(Scheduled)" : ""}
      </summary>

      <div className="mt-4 space-y-4">
        {loading && <p className="text-sm">Loading appointment...</p>}

        <label className="block space-y-2">
          <span className="text-sm font-bold">Job Date</span>
          <input
            type="date"
            value={jobDate}
            onChange={(event) => {
              setJobDate(event.target.value);
              setMessage("");
            }}
            disabled={loading || saving}
            className="w-full rounded-xl border border-[#DCE5DA] bg-white p-3"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-bold">Start Time</span>
          <input
            type="time"
            value={jobTime}
            onChange={(event) => {
              setJobTime(event.target.value);
              setMessage("");
            }}
            disabled={loading || saving}
            className="w-full rounded-xl border border-[#DCE5DA] bg-white p-3"
          />
        </label>

        <p className="text-xs text-[#64776B]">
          Times are currently set to Eastern Time (Okeechobee).
        </p>

        <fieldset className="space-y-3">
          <legend className="font-bold">Remind me before the job</legend>
          {[
            { label: "2 days before", checked: remind48h, set: setRemind48h },
            { label: "1 day before", checked: remind24h, set: setRemind24h },
            { label: "1 hour before", checked: remind1h, set: setRemind1h },
          ].map((option) => (
            <label key={option.label} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={option.checked}
                onChange={(event) => {
                  option.set(event.target.checked);
                  setMessage("");
                }}
                disabled={loading || saving}
              />
              {option.label}
            </label>
          ))}
        </fieldset>

        <p className="text-xs text-[#64776B]">
          Automatic email reminders are active. You can track their status in Reminder History.
        </p>

        <button
          type="button"
          disabled={loading || saving || !jobDate || !jobTime || !hasUnsavedChanges}
          onClick={() => void saveAppointment()}
          className="rounded-xl bg-[#193C2B] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : saved && !hasUnsavedChanges ? "Saved" : saved ? "Save Changes" : "Save Appointment"}
        </button>

        {message && <p className="text-sm text-[#267344]">{message}</p>}
        {errorMessage && <p className="text-sm text-[#9A4B37]">{errorMessage}</p>}
        <BuildABearReminderHistory
          livePageSlug={livePageSlug}
          requestId={requestId}
          token={token}
        />
      </div>
    </details>
  );
}
