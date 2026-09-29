import {
  ArrowLeft,
  Check,
  CircleDot,
  Globe2,
  Layers3,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { buildMySystemModules } from "../lib/homePlanetRegistry";
import { getSupabase } from "../lib/supabase";

type StoredSystem = {
  businessName?: string;
  businessType?: string;
  pillar?: string;
  selectedModules?: string[];
  livePageSlug?: string;
};

type StarterPageIdentity = {
  name?: string;
  service?: string;
  city?: string;
  phone?: string;
};

type StarterRequest = {
  id: string;
  created_at: string;
  live_page_slug: string;
  business_name: string;
  customer_name: string;
  phone: string;
  service: string;
  address: string;
  message: string;
  status: string;
  next_step: string;
  internal_notes: string;
  updated_at: string;
};

const categoryLabels: Record<string, string> = {
  "front-door": "Front Door",
  "customer-flow": "Customer Flow",
  operations: "Operations",
  money: "Money",
  communication: "Communication",
  proof: "Proof",
  intelligence: "Intelligence",
  physical: "Physical Connection",
  automation: "Automation",
};

export default function SystemHomePage() {
  const { slug = "" } = useParams();

  const system = useMemo<StoredSystem>(() => {
    try {
      const raw = localStorage.getItem(`hp-system:${slug}`);

      if (!raw) {
        return {};
      }

      return JSON.parse(raw) as StoredSystem;
    } catch {
      return {};
    }
  }, [slug]);

  const selectedIds = system.selectedModules ?? [];
  const livePageSlug = system.livePageSlug?.trim() || "";

  const [starterIdentity, setStarterIdentity] =
    useState<StarterPageIdentity | null>(null);

  const businessName =
    starterIdentity?.name?.trim() ||
    system.businessName?.trim() ||
    "Your HomePlanet System";

  const businessType =
    starterIdentity?.service?.trim() ||
    system.businessType?.trim() ||
    "Business";

  const [searchParams] = useSearchParams();
  const requestSlug = livePageSlug || slug;
  const accessFromUrl = searchParams.get("access")?.trim() || "";

  const [adminAccessToken] = useState(() => {
    if (!requestSlug) return accessFromUrl;

    const storageKey = `hp-starter-admin:${requestSlug}`;

    try {
      if (accessFromUrl) {
        window.localStorage.setItem(storageKey, accessFromUrl);
        return accessFromUrl;
      }

      return window.localStorage.getItem(storageKey)?.trim() || "";
    } catch {
      return accessFromUrl;
    }
  });

  useEffect(() => {
    if (!accessFromUrl) return;

    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("access");

    window.history.replaceState(
      {},
      "",
      `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`
    );
  }, [accessFromUrl]);

  const [starterRequests, setStarterRequests] = useState<StarterRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [requestSaving, setRequestSaving] = useState(false);
  const [requestSaveNote, setRequestSaveNote] = useState("");

  const selectedModules = buildMySystemModules.filter((module) =>
    selectedIds.includes(module.id)
  );

  const groupedModules = selectedModules.reduce<
    Record<string, typeof selectedModules>
  >((groups, module) => {
    const category = module.category;

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(module);
    return groups;
  }, {});

  useEffect(() => {
    let cancelled = false;

    async function loadStarterIdentity() {
      if (!requestSlug) {
        setStarterIdentity(null);
        return;
      }

      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("starter_live_pages")
        .select("page_data")
        .eq("slug", requestSlug)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("[starter_live_pages] identity load error:", error);
        return;
      }

      const pageData =
        data?.page_data && typeof data.page_data === "object"
          ? (data.page_data as StarterPageIdentity)
          : null;

      setStarterIdentity(pageData);
    }

    void loadStarterIdentity();

    return () => {
      cancelled = true;
    };
  }, [requestSlug]);

  const selectedRequest = useMemo(
    () =>
      starterRequests.find((request) => request.id === selectedRequestId) ??
      starterRequests[0] ??
      null,
    [starterRequests, selectedRequestId]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadStarterRequests() {
      if (!requestSlug || !adminAccessToken) {
        setStarterRequests([]);
        setSelectedRequestId("");
        return;
      }

      setRequestsLoading(true);
      setRequestsError("");

      const supabase = getSupabase();

      const { data, error } = await supabase.rpc("get_starter_requests", {
        p_live_page_slug: requestSlug,
        p_admin_access_token: adminAccessToken,
      });

      if (cancelled) return;

      if (error) {
        console.error("[starter_requests] load error:", error);
        setRequestsError("Requests could not be loaded.");
        setRequestsLoading(false);
        return;
      }

      const nextRequests = (data ?? []) as StarterRequest[];

      setStarterRequests(nextRequests);
      setSelectedRequestId((current) =>
        current && nextRequests.some((request) => request.id === current)
          ? current
          : nextRequests[0]?.id ?? ""
      );
      setRequestsLoading(false);
    }

    void loadStarterRequests();

    return () => {
      cancelled = true;
    };
  }, [requestSlug, adminAccessToken]);

  function updateSelectedRequest(
    field: "status" | "next_step" | "internal_notes",
    value: string
  ) {
    if (!selectedRequest) return;

    setRequestSaveNote("");

    setStarterRequests((current) =>
      current.map((request) =>
        request.id === selectedRequest.id
          ? { ...request, [field]: value }
          : request
      )
    );
  }

  async function saveSelectedRequest() {
    if (!selectedRequest || !requestSlug || !adminAccessToken) return;

    setRequestSaving(true);
    setRequestSaveNote("");

    const supabase = getSupabase();

    const { error } = await supabase.rpc("update_starter_request", {
      p_live_page_slug: requestSlug,
      p_admin_access_token: adminAccessToken,
      p_request_id: selectedRequest.id,
      p_status: selectedRequest.status,
      p_next_step: selectedRequest.next_step,
      p_internal_notes: selectedRequest.internal_notes,
    });

    if (error) {
      console.error("[starter_requests] save error:", error);
      setRequestSaveNote("Could not save changes.");
      setRequestSaving(false);
      return;
    }

    const updatedAt = new Date().toISOString();

    setStarterRequests((current) =>
      current.map((request) =>
        request.id === selectedRequest.id
          ? { ...request, updated_at: updatedAt }
          : request
      )
    );

    setRequestSaveNote("Saved");
    setRequestSaving(false);
  }

  const requestPhoneHref = selectedRequest?.phone
    ? `tel:${selectedRequest.phone}`
    : undefined;

  const requestTextHref = selectedRequest?.phone
    ? `sms:${selectedRequest.phone}`
    : undefined;

  const requestNavigateHref = selectedRequest?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        selectedRequest.address
      )}`
    : undefined;

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <section className="mx-auto max-w-6xl px-5 py-6 sm:px-7">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur-xl">
          <Link
            to="/planet/home"
            className="flex items-center gap-3"
          >
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400 text-black">
              <Globe2 size={21} />
            </div>

            <div>
              <p className="text-sm font-black tracking-wide">
                HomePlanet
              </p>

              <p className="text-[11px] text-white/50">
                System Workspace
              </p>
            </div>
          </Link>

          <Link
            to={`/planet/creator/starter?system=${encodeURIComponent(slug)}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-white/70 transition hover:bg-white/[0.09] hover:text-white"
          >
            Edit Live Page
          </Link>
        </header>

        <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-gradient-to-br from-emerald-300/[0.09] via-white/[0.035] to-transparent p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-[90px]" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              <Check size={14} />
              HomePlanet System
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              {businessName}
            </h1>

            <p className="mt-4 text-lg font-bold text-white/65">
              {businessType}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-black text-white/75">
                <Layers3 size={15} className="text-emerald-300" />
                {starterIdentity
                  ? "Live Page connected"
                  : `${selectedModules.length} connected piece${
                      selectedModules.length === 1 ? "" : "s"
                    }`}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-black text-white/75">
                <CircleDot size={15} className="text-emerald-300" />
                System active
              </div>
            </div>
          </div>
        </section>

        {requestSlug && adminAccessToken ? (
          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
                  Live Work
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  Customer Requests
                </h2>
              </div>

              {starterRequests.length > 0 ? (
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-white/60">
                  {starterRequests.length} request
                  {starterRequests.length === 1 ? "" : "s"}
                </div>
              ) : null}
            </div>

            {requestsLoading ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 text-sm font-bold text-white/50">
                Loading requests...
              </div>
            ) : requestsError ? (
              <div className="rounded-[2rem] border border-red-400/20 bg-red-400/[0.06] p-6 text-sm font-bold text-red-200">
                {requestsError}
              </div>
            ) : starterRequests.length === 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
                <p className="text-lg font-black">No customer requests yet.</p>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  New Live Page requests will show up here automatically.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
                <div className="space-y-2">
                  {starterRequests.map((request) => {
                    const active = request.id === selectedRequest?.id;
                    const statusKey = request.status || "new";

                    const statusLabel =
                      statusKey === "contacted"
                        ? "Contacted"
                        : statusKey === "scheduled"
                          ? "Scheduled"
                          : statusKey === "in_progress"
                            ? "In Progress"
                            : statusKey === "done"
                              ? "Done"
                              : "New";

                    const statusStyle =
                      statusKey === "contacted"
                        ? {
                            borderColor: "rgba(56, 189, 248, 0.60)",
                            backgroundColor: "rgba(56, 189, 248, 0.14)",
                          }
                        : statusKey === "scheduled"
                          ? {
                              borderColor: "rgba(251, 191, 36, 0.65)",
                              backgroundColor: "rgba(251, 191, 36, 0.14)",
                            }
                          : statusKey === "in_progress"
                            ? {
                                borderColor: "rgba(52, 211, 153, 0.65)",
                                backgroundColor: "rgba(52, 211, 153, 0.15)",
                              }
                            : statusKey === "done"
                              ? {
                                  borderColor: "rgba(255, 255, 255, 0.16)",
                                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                                }
                              : {
                                  borderColor: "rgba(167, 139, 250, 0.65)",
                                  backgroundColor: "rgba(167, 139, 250, 0.14)",
                                };

                    const badgeClasses =
                      statusKey === "contacted"
                        ? "bg-sky-400/15 text-sky-200"
                        : statusKey === "scheduled"
                          ? "bg-amber-300/15 text-amber-200"
                          : statusKey === "in_progress"
                            ? "bg-emerald-300/15 text-emerald-200"
                            : statusKey === "done"
                              ? "bg-white/[0.07] text-white/45"
                              : "bg-violet-400/15 text-violet-200";

                    return (
                      <button
                        key={request.id}
                        type="button"
                        onClick={() => setSelectedRequestId(request.id)}
                        style={statusStyle}
                        className={`w-full rounded-[1.4rem] border p-4 text-left transition ${
                          active
                            ? "ring-1 ring-white/15"
                            : "hover:brightness-110"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-base font-black">
                              {request.customer_name || "Customer"}
                            </p>

                            <p className="mt-1 truncate text-sm text-white/55">
                              {request.service || "General request"} · {statusLabel}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${badgeClasses}`}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedRequest ? (
                  <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                          Work Drawer
                        </p>
                        <h3 className="mt-2 text-2xl font-black">
                          {selectedRequest.customer_name}
                        </h3>
                        {selectedRequest.phone ? (
                          <p className="mt-1 text-sm text-white/45">
                            {selectedRequest.phone}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {requestPhoneHref ? (
                          <a
                            href={requestPhoneHref}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-3 py-2 text-xs font-black text-black"
                          >
                            <Phone size={15} />
                            Call
                          </a>
                        ) : null}

                        {requestTextHref ? (
                          <a
                            href={requestTextHref}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black text-white"
                          >
                            <MessageCircle size={15} />
                            Text
                          </a>
                        ) : null}

                        {requestNavigateHref ? (
                          <a
                            href={requestNavigateHref}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black text-white"
                          >
                            <MapPin size={15} />
                            Navigate
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4">
                      <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                          Request
                        </p>

                        <p className="mt-2 text-base font-black">
                          {selectedRequest.service || "General request"}
                        </p>

                        {selectedRequest.address ? (
                          <p className="mt-2 text-sm leading-6 text-white/55">
                            {selectedRequest.address}
                          </p>
                        ) : null}

                        {selectedRequest.message ? (
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/65">
                            {selectedRequest.message}
                          </p>
                        ) : null}
                      </section>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                            Status
                          </span>

                          <select
                            value={selectedRequest.status || "new"}
                            onChange={(event) =>
                              updateSelectedRequest("status", event.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-white/10 bg-[#101213] px-3 py-3 text-sm font-bold text-white outline-none focus:border-emerald-300/50"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                            Next Step
                          </span>

                          <input
                            value={selectedRequest.next_step}
                            onChange={(event) =>
                              updateSelectedRequest(
                                "next_step",
                                event.target.value
                              )
                            }
                            placeholder="Call back, visit property, send price..."
                            className="mt-2 w-full rounded-xl border border-white/10 bg-[#101213] px-3 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-emerald-300/50"
                          />
                        </label>
                      </div>

                      <label className="block">
                        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                          Notes
                        </span>

                        <textarea
                          value={selectedRequest.internal_notes}
                          onChange={(event) =>
                            updateSelectedRequest(
                              "internal_notes",
                              event.target.value
                            )
                          }
                          placeholder="Private notes about this request..."
                          rows={4}
                          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#101213] px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-emerald-300/50"
                        />
                      </label>

                      <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                          Activity
                        </p>

                        <div className="mt-3 space-y-2 text-sm text-white/55">
                          <div className="flex items-center justify-between gap-4">
                            <span>Request received</span>
                            <span className="text-right text-white/35">
                              {new Date(
                                selectedRequest.created_at
                              ).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <span>Last updated</span>
                            <span className="text-right text-white/35">
                              {new Date(
                                selectedRequest.updated_at
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </section>

                      <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                        <span className="text-xs font-bold text-emerald-300">
                          {requestSaveNote}
                        </span>

                        <button
                          type="button"
                          onClick={() => void saveSelectedRequest()}
                          disabled={requestSaving}
                          className="rounded-xl bg-emerald-300 px-5 py-3 text-sm font-black text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {requestSaving ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  </article>
                ) : null}
              </div>
            )}
          </section>
        ) : null}

        {!starterIdentity ? (
          <>
        <div className="mt-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
            Your System
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Everything you chose, in one place.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            These are the pieces connected to {businessName}. As each piece
            becomes operational, this workspace becomes the place to open,
            manage, and expand it.
          </p>
        </div>

        {selectedModules.length > 0 ? (
          <div className="mt-8 space-y-8">
            {Object.entries(groupedModules).map(([category, modules]) => (
              <section key={category}>
                <div className="mb-3 flex items-center gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                    {categoryLabels[category] ?? category}
                  </p>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {modules.map((module) => (
                    <article
                      key={module.id}
                      className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-emerald-300/25 hover:bg-white/[0.055]"
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <h3 className="text-xl font-black">
                            {module.name}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-white/50">
                            {module.description}
                          </p>
                        </div>

                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-300 text-black">
                          <Check size={17} strokeWidth={3} />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                          Connected
                        </span>

                        {module.id === "live-page" ? (
  livePageSlug ? (
    <Link
      to={`/planet/starter/${livePageSlug}`}
      className="inline-flex items-center rounded-xl bg-emerald-300 px-3 py-2 text-xs font-black text-black transition hover:bg-emerald-200"
    >
      Open Live Page â†’
    </Link>
  ) : (
    <Link
      to={`/planet/creator/starter?system=${encodeURIComponent(slug)}`}
      className="inline-flex items-center rounded-xl bg-emerald-300 px-3 py-2 text-xs font-black text-black transition hover:bg-emerald-200"
    >
      Set Up Live Page â†’
    </Link>
  )
) : (
  <span className="text-xs font-bold text-white/35">
    Setup coming next
  </span>
)}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">
            <h3 className="text-2xl font-black">
              No system pieces found.
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Go back to Build My System and choose the pieces you want
              connected.
            </p>

            <Link
              to="/planet/build-your-live-system"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-black text-black"
            >
              Build My System
            </Link>
          </section>
        )}

          </>
        ) : null}
        {livePageSlug ? (
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
            <Link
              to={`/planet/starter/${livePageSlug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-black text-black transition hover:bg-emerald-200"
            >
              Open Live Page
            </Link>

            <Link
              to={`/planet/creator/starter?system=${encodeURIComponent(slug)}`}
              className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-black text-white/75 transition hover:bg-white/[0.09] hover:text-white"
            >
              Edit Live Page
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}


