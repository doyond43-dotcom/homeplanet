import { useMemo, useState } from "react";

type Child = {
  id: string;
  name: string;
  dob: string;
  rental: boolean;
  firstTime: boolean;
};

type WaiverStatus = "not_started" | "link_sent" | "in_progress" | "signed";

type Family = {
  id: string;
  parentName: string;
  phone: string;
  children: Child[];
  waiverStatus: WaiverStatus;
  createdAt: number;
  waiverLinkToken: string | null;
};

function countRentals(children: Child[]) {
  return children.filter((child) => child.rental).length;
}

function countFirstTimers(children: Child[]) {
  return children.filter((child) => child.firstTime).length;
}

function waiverLabel(status: WaiverStatus) {
  if (status === "signed") return "✅ Waiver Signed";
  if (status === "in_progress") return "🟡 Waiver Open";
  if (status === "link_sent") return "📲 Link Sent";
  return "⚠️ Waiver Pending";
}

function waiverTone(status: WaiverStatus) {
  if (status === "signed") return "text-emerald-300";
  if (status === "in_progress") return "text-amber-300";
  if (status === "link_sent") return "text-sky-300";
  return "text-amber-300";
}

function createWaiverLink(token: string) {
  return `https://homeplanet.city/waiver/${token}`;
}

export default function SkateZoneDemo() {
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [children, setChildren] = useState<Child[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);

  const [waiverOpen, setWaiverOpen] = useState(false);
  const [linkSheetOpen, setLinkSheetOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [waiverAgree, setWaiverAgree] = useState(false);
  const [waiverSignature, setWaiverSignature] = useState("");
  const [completionNotice, setCompletionNotice] = useState("");

  function addChild() {
    setChildren((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        dob: "",
        rental: true,
        firstTime: false,
      },
    ]);
  }

  function updateChild(
    id: string,
    field: keyof Child,
    value: string | boolean
  ) {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id ? { ...child, [field]: value } : child
      )
    );
  }

  function handleSubmit() {
    const trimmedParentName = parentName.trim();
    const trimmedPhone = phone.trim();

    const cleanedChildren = children
      .map((child) => ({
        ...child,
        name: child.name.trim(),
        dob: child.dob.trim(),
      }))
      .filter((child) => child.name || child.dob);

    if (!trimmedParentName || cleanedChildren.length === 0) return;

    const newFamily: Family = {
      id: crypto.randomUUID(),
      parentName: trimmedParentName,
      phone: trimmedPhone,
      children: cleanedChildren,
      waiverStatus: "not_started",
      createdAt: Date.now(),
      waiverLinkToken: null,
    };

    const updatedFamilies = [newFamily, ...families];
    setFamilies(updatedFamilies);
    setSelectedFamily(newFamily);

    setParentName("");
    setPhone("");
    setChildren([]);
  }

  function updateFamily(familyId: string, updater: (family: Family) => Family) {
    let nextSelected: Family | null = null;

    setFamilies((prev) =>
      prev.map((family) => {
        const updatedFamily =
          family.id === familyId ? updater(family) : family;

        if (selectedFamily?.id === updatedFamily.id) {
          nextSelected = updatedFamily;
        }

        return updatedFamily;
      })
    );

    if (nextSelected) {
      setSelectedFamily(nextSelected);
    }
  }

  function sendWaiverLink() {
    if (!selectedFamily) return;

    const token = selectedFamily.waiverLinkToken ?? crypto.randomUUID();

    updateFamily(selectedFamily.id, (family) => ({
      ...family,
      waiverStatus: "link_sent",
      waiverLinkToken: token,
    }));

    setLinkCopied(false);
    setLinkSheetOpen(true);
  }

  function openWaiverFromLink() {
    if (!selectedFamily) return;

    updateFamily(selectedFamily.id, (family) => ({
      ...family,
      waiverStatus: "in_progress",
    }));

    setWaiverAgree(false);
    setWaiverSignature(selectedFamily.parentName);
    setLinkSheetOpen(false);
    setWaiverOpen(true);
  }

  function closeWaiverFlow() {
    setWaiverOpen(false);
    setWaiverAgree(false);
    setWaiverSignature("");
  }

  function saveAndCloseWaiver() {
    closeWaiverFlow();
  }

  function completeWaiverFlow() {
    if (!selectedFamily) return;
    if (!waiverAgree || !waiverSignature.trim()) return;

    updateFamily(selectedFamily.id, (family) => ({
      ...family,
      waiverStatus: "signed",
    }));

    setCompletionNotice(`Waiver completed for ${selectedFamily.parentName}`);
    closeWaiverFlow();

    window.setTimeout(() => {
      setCompletionNotice("");
    }, 2200);
  }

  async function copyLink() {
    if (!selectedFamily?.waiverLinkToken) return;

    const link = createWaiverLink(selectedFamily.waiverLinkToken);

    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);

      window.setTimeout(() => {
        setLinkCopied(false);
      }, 1600);
    } catch {
      setLinkCopied(false);
    }
  }

  const selectedSummary = useMemo(() => {
    if (!selectedFamily) return null;

    return {
      rentals: countRentals(selectedFamily.children),
      firstTimers: countFirstTimers(selectedFamily.children),
      skaters: selectedFamily.children.length,
      waiverLink: selectedFamily.waiverLinkToken
        ? createWaiverLink(selectedFamily.waiverLinkToken)
        : null,
    };
  }, [selectedFamily]);

  return (
    <div className="min-h-screen bg-[#020817] text-white p-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Skate Zone Check-In</h1>
        <div className="text-sm opacity-60">
          Live Family Intake • Waivers • Rentals
        </div>
      </div>

      {completionNotice ? (
        <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 shadow-[0_0_22px_rgba(16,185,129,0.18)]">
          ✅ {completionNotice}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-[#081129] p-4 space-y-4">
          <h2 className="text-2xl font-bold">Start Check-In</h2>

          <input
            placeholder="Parent Name"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full rounded-md border border-transparent bg-[#121b34] px-3 py-3 text-white placeholder:text-white/45 outline-none focus:border-blue-400"
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-transparent bg-[#121b34] px-3 py-3 text-white placeholder:text-white/45 outline-none focus:border-blue-400"
          />

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Kids</h3>

            {children.length === 0 ? (
              <div className="rounded-md border border-dashed border-white/10 bg-[#0b142d] px-3 py-4 text-sm opacity-50">
                No kids added yet
              </div>
            ) : (
              children.map((child, index) => (
                <div
                  key={child.id}
                  className="rounded-lg border border-white/5 bg-[#121b34] p-3 space-y-2"
                >
                  <div className="text-sm font-medium opacity-70">
                    Child {index + 1}
                  </div>

                  <input
                    placeholder="Child Name"
                    value={child.name}
                    onChange={(e) =>
                      updateChild(child.id, "name", e.target.value)
                    }
                    className="w-full rounded-md border border-transparent bg-[#020817] px-3 py-3 text-white placeholder:text-white/45 outline-none focus:border-blue-400"
                  />

                  <input
                    placeholder="DOB (MM-DD-YYYY)"
                    value={child.dob}
                    onChange={(e) =>
                      updateChild(child.id, "dob", e.target.value)
                    }
                    className="w-full rounded-md border border-transparent bg-[#020817] px-3 py-3 text-white placeholder:text-white/45 outline-none focus:border-blue-400"
                  />

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateChild(child.id, "rental", !child.rental)
                      }
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                        child.rental
                          ? "bg-green-600 text-white"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      🎿 Rental
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateChild(child.id, "firstTime", !child.firstTime)
                      }
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                        child.firstTime
                          ? "bg-yellow-500 text-black"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      🟡 First Time
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={addChild}
            className="w-full rounded-md bg-blue-600 px-3 py-3 font-medium transition hover:bg-blue-500"
          >
            + Add Child
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-md bg-green-600 px-3 py-3 font-bold transition hover:bg-green-500"
          >
            Start Check-In
          </button>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#081129] p-4 space-y-3">
          <h2 className="text-2xl font-bold">Live Families</h2>

          {families.length === 0 ? (
            <div className="text-sm opacity-40">No families checked in yet</div>
          ) : (
            families.map((family) => {
              const rentals = countRentals(family.children);
              const firstTimers = countFirstTimers(family.children);

              return (
                <button
                  key={family.id}
                  type="button"
                  onClick={() => setSelectedFamily(family)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    selectedFamily?.id === family.id
                      ? family.waiverStatus === "not_started"
                        ? "border-amber-400/60 bg-[#162241] shadow-[0_0_0_1px_rgba(251,191,36,0.12)]"
                        : family.waiverStatus === "link_sent"
                        ? "border-sky-400/70 bg-[#162241] shadow-[0_0_16px_rgba(56,189,248,0.10)]"
                        : family.waiverStatus === "in_progress"
                        ? "border-amber-400 bg-[#162241] shadow-[0_0_16px_rgba(251,191,36,0.12)]"
                        : "border-blue-400 bg-[#162241]"
                      : family.waiverStatus === "not_started"
                      ? "border-white/5 bg-[#121b34] hover:border-amber-400/50"
                      : family.waiverStatus === "link_sent"
                      ? "border-white/5 bg-[#121b34] hover:border-sky-400/60"
                      : family.waiverStatus === "in_progress"
                      ? "border-white/5 bg-[#121b34] hover:border-amber-400/70"
                      : "border-white/5 bg-[#121b34] hover:border-blue-400/60"
                  }`}
                >
                  <div className="text-lg font-bold">{family.parentName}</div>

                  <div className="mt-1 text-sm opacity-70">
                    {family.children.length} skaters • {rentals} rentals
                  </div>

                  {firstTimers > 0 ? (
                    <div className="mt-1 text-xs text-yellow-400">
                      {firstTimers} first-time skater
                      {firstTimers > 1 ? "s" : ""}
                    </div>
                  ) : null}

                  <div className={`mt-2 text-sm ${waiverTone(family.waiverStatus)}`}>
                    {waiverLabel(family.waiverStatus)}
                  </div>

                  {family.waiverStatus === "not_started" ? (
                    <div className="mt-1 text-xs text-white/40">
                      Tap to send waiver
                    </div>
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-[#081129] p-4">
          {selectedFamily ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedFamily.parentName}</h2>
                <div className="text-xs opacity-50">Checked in just now</div>
              </div>

              <div className="rounded-lg border border-white/5 bg-[#121b34] p-3">
                <div className="text-xs uppercase tracking-wide opacity-50">
                  Parent Contact
                </div>
                <div className="mt-1 text-sm">
                  {selectedFamily.phone || "No phone added"}
                </div>
              </div>

              <div className="rounded-lg border border-white/5 bg-[#121b34] p-3">
                <div className="text-xs uppercase tracking-wide opacity-50">
                  Kids
                </div>

                <div className="mt-2 space-y-2">
                  {selectedFamily.children.map((child) => (
                    <div
                      key={child.id}
                      className="rounded-md border border-white/5 bg-[#020817] px-3 py-3 text-sm"
                    >
                      <div className="font-medium">
                        {child.name || "Unnamed child"}
                      </div>
                      <div className="mt-0.5 opacity-60">
                        {child.dob || "DOB missing"}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {child.rental ? (
                          <span className="rounded-md bg-green-600/20 px-2 py-1 text-xs text-green-300">
                            🎿 Rental
                          </span>
                        ) : (
                          <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/60">
                            No rental
                          </span>
                        )}

                        {child.firstTime ? (
                          <span className="rounded-md bg-yellow-500/20 px-2 py-1 text-xs text-yellow-300">
                            🟡 First Time
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/5 bg-[#121b34] p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-70">Waiver Status</span>
                  <span className={waiverTone(selectedFamily.waiverStatus)}>
                    {selectedFamily.waiverStatus === "signed"
                      ? "✅ Signed"
                      : selectedFamily.waiverStatus === "in_progress"
                      ? "🟡 In Progress"
                      : selectedFamily.waiverStatus === "link_sent"
                      ? "📲 Link Sent"
                      : "⚠️ Pending"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-70">Rentals</span>
                  <span>{selectedSummary?.rentals ?? 0}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-70">First-Time Skaters</span>
                  <span>{selectedSummary?.firstTimers ?? 0}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-70">Skaters</span>
                  <span>{selectedSummary?.skaters ?? 0}</span>
                </div>
              </div>

              {selectedFamily.waiverStatus === "signed" ? (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-default rounded-md bg-emerald-700 px-3 py-3 font-bold text-white/95 shadow-[0_0_24px_rgba(16,185,129,0.18)]"
                >
                  ✅ Waiver Signed
                </button>
              ) : selectedFamily.waiverStatus === "in_progress" ? (
                <button
                  type="button"
                  onClick={() => setWaiverOpen(true)}
                  className="w-full rounded-md bg-amber-500 px-3 py-3 font-bold text-black transition hover:bg-amber-400"
                >
                  Continue Waiver
                </button>
              ) : selectedFamily.waiverStatus === "link_sent" ? (
                <button
                  type="button"
                  onClick={() => setLinkSheetOpen(true)}
                  className="w-full rounded-md bg-sky-600 px-3 py-3 font-bold text-white transition hover:bg-sky-500"
                >
                  View Waiver Link
                </button>
              ) : (
                <button
                  type="button"
                  onClick={sendWaiverLink}
                  className="w-full rounded-md bg-green-600 px-3 py-3 font-bold transition hover:bg-green-500"
                >
                  Send Waiver Link
                </button>
              )}

              {selectedSummary?.waiverLink ? (
                <div className="rounded-lg border border-sky-400/20 bg-sky-500/10 p-3">
                  <div className="text-xs uppercase tracking-wide text-sky-300/80">
                    Active Waiver Link
                  </div>
                  <div className="mt-2 break-all text-xs text-sky-100/90">
                    {selectedSummary.waiverLink}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-sm opacity-50">Select a family</div>
          )}
        </div>
      </div>

      {linkSheetOpen && selectedFamily ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#081129] shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="text-2xl font-bold">Waiver Link Sent</h2>
                <div className="mt-1 text-sm opacity-60">
                  {selectedFamily.parentName} • {selectedFamily.phone || "No phone on file"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLinkSheetOpen(false)}
                className="rounded-md bg-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/15"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 p-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-4">
                  <div className="text-sm font-semibold text-sky-300">
                    Phone Delivery Preview
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    A waiver link has been prepared for this family. In the real
                    flow, this would be sent by text so the parent can complete
                    it on their own phone while the front desk keeps the family
                    visible on the live board.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4">
                  <div className="text-sm font-semibold">Waiver Link</div>
                  <div className="mt-3 rounded-lg border border-white/5 bg-[#020817] px-3 py-3 text-xs break-all text-white/85">
                    {selectedSummary?.waiverLink}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={copyLink}
                      className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
                    >
                      {linkCopied ? "Copied" : "Copy Link"}
                    </button>

                    <button
                      type="button"
                      onClick={openWaiverFromLink}
                      className="rounded-md bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-500"
                    >
                      Open Parent Waiver
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4">
                  <div className="text-xs uppercase tracking-wide opacity-50">
                    Board Status
                  </div>
                  <div className="mt-2 text-lg font-semibold text-sky-300">
                    📲 Link Sent
                  </div>
                  <div className="mt-2 text-sm opacity-70">
                    Staff can keep serving the line while the parent completes the
                    waiver from their device.
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Parent</span>
                    <span>{selectedFamily.parentName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Phone</span>
                    <span>{selectedFamily.phone || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Skaters</span>
                    <span>{selectedFamily.children.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Rentals</span>
                    <span>{countRentals(selectedFamily.children)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">First-Time Skaters</span>
                    <span>{countFirstTimers(selectedFamily.children)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {waiverOpen && selectedFamily ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#081129] shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="text-2xl font-bold">Family Waiver</h2>
                <div className="mt-1 text-sm opacity-60">
                  {selectedFamily.parentName} • {selectedFamily.children.length} skater
                  {selectedFamily.children.length > 1 ? "s" : ""}
                </div>
              </div>

              <button
                type="button"
                onClick={closeWaiverFlow}
                className="rounded-md bg-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/15"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 p-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4">
                  <div className="text-sm font-semibold text-amber-300">
                    Waiver Preview
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    This family is checking in for skating activities that may
                    include public skating, classes, parties, rentals, and
                    first-time skaters on the ice. The parent or guardian
                    acknowledges the ordinary risks of participation, agrees to
                    rink safety expectations, and confirms responsibility for the
                    children listed in this check-in.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4">
                  <div className="text-sm font-semibold">Covered Skaters</div>

                  <div className="mt-3 space-y-2">
                    {selectedFamily.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between rounded-lg border border-white/5 bg-[#020817] px-3 py-3 text-sm"
                      >
                        <div>
                          <div className="font-medium">{child.name || "Unnamed child"}</div>
                          <div className="opacity-60">{child.dob || "DOB missing"}</div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-2">
                          {child.rental ? (
                            <span className="rounded-md bg-green-600/20 px-2 py-1 text-xs text-green-300">
                              🎿 Rental
                            </span>
                          ) : null}

                          {child.firstTime ? (
                            <span className="rounded-md bg-yellow-500/20 px-2 py-1 text-xs text-yellow-300">
                              🟡 First Time
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={waiverAgree}
                      onChange={(e) => setWaiverAgree(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-[#020817]"
                    />
                    <span className="text-sm leading-6 text-white/85">
                      I confirm that I am the parent or guardian for the children
                      listed above, I understand the risks of participation, and
                      I agree to the rink waiver for this family check-in.
                    </span>
                  </label>

                  <div className="mt-4">
                    <div className="mb-2 text-sm font-medium">
                      Parent Signature
                    </div>
                    <input
                      value={waiverSignature}
                      onChange={(e) => setWaiverSignature(e.target.value)}
                      placeholder="Type full name to sign"
                      className="w-full rounded-md border border-transparent bg-[#020817] px-3 py-3 text-white placeholder:text-white/40 outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4">
                  <div className="text-xs uppercase tracking-wide opacity-50">
                    Waiver Status
                  </div>
                  <div className="mt-2 text-lg font-semibold text-amber-300">
                    🟡 In Progress
                  </div>
                  <div className="mt-2 text-sm opacity-70">
                    The family stays visible on the live board while the waiver is
                    being completed.
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Parent</span>
                    <span>{selectedFamily.parentName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Phone</span>
                    <span>{selectedFamily.phone || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Skaters</span>
                    <span>{selectedFamily.children.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Rentals</span>
                    <span>{countRentals(selectedFamily.children)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">First-Time Skaters</span>
                    <span>{countFirstTimers(selectedFamily.children)}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4 space-y-3">
                  <button
                    type="button"
                    onClick={completeWaiverFlow}
                    disabled={!waiverAgree || !waiverSignature.trim()}
                    className={`w-full rounded-md px-3 py-3 font-bold transition ${
                      waiverAgree && waiverSignature.trim()
                        ? "bg-green-600 hover:bg-green-500"
                        : "cursor-not-allowed bg-white/10 text-white/40"
                    }`}
                  >
                    Complete Waiver
                  </button>

                  <button
                    type="button"
                    onClick={saveAndCloseWaiver}
                    className="w-full rounded-md bg-white/10 px-3 py-3 font-medium text-white/85 transition hover:bg-white/15"
                  >
                    Save and Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}