import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabase";
import BuildABearActivityTimeline from "./BuildABearActivityTimeline";
import BuildABearJobSchedule from "./BuildABearJobSchedule";

type RequestItem = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  service: string;
  address: string;
  message: string;
  status: string;
  next_step: string;
  internal_notes: string;
};

type Props = {
  livePageSlug: string;
  openRequestId?: string;
};

const statuses = [
  ["new", "New"],
  ["contacted", "Contacted"],
  ["scheduled", "Scheduled"],
  ["in_progress", "In Progress"],
  ["done", "Done"],
] as const;

export default function BuildABearRequestsPanel({ livePageSlug, openRequestId }: Props) {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Record<string, { job_date: string; job_time: string }>
  >({});
  const [state, setState] = useState<
    "setup" | "access" | "loading" | "ready" | "error"
  >("setup");
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveNote, setSaveNote] = useState("");
  const [editStatus, setEditStatus] = useState("new");
  const [nextStep, setNextStep] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let cancelled = false;
    setRequests([]);
    setSelectedId("");
    setToken("");
    setSaveError("");
    setSaveNote("");

    if (!livePageSlug) {
      setState("setup");
      return;
    }

    setState("loading");

    async function load() {
      try {
        let savedToken = "";

        try {
          savedToken =
            window.localStorage
              .getItem(`hp-starter-admin:${livePageSlug}`)
              ?.trim() || "";
        } catch {
          // Account recovery may still work without browser storage.
        }

        if (!savedToken) {
          const { data, error } = await getSupabase().rpc(
            "get_homeplanet_owner_live_page_token",
            { p_live_page_slug: livePageSlug }
          );

          if (cancelled) return;

          if (error || typeof data !== "string" || !data.trim()) {
            setState("access");
            return;
          }

          savedToken = data.trim();

          try {
            window.localStorage.setItem(
              `hp-starter-admin:${livePageSlug}`,
              savedToken
            );
          } catch {
            // Continue using recovered access for this session.
          }
        }

        const { data, error } = await getSupabase().rpc(
          "get_starter_requests",
          {
            p_live_page_slug: livePageSlug,
            p_admin_access_token: savedToken,
          }
        );

        if (cancelled) return;

        if (error) {
          setState("error");
          return;
        }

        setToken(savedToken);
        setRequests((data ?? []) as RequestItem[]);
        setSelectedId("");
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [livePageSlug]);

  useEffect(() => {
    if (
      openRequestId &&
      state === "ready" &&
      requests.some((item) => item.id === openRequestId)
    ) {
      setSelectedId(openRequestId);
    }
  }, [openRequestId, requests, state]);
  useEffect(() => {
    let cancelled = false;

    async function loadAppointments() {
      if (state !== "ready" || !token) {
        setUpcomingAppointments({});
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
        if (cancelled) return;

        const appointments: Record<
          string,
          { job_date: string; job_time: string }
        > = {};

        for (const job of data ?? []) {
          appointments[job.request_id] = {
            job_date: job.job_date,
            job_time: job.job_time,
          };
        }

        setUpcomingAppointments(appointments);
      } catch {
        if (!cancelled) setUpcomingAppointments({});
      }
    }

    void loadAppointments();

    return () => {
      cancelled = true;
    };
  }, [livePageSlug, token, state]);
  const selected = requests.find((item) => item.id === selectedId);
  const newCount = requests.filter((item) => item.status === "new").length;

  useEffect(() => {
    setEditStatus(selected?.status || "new");
    setNextStep(selected?.next_step || "");
    setNotes(selected?.internal_notes || "");
    setSaveError("");
    setSaveNote("");
  }, [selected]);

  const [jobAddress, setJobAddress] = useState("");
  const [savedJobAddress, setSavedJobAddress] = useState("");
  const [jobAddressLoading, setJobAddressLoading] = useState(false);
  const [jobAddressSaving, setJobAddressSaving] = useState(false);
  const [jobAddressError, setJobAddressError] = useState("");
  const [jobAddressNote, setJobAddressNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    setJobAddress("");
    setSavedJobAddress("");
    setJobAddressError("");
    setJobAddressNote("");

    if (!selectedId || !token) {
      setJobAddressLoading(false);
      return;
    }

    setJobAddressLoading(true);

    async function loadJobAddress() {
      try {
        const { data, error } = await getSupabase().rpc(
          "get_starter_job_address",
          {
            p_live_page_slug: livePageSlug,
            p_admin_access_token: token,
            p_request_id: selectedId,
          }
        );

        if (cancelled) return;
        if (error) throw error;

        const address = typeof data === "string" ? data : "";
        setJobAddress(address);
        setSavedJobAddress(address);
      } catch {
        if (!cancelled) {
          setJobAddressError("Could not load the saved job address.");
        }
      } finally {
        if (!cancelled) setJobAddressLoading(false);
      }
    }

    void loadJobAddress();

    return () => {
      cancelled = true;
    };
  }, [selectedId, token, livePageSlug]);

  async function saveJobAddress() {
    if (!selectedId || !token || jobAddressSaving || jobAddressLoading) return;

    setJobAddressSaving(true);
    setJobAddressError("");
    setJobAddressNote("");

    try {
      const address = jobAddress.trim();

      const { error } = await getSupabase().rpc(
        "save_starter_job_address",
        {
          p_live_page_slug: livePageSlug,
          p_admin_access_token: token,
          p_request_id: selectedId,
          p_job_address: address,
        }
      );

      if (error) throw error;

      setJobAddress(address);
      setSavedJobAddress(address);
      setJobAddressNote("Job address saved.");
    } catch {
      setJobAddressError("Could not save the job address. Please try again.");
    } finally {
      setJobAddressSaving(false);
    }
  }
  const hasUnsavedChanges = Boolean(
    selected &&
    (
      editStatus !== (selected.status || "new") ||
      nextStep !== (selected.next_step || "") ||
      notes !== (selected.internal_notes || "")
    )
  );

  async function saveRequest() {
    if (!selected || !token || saving || !hasUnsavedChanges) return;
    setSaving(true);
    setSaveError("");
    setSaveNote("");

    try {
      const { error } = await getSupabase().rpc(
        "update_starter_request",
        {
          p_live_page_slug: livePageSlug,
          p_admin_access_token: token,
          p_request_id: selected.id,
          p_status: editStatus,
          p_next_step: nextStep,
          p_internal_notes: notes,
        }
      );

      if (error) throw error;

      setRequests((current) =>
        current.map((item) =>
          item.id === selected.id
            ? {
                ...item,
                status: editStatus,
                next_step: nextStep,
                internal_notes: notes,
              }
            : item
        )
      );
      setSaveNote("Changes saved.");
    } catch {
      setSaveError("Changes could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const messageStyle = "text-sm text-[#64776B]";

  if (state === "setup")
    return <p className={messageStyle}>Set up your Live Page before receiving customer requests.</p>;

  if (state === "access")
    return <p className={messageStyle}>Owner access is required to view private customer requests.</p>;

  if (state === "loading")
    return <p className={messageStyle}>Checking customer requests...</p>;

  if (state === "error")
    return <p className="text-sm text-[#9A4B37]">Requests could not be verified or loaded. Check owner access.</p>;

  return (
    <div className="mt-3 space-y-4">
      <div>
        <p className="font-black text-[#193C2B]">
          {newCount} new {newCount === 1 ? "request" : "requests"}
        </p>
        <p className={messageStyle}>
          {requests.length} total customer {requests.length === 1 ? "request" : "requests"}
        </p>
      </div>

      {requests.length === 0 ? (
        <p className={messageStyle}>No customer requests yet.</p>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            {requests.map((request) => (
              <button
                key={request.id}
                type="button"
                disabled={saving}
                onClick={() => setSelectedId((current) => current === request.id ? "" : request.id)}
                aria-expanded={request.id === selectedId}
                className={`w-full rounded-xl border p-3 text-left ${
                  request.id === selectedId
                    ? "border-[#267344] bg-[#EFF7EF]"
                    : "border-[#DCE5DA] bg-white"
                }`}
              >
                <span className="block font-bold text-[#193C2B]">
                  {request.customer_name || "Customer"}
                </span>
                <span className={messageStyle}>
                  {request.service || "General request"}  |  {
                    statuses.find(([value]) => value === request.status)?.[1]
                    || request.status || "New"
                  }
                </span>
                {upcomingAppointments[request.id] && (
                  <span className="mt-2 block text-sm font-semibold text-[#267344]">
                    {"Scheduled:"} {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(new Date(
                      ...upcomingAppointments[request.id].job_date
                        .split("-")
                        .map(Number)
                        .map((value, index) => index === 1 ? value - 1 : value)
                        .concat(
                          upcomingAppointments[request.id].job_time
                            .split(":")
                            .slice(0, 2)
                            .map(Number)
                        ) as [number, number, number, number, number]
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>

          {selected && (
            <div className="space-y-4 rounded-2xl border border-[#DCE5DA] bg-[#FAFBF8] p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-lg font-black text-[#193C2B]">
                  {selected.customer_name || "Customer request"}
                </h4>
                <button
                  type="button"
                  onClick={() => setSelectedId("")}
                  disabled={saving}
                  className="rounded-lg border border-[#DCE5DA] px-3 py-2 text-sm font-bold text-[#193C2B] hover:bg-[#EFF7EF] disabled:opacity-50"
                  aria-label="Close customer request details"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2 text-sm text-[#33483B]">
                {selected.phone && (
                  <div className="space-y-3">
                    <p><strong>Phone:</strong> {selected.phone}</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`tel:${selected.phone.replace(/[^\d+]/g, "")}`}
                        className="inline-flex items-center justify-center rounded-xl bg-[#193C2B] px-4 py-3 text-sm font-bold text-white hover:bg-[#267344]"
                      >
                        Call Customer
                      </a>
                      <a
                        href={`sms:${selected.phone.replace(/[^\d+]/g, "")}`}
                        className="inline-flex items-center justify-center rounded-xl border border-[#193C2B] bg-white px-4 py-3 text-sm font-bold text-[#193C2B] hover:bg-[#EFF7EF]"
                      >
                        Send Text
                      </a>
                    </div>
                  </div>
                )}
                {selected.service && <p><strong>Service:</strong> {selected.service}</p>}
                {selected.address && <p><strong>Address:</strong> {selected.address}</p>}
                {selected.message && (
                  <p className="whitespace-pre-wrap">
                    <strong>Customer message:</strong> {selected.message}
                  </p>
                )}
                {selected.created_at && (
                  <p className={messageStyle}>
                    Received: {new Date(selected.created_at).toLocaleString()}
                  </p>
                )}
              </div>

              <section className="rounded-2xl border border-[#C9DDCE] bg-white p-4">
                <h5 className="font-black text-[#193C2B]">Job Location</h5>
                <p className="mt-1 text-sm text-[#526658]">
                  {savedJobAddress || selected.address || "No job address provided yet."}
                </p>

                <div className="mt-4 space-y-3">
                  <label htmlFor="job-address" className="block text-sm font-bold text-[#193C2B]">
                    Confirmed Job Address
                  </label>
                  <textarea
                    id="job-address"
                    value={jobAddress}
                    onChange={(event) => {
                      setJobAddress(event.target.value);
                      setJobAddressNote("");
                    }}
                    disabled={jobAddressLoading || jobAddressSaving}
                    maxLength={500}
                    rows={2}
                    placeholder="Street address, city, state, ZIP"
                    className="w-full rounded-xl border border-[#DCE5DA] bg-white p-3 text-sm text-[#193C2B]"
                  />
                  <button
                    type="button"
                    disabled={
                      jobAddressLoading ||
                      jobAddressSaving ||
                      jobAddress.trim() === savedJobAddress
                    }
                    onClick={() => void saveJobAddress()}
                    className="rounded-xl bg-[#193C2B] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {jobAddressSaving ? "Saving..." : "Save Job Address"}
                  </button>
                  {jobAddressLoading && <p className="text-sm text-[#64776B]">Loading saved address...</p>}
                  {jobAddressNote && <p className="text-sm text-[#267344]">{jobAddressNote}</p>}
                  {jobAddressError && <p className="text-sm text-[#9A4B37]">{jobAddressError}</p>}
                  <p className="text-xs text-[#64776B]">
                    The customer's originally submitted address stays unchanged.
                  </p>
                </div>
                {savedJobAddress &&
                /\b\d{1,6}\s+.+\b(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|court|ct|way|place|pl|circle|cir|parkway|pkwy)\b/i.test(savedJobAddress) &&
                savedJobAddress.includes(",") ? (
                  <div className="mt-3 space-y-3">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(savedJobAddress)}&travelmode=driving`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-[#193C2B] px-5 py-3 text-sm font-bold text-white hover:bg-[#267344]"
                    >
                      Get Directions
                    </a>
                    <div className="overflow-hidden rounded-xl border border-[#DCE5DA]">
                    <iframe
                      title={`Map for ${selected.customer_name || "customer"} job location`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(savedJobAddress)}&output=embed`}
                      className="h-64 w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 rounded-xl bg-[#F7F6F0] p-3 text-sm text-[#64776B]">
                    A complete street address, including the city, is needed
                    before showing the job location on a map.
                  </p>
                )}
              </section>
              <label className="block space-y-2">
                <span className="text-sm font-bold">Request status</span>
                <select
                  value={editStatus}
                  disabled={saving}
                  onChange={(event) => setEditStatus(event.target.value)}
                  className="w-full rounded-xl border border-[#DCE5DA] bg-white p-3"
                >
                  {statuses.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold">Next action</span>
                <textarea
                  value={nextStep}
                  disabled={saving}
                  onChange={(event) => setNextStep(event.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-[#DCE5DA] bg-white p-3"
                  placeholder="What needs to happen next?"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold">Private notes</span>
                <textarea
                  value={notes}
                  disabled={saving}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[#DCE5DA] bg-white p-3"
                  placeholder="Notes for your business only"
                />
              </label>

              <button
                type="button"
                disabled={saving || !hasUnsavedChanges}
                onClick={() => void saveRequest()}
                className="rounded-xl bg-[#193C2B] px-5 py-3 font-bold text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : hasUnsavedChanges ? "Save Changes" : "Saved"}
              </button>

              {saveNote && <p className="text-sm text-[#267344]">{saveNote}</p>}
              {saveError && <p className="text-sm text-[#9A4B37]">{saveError}</p>}
              <BuildABearJobSchedule
                key={`schedule:${selected.id}`}
                livePageSlug={livePageSlug}
                requestId={selected.id}
                token={token}
              />
              <BuildABearActivityTimeline
                key={selected.id}
                livePageSlug={livePageSlug}
                requestId={selected.id}
                token={token}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
