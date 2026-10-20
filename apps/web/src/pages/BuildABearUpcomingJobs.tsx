import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabase";

type UpcomingJob = {
  request_id: string;
  customer_name: string;
  service: string;
  request_status: string;
  job_date: string;
  job_time: string;
  time_zone: string;
};

type Props = {
  livePageSlug: string;
  onOpenJob: (requestId: string) => void;
};

export default function BuildABearUpcomingJobs({
  livePageSlug,
  onOpenJob,
}: Props) {
  const [jobs, setJobs] = useState<UpcomingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);

      const token = localStorage.getItem(
        `hp-starter-admin:${livePageSlug}`
      );

      if (!token) {
        setJobs([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await getSupabase().rpc(
          "get_starter_upcoming_jobs",
          {
            p_live_page_slug: livePageSlug,
            p_admin_access_token: token,
          }
        );

        if (error) throw error;
        if (!cancelled) setJobs((data ?? []) as UpcomingJob[]);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [livePageSlug]);

  function formatDate(date: string, time: string) {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(year, month - 1, day, hour, minute));
  }

  return (
    <section className="mb-5 rounded-2xl border border-[#C9DDCE] bg-[#F7FAF6] p-4">
      <h3 className="text-lg font-black text-[#193C2B]">
        Upcoming Jobs
      </h3>

      {loading && (
        <p className="mt-3 text-sm text-[#64776B]">
          Loading appointments...
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-700">
          Could not load upcoming jobs.
        </p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <p className="mt-3 text-sm text-[#64776B]">
          No upcoming jobs scheduled.
        </p>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="mt-3 space-y-2">
          {jobs.map((job) => (
            <button
              key={job.request_id}
              type="button"
              onClick={() => onOpenJob(job.request_id)}
              className="w-full rounded-xl border border-[#DCE5DA] bg-white p-3 text-left hover:border-[#267344] hover:bg-[#EFF7EF]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-[#193C2B]">
                  {job.customer_name}
                </span>
                <span className="text-xs font-bold text-[#267344]">
                  Scheduled
                </span>
              </div>

              <p className="mt-1 text-sm text-[#64776B]">
                {job.service}
              </p>

              <p className="mt-2 text-sm font-semibold text-[#193C2B]">
                {formatDate(job.job_date, job.job_time)}
              </p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
