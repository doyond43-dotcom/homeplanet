import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabase";

type Activity = {
  id: string;
  activity_type: string;
  details: string;
  created_at: string;
};

type Props = {
  livePageSlug: string;
  requestId: string;
  token: string;
};

const activityLabels: Record<string, string> = {
  note: "Request Update",
  call: "Phone Call",
  text: "Text Message",
  follow_up: "Follow-Up",
};

export default function BuildABearActivityTimeline({
  livePageSlug,
  requestId,
  token,
}: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    setActivities([]);
    setLoading(true);
    setErrorMessage("");

    async function load() {
      try {
        const { data, error } = await getSupabase().rpc(
          "get_starter_request_activity",
          {
            p_live_page_slug: livePageSlug,
            p_admin_access_token: token,
            p_request_id: requestId,
          }
        );

        if (error) throw error;
        if (!cancelled) setActivities((data ?? []) as Activity[]);
      } catch {
        if (!cancelled) {
          setErrorMessage("Could not load customer history.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [livePageSlug, requestId, token]);

  return (
    <details className="rounded-2xl border border-[#C9DDCE] bg-white p-4">
      <summary className="cursor-pointer font-black text-[#193C2B]">
        Customer History
      </summary>

      <div className="mt-4 space-y-3">
        <p className="text-sm text-[#64776B]">
          Changes to request status, next action, and private notes
          are recorded when you click Save Request.
        </p>

        {loading ? (
          <p className="text-sm text-[#64776B]">
            Loading customer history...
          </p>
        ) : errorMessage ? (
          <p className="text-sm text-[#9A4B37]">
            {errorMessage}
          </p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-[#64776B]">
            No recorded activity yet.
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-xl border border-[#DCE5DA] p-3"
              >
                <p className="text-sm font-bold text-[#193C2B]">
                  {activityLabels[activity.activity_type] ||
                    activity.activity_type}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-[#33483B]">
                  {activity.details}
                </p>
                <p className="mt-2 text-xs text-[#64776B]">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}
