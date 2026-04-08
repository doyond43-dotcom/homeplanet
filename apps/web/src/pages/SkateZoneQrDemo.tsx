 import { useEffect, useMemo, useState } from "react";

type Child = {
  id: string;
  name: string;
  dob: string;
  rental: boolean;
  firstTime: boolean;
};

type WaiverStatus = "not_started" | "qr_ready" | "scanned" | "signed";

type Family = {
  id: string;
  parentName: string;
  phone: string;
  children: Child[];
  waiverStatus: WaiverStatus;
  createdAt: number;
  waiverQrToken: string | null;
};

const STORAGE_KEY = "hp_skatezone_qr_demo_families";

function countRentals(children: Child[]) {
  return children.filter((child) => child.rental).length;
}

function countFirstTimers(children: Child[]) {
  return children.filter((child) => child.firstTime).length;
}

function waiverLabel(status: WaiverStatus) {
  if (status === "signed") return "✅ Waiver Signed";
  if (status === "scanned") return "📱 QR Scanned";
  if (status === "qr_ready") return "🔳 QR Ready";
  return "⚠️ Waiver Pending";
}

function waiverTone(status: WaiverStatus) {
  if (status === "signed") return "text-emerald-300";
  if (status === "scanned") return "text-sky-300";
  if (status === "qr_ready") return "text-violet-300";
  return "text-amber-300";
}

function createQrLink(token: string) {
  return `/planet/waiver/${token}`;
}

function loadFamilies(): Family[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFamilies(families: Family[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(families));
}

export default function SkateZoneQrDemo() {
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [children, setChildren] = useState<Child[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);

  const [qrSheetOpen, setQrSheetOpen] = useState(false);
  const [waiverOpen, setWaiverOpen] = useState(false);
  const [waiverAgree, setWaiverAgree] = useState(false);
  const [waiverSignature, setWaiverSignature] = useState("");
  const [completionNotice, setCompletionNotice] = useState("");

  useEffect(() => {
    const storedFamilies = loadFamilies();
    setFamilies(storedFamilies);
    if (storedFamilies.length > 0) {
      setSelectedFamily(storedFamilies[0]);
    }
  }, []);

  useEffect(() => {
    saveFamilies(families);
  }, [families]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      const nextFamilies = loadFamilies();
      setFamilies(nextFamilies);

      setSelectedFamily((current) => {
        if (!current) return nextFamilies[0] ?? null;
        return nextFamilies.find((family) => family.id === current.id) ?? current;
      });
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

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
      waiverQrToken: null,
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

  function prepareQrCode() {
    if (!selectedFamilyLive) return;

    const token = selectedFamilyLive.waiverQrToken ?? crypto.randomUUID();

    updateFamily(selectedFamilyLive.id, (family) => ({
      ...family,
      waiverStatus: "qr_ready",
      waiverQrToken: token,
    }));

    setQrSheetOpen(true);
  }

  function simulateQrScan() {
    if (!selectedFamilyLive) return;

    updateFamily(selectedFamilyLive.id, (family) => ({
      ...family,
      waiverStatus: "scanned",
    }));

    setWaiverAgree(false);
    setWaiverSignature(selectedFamilyLive.parentName);
    setQrSheetOpen(false);
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
    if (!selectedFamilyLive) return;
    if (!waiverAgree || !waiverSignature.trim()) return;

    updateFamily(selectedFamilyLive.id, (family) => ({
      ...family,
      waiverStatus: "signed",
    }));

    setCompletionNotice(`Waiver completed for ${selectedFamilyLive.parentName}`);
    closeWaiverFlow();

    window.setTimeout(() => {
      setCompletionNotice("");
    }, 2200);
  }

  const selectedFamilyLive = selectedFamily
    ? families.find((family) => family.id === selectedFamily.id) ?? selectedFamily
    : null;

  const selectedSummary = useMemo(() => {
    if (!selectedFamilyLive) return null;

    return {
      rentals: countRentals(selectedFamilyLive.children),
      firstTimers: countFirstTimers(selectedFamilyLive.children),
      skaters: selectedFamilyLive.children.length,
      waiverQrLink: selectedFamilyLive.waiverQrToken
        ? createQrLink(selectedFamilyLive.waiverQrToken)
        : null,
    };
  }, [selectedFamilyLive]);

  return (
    <div className="min-h-screen bg-[#020817] text-white p-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Skate Zone QR Check-In</h1>
        <div className="text-sm opacity-60">
          Live Family Intake • QR Waivers • Rentals
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
                        ? "border-amber-400/60 bg-[#162241]"
                        : family.waiverStatus === "qr_ready"
                        ? "border-violet-400/70 bg-[#162241] shadow-[0_0_16px_rgba(167,139,250,0.12)]"
                        : family.waiverStatus === "scanned"
                        ? "border-sky-400/70 bg-[#162241] shadow-[0_0_16px_rgba(56,189,248,0.10)]"
                        : "border-blue-400 bg-[#162241]"
                      : family.waiverStatus === "not_started"
                      ? "border-white/5 bg-[#121b34] hover:border-amber-400/50"
                      : family.waiverStatus === "qr_ready"
                      ? "border-white/5 bg-[#121b34] hover:border-violet-400/60"
                      : family.waiverStatus === "scanned"
                      ? "border-white/5 bg-[#121b34] hover:border-sky-400/60"
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
                      Tap to open QR
                    </div>
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-[#081129] p-4">
          {selectedFamilyLive ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedFamilyLive.parentName}</h2>
                <div className="text-xs opacity-50">Checked in just now</div>
              </div>

              <div className="rounded-lg border border-white/5 bg-[#121b34] p-3">
                <div className="text-xs uppercase tracking-wide opacity-50">
                  Parent Contact
                </div>
                <div className="mt-1 text-sm">
                  {selectedFamilyLive.phone || "No phone added"}
                </div>
              </div>

              <div className="rounded-lg border border-white/5 bg-[#121b34] p-3">
                <div className="text-xs uppercase tracking-wide opacity-50">
                  Kids
                </div>

                <div className="mt-2 space-y-2">
                  {selectedFamilyLive.children.map((child) => (
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
                  <span className={waiverTone(selectedFamilyLive.waiverStatus)}>
                    {selectedFamilyLive.waiverStatus === "signed"
                      ? "✅ Signed"
                      : selectedFamilyLive.waiverStatus === "scanned"
                      ? "📱 Scanned"
                      : selectedFamilyLive.waiverStatus === "qr_ready"
                      ? "🔳 QR Ready"
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

              {selectedFamilyLive.waiverStatus === "signed" ? (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-default rounded-md bg-emerald-700 px-3 py-3 font-bold text-white/95 shadow-[0_0_24px_rgba(16,185,129,0.18)]"
                >
                  ✅ Waiver Signed
                </button>
              ) : selectedFamilyLive.waiverStatus === "scanned" ? (
                <button
                  type="button"
                  onClick={() => setWaiverOpen(true)}
                  className="w-full rounded-md bg-sky-600 px-3 py-3 font-bold text-white transition hover:bg-sky-500"
                >
                  Continue QR Waiver
                </button>
              ) : selectedFamilyLive.waiverStatus === "qr_ready" ? (
                <button
                  type="button"
                  onClick={() => setQrSheetOpen(true)}
                  className="w-full rounded-md bg-violet-600 px-3 py-3 font-bold text-white transition hover:bg-violet-500"
                >
                  View QR Code
                </button>
              ) : (
                <button
                  type="button"
                  onClick={prepareQrCode}
                  className="w-full rounded-md bg-green-600 px-3 py-3 font-bold transition hover:bg-green-500"
                >
                  Generate QR Waiver
                </button>
              )}

              {selectedSummary?.waiverQrLink ? (
                <div className="rounded-lg border border-violet-400/20 bg-violet-500/10 p-3">
                  <div className="text-xs uppercase tracking-wide text-violet-300/80">
                    Active QR Link
                  </div>
                  <div className="mt-2 break-all text-xs text-violet-100/90">
                    {selectedSummary.waiverQrLink}
                  </div>
                  <div className="mt-2 text-xs text-violet-200/80">
                    Parent can scan and complete on their device.
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-sm opacity-50">Select a family</div>
          )}
        </div>
      </div>

      {qrSheetOpen && selectedFamilyLive ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#081129] shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="text-2xl font-bold">QR Waiver Ready</h2>
                <div className="mt-1 text-sm opacity-60">
                  {selectedFamilyLive.parentName} • {selectedFamilyLive.phone || "No phone on file"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setQrSheetOpen(false)}
                className="rounded-md bg-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/15"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="rounded-xl border border-violet-400/20 bg-violet-500/10 p-4">
                  <div className="text-sm font-semibold text-violet-300">
                    Scan Preview
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    In the real flow, the parent would scan a QR code at the
                    counter or on a sign. That scan opens the waiver directly on
                    their phone without the staff needing to pass a device back
                    and forth.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4">
                  <div className="text-sm font-semibold">QR Display</div>

                  <div className="mt-3 flex items-center justify-center rounded-xl border border-dashed border-violet-300/30 bg-[#020817] p-8">
                    <div className="rounded-xl bg-white p-4 shadow-lg">
                      <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: 25 }).map((_, index) => (
                          <div
                            key={index}
                            className={`h-4 w-4 rounded-sm ${
                              [0, 1, 3, 5, 7, 8, 10, 12, 14, 16, 18, 20, 21, 23, 24].includes(index)
                                ? "bg-black"
                                : "bg-white"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border border-white/5 bg-[#020817] px-3 py-3 text-xs break-all text-white/85">
                    {selectedSummary?.waiverQrLink}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4">
                  <div className="text-xs uppercase tracking-wide opacity-50">
                    Board Status
                  </div>
                  <div className="mt-2 text-lg font-semibold text-violet-300">
                    🔳 QR Ready
                  </div>
                  <div className="mt-2 text-sm opacity-70">
                    The family stays on the live board while the parent scans and
                    moves into the waiver flow.
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Parent</span>
                    <span>{selectedFamilyLive.parentName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Phone</span>
                    <span>{selectedFamilyLive.phone || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Skaters</span>
                    <span>{selectedFamilyLive.children.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Rentals</span>
                    <span>{countRentals(selectedFamilyLive.children)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">First-Time Skaters</span>
                    <span>{countFirstTimers(selectedFamilyLive.children)}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4 space-y-3">
                  <button
                    type="button"
                    onClick={simulateQrScan}
                    className="w-full rounded-md bg-violet-600 px-3 py-3 font-bold text-white transition hover:bg-violet-500"
                  >
                    Simulate Parent Scan
                  </button>

                  <button
                    type="button"
                    onClick={() => setQrSheetOpen(false)}
                    className="w-full rounded-md bg-white/10 px-3 py-3 font-medium text-white/85 transition hover:bg-white/15"
                  >
                    Close QR Sheet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {waiverOpen && selectedFamilyLive ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#081129] shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="text-2xl font-bold">QR Family Waiver</h2>
                <div className="mt-1 text-sm opacity-60">
                  {selectedFamilyLive.parentName} • {selectedFamilyLive.children.length} skater
                  {selectedFamilyLive.children.length > 1 ? "s" : ""}
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
                <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-4">
                  <div className="text-sm font-semibold text-sky-300">
                    Parent Device Waiver
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    This waiver was opened from a QR scan. The parent can review
                    the skating risk acknowledgment, confirm the covered skaters,
                    and sign directly from their own phone.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4">
                  <div className="text-sm font-semibold">Covered Skaters</div>

                  <div className="mt-3 space-y-2">
                    {selectedFamilyLive.children.map((child) => (
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
                  <div className="mt-2 text-lg font-semibold text-sky-300">
                    📱 QR Scanned
                  </div>
                  <div className="mt-2 text-sm opacity-70">
                    The board stays live while the parent finishes the waiver
                    from their phone.
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#121b34] p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Parent</span>
                    <span>{selectedFamilyLive.parentName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Phone</span>
                    <span>{selectedFamilyLive.phone || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Skaters</span>
                    <span>{selectedFamilyLive.children.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Rentals</span>
                    <span>{countRentals(selectedFamilyLive.children)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">First-Time Skaters</span>
                    <span>{countFirstTimers(selectedFamilyLive.children)}</span>
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