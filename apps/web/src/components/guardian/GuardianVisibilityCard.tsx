import { useMemo, useState } from "react";

export type GuardianVisibilityNameMode = "first-name" | "alias" | "hidden";

export type GuardianVisibilitySettings = {
  nameMode: GuardianVisibilityNameMode;
  alias: string;
  showPhoto: boolean;
  safeTags: string[];
  showContactButton: boolean;
};

type GuardianVisibilityCardProps = {
  childName: string;
  contactInfo?: string;
  initialSettings?: Partial<GuardianVisibilitySettings>;
  onSave?: (settings: GuardianVisibilitySettings) => void;
};

const SAFE_TAG_OPTIONS = [
  "call guardian",
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
  if (settings.nameMode === "hidden") return "Child";
  if (settings.nameMode === "alias") {
    return settings.alias.trim() || getFirstName(childName);
  }
  return getFirstName(childName);
}

export default function GuardianVisibilityCard({
  childName,
  contactInfo,
  initialSettings,
  onSave,
}: GuardianVisibilityCardProps) {
  const [settings, setSettings] = useState<GuardianVisibilitySettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
    safeTags: initialSettings?.safeTags?.length
      ? initialSettings.safeTags
      : DEFAULT_SETTINGS.safeTags,
  });

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
            This controls what the public Guardian page is allowed to show.
            Protected details stay with the guardian.
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
              Public safe tags
            </div>
            <div className="mt-2 text-sm text-slate-300">
              Choose only the support tags that are safe and helpful for a public rescue-facing page.
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

        <div className="rounded-[24px] border border-cyan-500/20 bg-[linear-gradient(180deg,rgba(14,165,233,0.10),rgba(11,26,36,0.92))] p-5">
          <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-200">
            Public preview
          </div>

          <div className="mt-4 rounded-[24px] border border-cyan-400/15 bg-[#0b1328] p-5 text-center shadow-[0_0_28px_rgba(0,255,200,0.08)]">
            {settings.showPhoto ? (
              <div className="mx-auto mb-4 h-20 w-20 rounded-full border border-white/10 bg-white/[0.06]" />
            ) : null}

            <div className="text-3xl font-semibold text-white">
              {previewName}
            </div>

            <div className="mt-3 text-lg font-semibold text-emerald-400">
              Needs Guardian Contact
            </div>

            <div className="mt-4 space-y-1 text-sm text-slate-200">
              <div>Public-safe preview only</div>
              <div className="text-slate-400">
                {contactInfo?.trim()
                  ? "Contact action available"
                  : "No public contact value set yet"}
              </div>
            </div>

            {settings.safeTags.length > 0 ? (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
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
              <div className="mt-5 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white">
                Contact Guardian
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-400">
                Contact hidden
              </div>
            )}

            <div className="mt-5 text-xs leading-6 text-slate-400">
              This is a public safety view. Protected details remain with the guardian.
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
              Locked rule
            </div>
            <div className="mt-2 text-sm leading-7 text-slate-300">
              Guardian does not publish the child record. It publishes a safety-filtered presence layer.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}