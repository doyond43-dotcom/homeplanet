import { useMemo, useState } from "react";

export type GuardianVisibilityNameMode = "first-name" | "alias" | "hidden";
export type GuardianVisibilityLevel = "exact" | "general" | "hidden";
export type GuardianVisibilityTimelineMode = "full" | "latest-only" | "hidden";

export type GuardianVisibilitySettings = {
  nameMode: GuardianVisibilityNameMode;
  alias: string;
  showPhoto: boolean;
  safeTags: string[];
  showContactButton: boolean;
  zoneVisibility: GuardianVisibilityLevel;
  activityVisibility: "show" | "hidden";
  staffVisibility: "show" | "hidden";
  timelineVisibility: GuardianVisibilityTimelineMode;
  notesVisibility: "show" | "hidden";
};

type GuardianVisibilityCardProps = {
  childName: string;
  contactInfo?: string;
  initialSettings?: Partial<GuardianVisibilitySettings>;
  onSave?: (settings: GuardianVisibilitySettings) => void;
};

const SAFE_TAG_OPTIONS = [
  "call guardian",
  "child is safe",
  "awaiting pickup",
  "staff supervised",
  "medical note on file",
  "do not approach directly",
  "nonverbal",
  "sensory support needed",
  "allergy alert",
  "may be overwhelmed",
  "autism support needed",
] as const;

const DEFAULT_SETTINGS: GuardianVisibilitySettings = {
  nameMode: "first-name",
  alias: "",
  showPhoto: true,
  safeTags: ["call guardian"],
  showContactButton: true,
  zoneVisibility: "general",
  activityVisibility: "show",
  staffVisibility: "hidden",
  timelineVisibility: "latest-only",
  notesVisibility: "hidden",
};

function getFirstName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "Child";
  return trimmed.split(/\s+/)[0] || "Child";
}

function resolvePreviewName(
  childName: string,
  settings: GuardianVisibilitySettings,
) {
  if (settings.nameMode === "hidden") return "Protected Child";
  if (settings.nameMode === "alias") {
    return settings.alias.trim() || getFirstName(childName);
  }
  return getFirstName(childName);
}

function normalizeSettings(
  initialSettings?: Partial<GuardianVisibilitySettings>,
): GuardianVisibilitySettings {
  return {
    ...DEFAULT_SETTINGS,
    ...initialSettings,
    safeTags: initialSettings?.safeTags?.length
      ? initialSettings.safeTags
      : DEFAULT_SETTINGS.safeTags,
    zoneVisibility:
      initialSettings?.zoneVisibility === "exact" ||
      initialSettings?.zoneVisibility === "hidden"
        ? initialSettings.zoneVisibility
        : DEFAULT_SETTINGS.zoneVisibility,
    activityVisibility:
      initialSettings?.activityVisibility === "hidden" ? "hidden" : "show",
    staffVisibility:
      initialSettings?.staffVisibility === "show" ? "show" : "hidden",
    timelineVisibility:
      initialSettings?.timelineVisibility === "full" ||
      initialSettings?.timelineVisibility === "hidden"
        ? initialSettings.timelineVisibility
        : DEFAULT_SETTINGS.timelineVisibility,
    notesVisibility:
      initialSettings?.notesVisibility === "show" ? "show" : "hidden",
  };
}

function displayZoneLabel(level: GuardianVisibilityLevel) {
  if (level === "exact") return "Home / School";
  if (level === "general") return "In expected area";
  return "Zone hidden";
}

function displayActivityLabel(isVisible: boolean) {
  return isVisible ? "Safe and active" : "Activity hidden";
}

function displayStaffLabel(isVisible: boolean) {
  return isVisible ? "Staff supervised" : "Staff hidden";
}

export default function GuardianVisibilityCard({
  childName,
  contactInfo,
  initialSettings,
  onSave,
}: GuardianVisibilityCardProps) {
  const [settings, setSettings] = useState<GuardianVisibilitySettings>(
    normalizeSettings(initialSettings),
  );

  const [saved, setSaved] = useState(false);

  const previewName = useMemo(
    () => resolvePreviewName(childName, settings),
    [childName, settings],
  );

  function updateSetting<K extends keyof GuardianVisibilitySettings>(
    key: K,
    value: GuardianVisibilitySettings[K],
  ) {
    setSaved(false);
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function toggleTag(tag: string) {
    setSaved(false);
    setSettings((prev) => {
      const exists = prev.safeTags.includes(tag);
      return {
        ...prev,
        safeTags: exists
          ? prev.safeTags.filter((item) => item !== tag)
          : [...prev.safeTags, tag],
      };
    });
  }

  function handleSave() {
    onSave?.(settings);
    setSaved(true);
  }

  return (
    <div className="rounded-[28px] border border-cyan-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-cyan-300">
            Visibility controls
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Public safety layer
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
            This is the control system behind the public Guardian page. The
            guardian decides exactly what the public side is allowed to show.
          </p>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
          Protected side
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
              Public name
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => updateSetting("nameMode", "first-name")}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  settings.nameMode === "first-name"
                    ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                    : "border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                }`}
              >
                First name
              </button>

              <button
                type="button"
                onClick={() => updateSetting("nameMode", "alias")}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  settings.nameMode === "alias"
                    ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                    : "border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                }`}
              >
                Alias
              </button>

              <button
                type="button"
                onClick={() => updateSetting("nameMode", "hidden")}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  settings.nameMode === "hidden"
                    ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                    : "border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                }`}
              >
                Hidden label
              </button>
            </div>

            {settings.nameMode === "alias" ? (
              <div className="mt-4">
                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Public alias
                  </div>
                  <input
                    value={settings.alias}
                    onChange={(event) =>
                      updateSetting("alias", event.target.value)
                    }
                    placeholder="Little Bear"
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>
              </div>
            ) : null}
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
              Public display
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => updateSetting("showPhoto", !settings.showPhoto)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  settings.showPhoto
                    ? "border-cyan-400/25 bg-cyan-500/10"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="text-sm font-semibold text-white">
                  Show photo
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {settings.showPhoto
                    ? "Photo is allowed on the public page."
                    : "Photo stays protected."}
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  updateSetting(
                    "showContactButton",
                    !settings.showContactButton,
                  )
                }
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  settings.showContactButton
                    ? "border-cyan-400/25 bg-cyan-500/10"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="text-sm font-semibold text-white">
                  Show contact button
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {settings.showContactButton
                    ? "Public page can show the guardian contact action."
                    : "Public page hides the contact action."}
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
              Live information controls
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Current zone visibility
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => updateSetting("zoneVisibility", "exact")}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      settings.zoneVisibility === "exact"
                        ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                        : "border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    Exact zone
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting("zoneVisibility", "general")}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      settings.zoneVisibility === "general"
                        ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                        : "border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    General zone
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting("zoneVisibility", "hidden")}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      settings.zoneVisibility === "hidden"
                        ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                        : "border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    Hide zone
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    updateSetting(
                      "activityVisibility",
                      settings.activityVisibility === "show" ? "hidden" : "show",
                    )
                  }
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    settings.activityVisibility === "show"
                      ? "border-cyan-400/25 bg-cyan-500/10"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="text-sm font-semibold text-white">
                    Show activity
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {settings.activityVisibility === "show"
                      ? "Public side can show current activity."
                      : "Current activity stays protected."}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateSetting(
                      "staffVisibility",
                      settings.staffVisibility === "show" ? "hidden" : "show",
                    )
                  }
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    settings.staffVisibility === "show"
                      ? "border-cyan-400/25 bg-cyan-500/10"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="text-sm font-semibold text-white">
                    Show staff / supervision
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {settings.staffVisibility === "show"
                      ? "Public side can show supervision context."
                      : "Staff detail stays protected."}
                  </div>
                </button>
              </div>

              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Timeline visibility
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => updateSetting("timelineVisibility", "full")}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      settings.timelineVisibility === "full"
                        ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                        : "border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    Full timeline
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateSetting("timelineVisibility", "latest-only")
                    }
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      settings.timelineVisibility === "latest-only"
                        ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                        : "border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    Latest only
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSetting("timelineVisibility", "hidden")}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      settings.timelineVisibility === "hidden"
                        ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                        : "border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    Hide timeline
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateSetting(
                    "notesVisibility",
                    settings.notesVisibility === "show" ? "hidden" : "show",
                  )
                }
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  settings.notesVisibility === "show"
                    ? "border-cyan-400/25 bg-cyan-500/10"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="text-sm font-semibold text-white">
                  Show safe notes
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {settings.notesVisibility === "show"
                    ? "Public side can show safe notes."
                    : "Notes stay protected."}
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
              Public safe tags
            </div>
            <div className="mt-2 text-sm text-slate-300">
              Choose only the tags that help a safe public-facing rescue or contact flow.
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {SAFE_TAG_OPTIONS.map((tag) => {
                const active = settings.safeTags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "border-emerald-400/25 bg-emerald-500/12 text-emerald-100"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
            >
              Save visibility settings
            </button>

            {saved ? (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-100">
                Visibility settings saved
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[24px] border border-cyan-500/20 bg-[linear-gradient(180deg,rgba(14,165,233,0.10),rgba(11,26,36,0.92))] p-5">
            <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-200">
              Public preview
            </div>

            <div className="mt-4 rounded-[24px] border border-cyan-400/15 bg-[#0b1328] p-5 shadow-[0_0_28px_rgba(0,255,200,0.08)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/80">
                    Public child page
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-white">
                    {previewName}
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    {displayActivityLabel(settings.activityVisibility === "show")}
                  </div>
                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Safe preview
                </div>
              </div>

              {settings.showPhoto ? (
                <div className="mt-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs text-slate-400">
                  Photo
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Zone
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {displayZoneLabel(settings.zoneVisibility)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Supervision
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {displayStaffLabel(settings.staffVisibility === "show")}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Timeline
                </div>
                <div className="mt-2 text-sm text-slate-200">
                  {settings.timelineVisibility === "full"
                    ? "Full public timeline visible"
                    : settings.timelineVisibility === "latest-only"
                      ? "Latest timeline event only"
                      : "Timeline hidden"}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Notes
                </div>
                <div className="mt-2 text-sm text-slate-200">
                  {settings.notesVisibility === "show"
                    ? "Safe notes visible"
                    : "Notes hidden"}
                </div>
              </div>

              {settings.safeTags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {settings.safeTags.map((tag) => (
                    <div
                      key={tag}
                      className="rounded-full bg-[#243045] px-3 py-1.5 text-xs text-slate-200"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              ) : null}

              {settings.showContactButton ? (
                <div className="mt-5 rounded-xl bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white">
                  {contactInfo?.trim()
                    ? "Contact Guardian"
                    : "Contact button visible"}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-semibold text-slate-400">
                  Contact hidden
                </div>
              )}

              <div className="mt-5 text-xs leading-6 text-slate-400">
                This preview shows exactly what the public side is allowed to see.
                Protected details stay with the guardian.
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
              Locked rule
            </div>
            <div className="mt-2 text-sm leading-7 text-slate-300">
              Guardian does not publish the full child record. It publishes a
              safety-filtered presence layer controlled from the protected side.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}