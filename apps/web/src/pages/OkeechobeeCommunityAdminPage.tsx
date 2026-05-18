import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, RefreshCw, Users } from "lucide-react";
import { supabase } from "../lib/supabase";

type CommunityRequest = {
  id: string;
  name: string;
  type: string;
  message: string;
  status: string;
  created_at: string;
};

export default function OkeechobeeCommunityAdminPage() {
  const [requests, setRequests] = useState<CommunityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  async function loadRequests() {
    setLoading(true);

    const { data, error } = await supabase
      .from("okeechobee_community_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setNotice("Could not load requests. Check Supabase read policy.");
    } else {
      setRequests(data || []);
      setNotice("");
    }

    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("okeechobee_community_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      setNotice("Could not update status. Check Supabase update policy.");
      return;
    }

    setRequests((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-8 text-white">
      <section className="mx-auto max-w-4xl">
        <a
          href="/planet/okeechobee"
          className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to public page
        </a>

        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
                <Users className="h-4 w-4" />
                Okeechobee Community Intake
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight">
                Community Requests
              </h1>

              <p className="mt-2 text-neutral-400">
                New local needs, offers, and business support messages from the Okeechobee Together page.
              </p>
            </div>

            <button
              onClick={loadRequests}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-bold text-black"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black p-4">
              <div className="text-2xl font-black">{requests.length}</div>
              <div className="text-sm text-neutral-500">Total submissions</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black p-4">
              <div className="text-2xl font-black">
                {requests.filter((item) => item.status === "new").length}
              </div>
              <div className="text-sm text-neutral-500">New</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black p-4">
              <div className="text-2xl font-black">
                {requests.filter((item) => item.status === "resolved").length}
              </div>
              <div className="text-sm text-neutral-500">Resolved</div>
            </div>
          </div>
        </div>

        {notice && (
          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
            {notice}
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 text-neutral-400">
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 text-neutral-400">
              No community requests yet.
            </div>
          ) : (
            requests.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-white/10 bg-neutral-900 p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
                        {item.type}
                      </span>

                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300">
                        {item.status || "new"}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-black">{item.name}</h2>

                    <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                      <Clock className="h-4 w-4" />
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(item.id, "contacted")}
                      className="rounded-xl border border-white/10 px-3 py-2 text-sm text-neutral-200"
                    >
                      Contacted
                    </button>

                    <button
                      onClick={() => updateStatus(item.id, "resolved")}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-400 px-3 py-2 text-sm font-bold text-black"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Resolved
                    </button>
                  </div>
                </div>

                <p className="mt-5 whitespace-pre-wrap rounded-2xl bg-black p-4 leading-7 text-neutral-200">
                  {item.message}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
