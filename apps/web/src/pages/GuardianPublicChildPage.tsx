import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type GuardianChild = {
  id: string;
  childName: string;
  safeZone: string;
  contactInfo: string;
  status: string;
};

type VisibilitySettings = {
  showContact: boolean;
  showZone: boolean;
  showStatus: boolean;
  panicMode: boolean;
};

function getVisibilityStorageKey(childId: string) {
  return `guardianVisibilitySettings:${childId}`;
}

function loadVisibilitySettings(childId: string): VisibilitySettings {
  try {
    const raw = localStorage.getItem(getVisibilityStorageKey(childId));
    if (!raw) {
      return {
        showContact: true,
        showZone: true,
        showStatus: true,
        panicMode: false,
      };
    }

    return JSON.parse(raw);
  } catch {
    return {
      showContact: true,
      showZone: true,
      showStatus: true,
      panicMode: false,
    };
  }
}

export default function GuardianPublicChildPage() {
  const { childId } = useParams();

  const [child, setChild] = useState<GuardianChild | null>(null);
  const [visibility, setVisibility] = useState<VisibilitySettings>(
    loadVisibilitySettings(childId || "")
  );

  useEffect(() => {
    if (!childId) return;

    // Pull from localStorage (same as your activation flow)
    const rawProfiles = localStorage.getItem("guardianActivationProfiles");
    const contactInfo = localStorage.getItem("guardianContactInfo") || "";

    if (!rawProfiles) return;

    const parsed = JSON.parse(rawProfiles);

    const match = parsed.find((p: any) => p.id === childId);

    if (!match) return;

    setChild({
      id: match.id,
      childName: match.name,
      safeZone:
        match.subtitle?.replace("Safe zone:", "").trim() || "Safe zone",
      contactInfo,
      status: match.status || "active",
    });

    // load visibility fresh
    setVisibility(loadVisibilitySettings(childId));
  }, [childId]);

  if (!child) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white px-4">
      <div
        className={`w-full max-w-md rounded-[28px] border p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.6)]
        ${
          visibility.panicMode
            ? "border-red-500 bg-red-900/30"
            : "border-cyan-500/20 bg-[#0b1a24]"
        }`}
      >
        {/* NAME */}
        <h1 className="text-3xl font-semibold text-white">
          {child.childName}
        </h1>

        {/* STATUS */}
        {visibility.showStatus && (
          <div
            className={`mt-2 text-sm font-semibold ${
              visibility.panicMode ? "text-red-400" : "text-green-400"
            }`}
          >
            {visibility.panicMode
              ? "⚠ NEEDS HELP"
              : "Needs Guardian Contact"}
          </div>
        )}

        {/* SAFE ZONE */}
        {visibility.showZone && (
          <div className="mt-3 text-sm text-slate-300">
            Safe zone: {child.safeZone}
          </div>
        )}

        {/* STATUS TEXT */}
        {visibility.showStatus && (
          <div className="text-xs text-slate-400">
            Status: {child.status}
          </div>
        )}

        {/* CONTACT BUTTON */}
        {visibility.showContact && (
          <>
            <button
              onClick={() =>
                (window.location.href = `tel:${child.contactInfo}`)
              }
              className={`mt-5 w-full rounded-xl px-4 py-3 font-semibold transition ${
                visibility.panicMode
                  ? "bg-red-500 text-white"
                  : "bg-cyan-400 text-black"
              }`}
            >
              {visibility.panicMode
                ? "EMERGENCY CONTACT"
                : "Contact Guardian"}
            </button>

            <div className="mt-2 text-xs text-slate-400">
              tap to call guardian
            </div>
          </>
        )}

        {/* FOOTER */}
        <div className="mt-4 text-xs text-slate-500">
          This is a public safety view. Protected details remain with the guardian.
        </div>
      </div>
    </div>
  );
}