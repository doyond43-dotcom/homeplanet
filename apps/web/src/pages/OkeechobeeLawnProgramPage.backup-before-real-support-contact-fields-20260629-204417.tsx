import { useState } from "react";
import { supabase } from "../lib/supabase";

type PanelType = "request" | "worker" | "sponsor" | "helper" | "notify" | null;
type SelectedState = Record<string, string>;

const EVENT_KEY = "hp_okeechobee_lawn_events";
const SESSION_KEY = "hp_okeechobee_lawn_session_id";

const zones = [
  "Near Town",
  "Treasure Island",
  "Taylor Creek",
  "Buckhead Ridge",
  "Basswood",
  "Fort Drum",
  "North of town",
  "South of town",
  "441 area",
  "70 East",
  "70 West",
  "Other / Not sure",
];

function getLawnSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `lawn-${Date.now()}`;

    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

async function trackLawnEvent(type: string, payload: Record<string, string>) {
  const sessionId = getLawnSessionId();

  const event = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()),
    page: "okeechobee-together-lawn-program",
    event_type: type,
    payload,
    session_id: sessionId,
    createdAt: new Date().toISOString(),
  };

  const current = JSON.parse(localStorage.getItem(EVENT_KEY) || "[]");
  localStorage.setItem(EVENT_KEY, JSON.stringify([event, ...current].slice(0, 250)));

  console.log("Okeechobee Lawn Intelligence:", event);

  const { error } = await supabase.from("okeechobee_lawn_events").insert({
    page: event.page,
    event_type: type,
    session_id: sessionId,
    source: payload.source || null,
    panel: payload.panel || null,
    action: payload.action || null,
    option_group: payload.group || null,
    option_value: payload.value || null,
    zone: payload.group === "nearby_zone" ? payload.value : null,
    payload,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  });

  if (error) {
    console.error("Okeechobee Lawn Supabase event failed:", error);
  }
}

export default function OkeechobeeLawnProgramPage() {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [selected, setSelected] = useState<SelectedState>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const updateField = (group: string, value: string) => {
    setFieldValues((current) => ({
      ...current,
      [group]: value,
    }));
  };
  const [multiSelected, setMultiSelected] = useState<Record<string, string[]>>({});

  function openPanel(panel: PanelType, source: string) {
    if (!panel) return;
    setSelected({});
    setFieldValues({});
    setPhotoFiles([]);
    setMultiSelected({});
    trackLawnEvent("panel_opened", { panel, source });
    setActivePanel(panel);
  }

  function closePanel() {
    trackLawnEvent("panel_closed", { panel: activePanel || "none" });
    setActivePanel(null);
    setSelected({});
    setFieldValues({});
    setPhotoFiles([]);
    setMultiSelected({});
  }

  function selectOption(group: string, value: string) {
    setSelected((current) => ({ ...current, [group]: value }));
    trackLawnEvent("option_selected", {
      panel: activePanel || "none",
      group,
      value,
    });
  }

  function toggleMultiOption(group: string, value: string) {
    setMultiSelected((current) => {
      const existing = current[group] || [];
      const isActive = existing.includes(value);
      const nextValues = isActive
        ? existing.filter((item) => item !== value)
        : [...existing, value];

      return {
        ...current,
        [group]: nextValues,
      };
    });

    trackLawnEvent("multi_option_toggled", {
      panel: activePanel || "none",
      group,
      value,
    });
  }

  async function uploadLawnPhotos() {
    if (!photoFiles.length) {
      return {
        photo_count: "0",
        photo_names: "",
        photo_paths: "",
        photo_urls: "",
      };
    }

    const sessionId = getLawnSessionId();
    const uploadedPaths: string[] = [];
    const uploadedUrls: string[] = [];

    for (const file of photoFiles) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${sessionId}/${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from("okeechobee-lawn-photos")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Failed to upload lawn photo:", error);
        continue;
      }

      uploadedPaths.push(path);

      const { data, error: signedUrlError } = await supabase.storage
        .from("okeechobee-lawn-photos")
        .createSignedUrl(path, 60 * 60 * 24 * 7);

      if (signedUrlError) {
        console.error("Failed to create signed photo URL:", signedUrlError);
      }

      if (data?.signedUrl) {
        uploadedUrls.push(data.signedUrl);
      }
    }

    return {
      photo_count: String(uploadedPaths.length),
      photo_names: photoFiles.map((file) => file.name).join(", "),
      photo_paths: uploadedPaths.join(", "),
      photo_urls: uploadedUrls.join(", "),
    };
  }

  async function submitPanel(panel: string) {
    const multiPayload = Object.fromEntries(
      Object.entries(multiSelected).map(([key, values]) => [
        key,
        values.join(", "),
      ])
    );

    const photoPayload = await uploadLawnPhotos();

    await trackLawnEvent("panel_submitted", {
      panel,
      ...selected,
      ...multiPayload,
      ...fieldValues,
      ...photoPayload,
    });

    closePanel();

    const existingNotice = document.getElementById("hp-lawn-submit-confirmation");
    if (existingNotice) existingNotice.remove();

    const notice = document.createElement("div");
    notice.id = "hp-lawn-submit-confirmation";
    notice.innerHTML = `
      <div style="font-weight:900;color:#86efac;margin-bottom:4px;">Request sent</div>
      <div style="font-weight:700;color:rgba(255,255,255,.75);font-size:14px;line-height:1.4;">
        We received it. We’ll review it and figure out the next step.
      </div>
    `;

    notice.style.position = "fixed";
    notice.style.left = "16px";
    notice.style.right = "16px";
    notice.style.top = "16px";
    notice.style.zIndex = "99999";
    notice.style.maxWidth = "560px";
    notice.style.margin = "0 auto";
    notice.style.padding = "16px";
    notice.style.borderRadius = "22px";
    notice.style.border = "1px solid rgba(74,222,128,.35)";
    notice.style.background = "rgba(0,0,0,.94)";
    notice.style.boxShadow = "0 0 30px rgba(34,197,94,.25)";
    notice.style.textAlign = "center";

    document.body.appendChild(notice);

    setTimeout(() => {
      notice.remove();
    }, 6500);
  }

  function optionClass(group: string, value: string) {
    const isActive = selected[group] === value;

    return [
      "rounded-xl border px-4 py-3 text-left text-sm font-bold transition",
      isActive
        ? "border-green-400 bg-green-400/15 text-green-200"
        : "border-white/10 bg-white/[0.03] text-white hover:border-green-400/40",
    ].join(" ");
  }

  function multiOptionClass(group: string, value: string) {
    const isActive = (multiSelected[group] || []).includes(value);

    return [
      "rounded-xl border px-4 py-3 text-left text-sm font-bold transition",
      isActive
        ? "border-green-400 bg-green-400/15 text-green-200"
        : "border-white/10 bg-white/[0.03] text-white hover:border-green-400/40",
    ].join(" ");
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="text-lg font-black text-green-400">
            Okeechobee Together
          </div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-white/50">
            Lawn Program
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <p className="text-sm font-black text-green-400">
                Okeechobee Together Lawn Program
              </p>

              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
                Basic lawn help for Okeechobee neighbors who need it most.
              </h1>

              <p className="mt-6 max-w-3xl text-lg font-semibold leading-relaxed text-white/70">
                For seniors, veterans, fixed-income residents, single parents,
                and neighbors going through a hard time.
              </p>
            </div>

            <div className="rounded-3xl border border-green-400/20 bg-green-400/[0.06] p-3 shadow-[0_0_60px_rgba(74,222,128,0.10)]">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
                <img
                  src="/images/okeechobee-together-lawn-hero-mower.png"
                  alt="Push mower cutting grass for the Okeechobee Together Lawn Program"
                  className="h-[260px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-sm font-black text-white">
                    Basic mow • trim • blow
                  </div>
                  <div className="mt-1 text-xs font-bold text-white/60">
                    Local route help starting in Okeechobee.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <button
            onClick={() => openPanel("request", "I Need Lawn Help card")}
            className="min-h-[128px] rounded-3xl border border-green-400/40 bg-green-400/10 p-5 text-left"
          >
            <div className="text-lg font-black">I Need Lawn Help</div>
            <div className="mt-3 text-sm font-semibold leading-relaxed text-white/60">
              Request basic mow, trim, blow, or review.
            </div>
          </button>

          <button
            onClick={() => openPanel("worker", "I Want To Work card")}
            className="min-h-[128px] rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left"
          >
            <div className="text-lg font-black">I Want To Work</div>
            <div className="mt-3 text-sm font-semibold leading-relaxed text-white/60">
              Join the local worker list.
            </div>
          </button>

          <button
            onClick={() => openPanel("sponsor", "Sponsor / Piggy Bank card")}
            className="min-h-[128px] rounded-3xl border border-yellow-300/30 bg-yellow-300/10 p-5 text-left"
          >
            <div className="text-lg font-black">Sponsor / Piggy Bank</div>
            <div className="mt-3 text-sm font-semibold leading-relaxed text-white/60">
              Help cover a yard for someone who needs it.
            </div>
          </button>

          <button
            onClick={() => openPanel("helper", "I Want To Help card")}
            className="min-h-[128px] rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left"
          >
            <div className="text-lg font-black">I Want To Help</div>
            <div className="mt-3 text-sm font-semibold leading-relaxed text-white/60">
              Volunteer, offer equipment, or help follow up.
            </div>
          </button>
        </section>

        <section className="mt-8 rounded-3xl border border-green-400/20 bg-green-400/[0.05] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black text-green-400">In Your Area</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Get notified when lawn help is nearby.
              </h2>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-white/70">
                Lawn help routes can be organized by local zones so neighbors
                know when help may be close.
              </p>
            </div>

            <div className="grid gap-2 text-sm font-black md:min-w-[280px]">
              <div className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <span className="text-white/50">Now forming</span>
                <span className="text-green-300">Near Town</span>
              </div>
              <div className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <span className="text-white/50">Next possible</span>
                <span className="text-green-300">Treasure Island</span>
              </div>
              <div className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <span className="text-white/50">Text alerts</span>
                <span className="text-green-300">Open</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <button
              onClick={() => openPanel("notify", "Notify Me Nearby button")}
              className="rounded-2xl bg-green-400 px-5 py-4 font-black text-black"
            >
              Notify Me Nearby
            </button>
            <button
              onClick={() => openPanel("request", "Ask To Be Added button")}
              className="rounded-2xl border border-white/15 bg-black/20 px-5 py-4 font-black text-white"
            >
              Ask To Be Added
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-yellow-300/20 bg-yellow-300/[0.06] p-6 md:p-8">
          <div className="flex items-center gap-3">
              <GreenPigIcon />
              <h2 className="text-3xl font-black tracking-tight">
                Community Piggy Bank
              </h2>
            </div>

          <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-white/70">
            Some neighbors can pay. Some can pay a little. Some need help. The
            piggy bank helps cover the gap so workers can still be paid fairly.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {[
              ["Fair yard pay", "$50"],
              ["Neighbor paid", "$30"],
              ["Piggy Bank", "$20"],
              ["Worker paid", "$50"],
            ].map(([label, value]) => (
              <button
                key={label}
                onClick={() =>
                  trackLawnEvent("piggy_bank_example_clicked", {
                    label,
                    value,
                  })
                }
                className="rounded-2xl border border-white/10 bg-black/30 p-5 text-left transition hover:border-green-400/30 hover:bg-green-400/[0.04] hover:shadow-[0_0_22px_rgba(74,222,128,0.10)]"
              >
                <div className="text-xs font-black uppercase tracking-widest text-white/50">
                  {label}
                </div>
                <div className="mt-3 text-3xl font-black">{value}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 className="text-3xl font-black tracking-tight">Good To Know</h2>

          <div className="mt-5 grid gap-3 text-sm font-semibold leading-relaxed text-white/70">
            <button
              onClick={() => openPanel("request", "Good To Know basic help")}
              className="text-left"
            >
              Basic help means mow, trim, and blow.
            </button>
            <button
              onClick={() => openPanel("request", "Good To Know review")}
              className="text-left"
            >
              Some yards may need review.
            </button>
            <button
              onClick={() => openPanel("request", "Good To Know photos optional")}
              className="text-left"
            >
              Photos help but are not required.
            </button>
            <button
              onClick={() => openPanel("request", "Good To Know request someone else")}
              className="text-left"
            >
              You can request help for someone else.
            </button>
            <button
              onClick={() => openPanel("worker", "Good To Know work pathway")}
              className="text-left"
            >
              This is being built as a community work pathway first.
            </button>
          </div>
        </section>
      </div>

      {activePanel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 md:items-center">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-green-400">
                  Okeechobee Together Lawn Program
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {activePanel === "request" && "Request Lawn Help"}
                  {activePanel === "worker" && "Join The Worker List"}
                  {activePanel === "sponsor" && "Sponsor / Piggy Bank"}
                  {activePanel === "helper" && "I Want To Help"}
                  {activePanel === "notify" && "Nearby Route Alerts"}
                </h2>
              </div>

              <button
                onClick={closePanel}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-black text-white/70"
              >
                Close
              </button>
            </div>

            {activePanel === "request" && (
              <div className="mt-6 grid gap-5">
                <RequestWarmIntro />

                    <OptionGroup
                  title="Who needs help?"
                  group="who_needs_help"
                  options={[
                    "Me",
                    "Parent / grandparent",
                    "Neighbor",
                    "Veteran",
                    "Senior",
                    "Single parent",
                    "Someone disabled / physically unable",
                    "Other",
                  ]}
                  optionClass={optionClass}
                  selectOption={selectOption}
                />

                <MultiOptionGroup
                  title="What kind of help?"
                  group="help_type"
                  options={[
                    "Basic mow",
                    "Trim / weed eat",
                    "Blow driveway / walkway",
                    "Overgrown",
                    "Not sure",
                    "Special review",
                  ]}
                  multiOptionClass={multiOptionClass}
                  toggleMultiOption={toggleMultiOption}
                />

                <OptionGroup
                  title="Yard condition"
                  group="yard_condition"
                  options={[
                    "Light",
                    "Average / manageable",
                    "Tall grass",
                    "Overgrown",
                    "Needs review",
                  ]}
                  optionClass={optionClass}
                  selectOption={selectOption}
                />

                <OptionGroup
                  title="Can they contribute?"
                  group="contribution"
                  options={[
                    "Yes",
                    "A little",
                    "Need Piggy Bank help",
                    "Not sure",
                  ]}
                  optionClass={optionClass}
                  selectOption={selectOption}
                />

                <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-green-400/25 hover:bg-green-400/[0.035] text-sm font-semibold text-white/60">
                  <ContactFields
                      values={fieldValues}
                      onChange={updateField}
                    />

                    <PhotoPicker values={fieldValues} onChange={updateField} onFilesChange={setPhotoFiles} />
                </p>

                <button
                  onClick={() => submitPanel("request")}
                  className="rounded-2xl bg-green-400 px-5 py-4 font-black text-black"
                >
                  Send My Lawn Request
                </button>
              </div>
            )}

            {activePanel === "notify" && (
              <div className="mt-6 grid gap-5">
                <OptionGroup
                  title="Where are you located?"
                  group="nearby_zone"
                  options={zones}
                  optionClass={optionClass}
                  selectOption={selectOption}
                />

                <OptionGroup
                  title="When do you need help?"
                  group="route_need"
                  options={["Need help now", "Maybe later", "Just notify me"]}
                  optionClass={optionClass}
                  selectOption={selectOption}
                />

                <button
                  onClick={() => submitPanel("nearby_alert")}
                  className="rounded-2xl bg-green-400 px-5 py-4 font-black text-black"
                >
                  Join Nearby Alert List
                </button>
              </div>
            )}

            {activePanel === "worker" && (
              <div className="mt-6 grid gap-5">
                <OptionGroup
                  title="What can you do?"
                  group="worker_skills"
                  options={[
                    "Can mow",
                    "Can trim",
                    "Has mower",
                    "Has weed eater",
                    "Has truck / trailer",
                    "Can help with cleanup",
                  ]}
                  optionClass={optionClass}
                  selectOption={selectOption}
                />

                <OptionGroup
                  title="What kind of work?"
                  group="worker_type"
                  options={["Paid work", "Volunteer", "Both"]}
                  optionClass={optionClass}
                  selectOption={selectOption}
                />

                <button
                  onClick={() => submitPanel("worker")}
                  className="rounded-2xl bg-green-400 px-5 py-4 font-black text-black"
                >
                  Join Worker List
                </button>
              </div>
            )}

            {activePanel === "sponsor" && (
              <div className="mt-6 grid gap-5">
                <OptionGroup
                  title="How would you like to help?"
                  group="sponsor_option"
                  options={[
                    "Sponsor part of a yard",
                    "Sponsor a full yard",
                    "Help with gas",
                    "Help with equipment",
                    "Contact me first",
                  ]}
                  optionClass={optionClass}
                  selectOption={selectOption}
                />

                <button
                  onClick={() => submitPanel("sponsor")}
                  className="rounded-2xl bg-yellow-300 px-5 py-4 font-black text-black"
                >
                  Offer To Sponsor
                </button>
              </div>
            )}

            {activePanel === "helper" && (
              <div className="mt-6 grid gap-5">
                <OptionGroup
                  title="How can you help?"
                  group="helper_option"
                  options={[
                    "Volunteer",
                    "Coordinate",
                    "Offer equipment",
                    "Take photos",
                    "Help with calls",
                    "Help with follow-up",
                  ]}
                  optionClass={optionClass}
                  selectOption={selectOption}
                />

                <button
                  onClick={() => submitPanel("helper")}
                  className="rounded-2xl bg-green-400 px-5 py-4 font-black text-black"
                >
                  Join Helper List
                </button>
              </div>
            )}
          </div>
        </div>
      )}      
      <footer className="mx-auto mt-8 max-w-5xl border-t border-white/10 pt-6 pb-10 text-center">
        <div className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-green-400/30 bg-green-400/10 text-green-300 shadow-[0_0_18px_rgba(74,222,128,0.25)]">
            <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.65)]" />
          </span>

          <div className="text-left">
            <div className="text-[11px] font-black uppercase tracking-[0.28em] text-white/55">
              Built on HomePlanet
            </div>
            <div className="mt-1 text-xs font-semibold text-white/40">
              Stronger together.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function OptionGroup({
  title,
  group,
  options,
  optionClass,
  selectOption,
}: {
  title: string;
  group: string;
  options: string[];
  optionClass: (group: string, value: string) => string;
  selectOption: (group: string, value: string) => void;
}) {
  function multiOptionClass(group: string, value: string) {
    const isActive = (multiSelected[group] || []).includes(value);

    return [
      "rounded-xl border px-4 py-3 text-left text-sm font-bold transition",
      isActive
        ? "border-green-400 bg-green-400/15 text-green-200"
        : "border-white/10 bg-white/[0.03] text-white hover:border-green-400/40",
    ].join(" ");
  }

  return (
    <div>
      <div className="text-sm font-black text-white/80">{title}</div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {options.map((item) => (
          <button
            key={item}
            onClick={() => selectOption(group, item)}
            className={optionClass(group, item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiOptionGroup({
  title,
  group,
  options,
  multiOptionClass,
  toggleMultiOption,
}: {
  title: string;
  group: string;
  options: string[];
  multiOptionClass: (group: string, value: string) => string;
  toggleMultiOption: (group: string, value: string) => void;
}) {
  return (
    <div>
      <div className="text-sm font-black text-white/80">{title}</div>
      <div className="mt-1 text-xs font-bold text-white/40">
        Select all that apply.
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {options.map((item) => (
          <button
            key={item}
            onClick={() => toggleMultiOption(group, item)}
            className={multiOptionClass(group, item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContactFields({
  values,
  onChange,
}: {
  values: Record<string, string>;
  onChange: (group: string, value: string) => void;
}) {
  return (
    <div className="mt-5 rounded-3xl border border-green-400/20 bg-green-400/[0.05] p-4">
      <div className="text-sm font-black text-green-300">
        How can we reach you?
      </div>

      <p className="mt-2 text-xs font-semibold leading-relaxed text-white/55">
        So someone can follow up, match the right help, and figure out the next step.
      </p>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-white/45">
            Name
          </span>
          <input
            value={values.name || ""}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="First name is fine"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-green-400/50"
            autoComplete="name"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-white/45">
            Phone
          </span>
          <input
            value={values.phone || ""}
            onChange={(event) => onChange("phone", event.target.value)}
            placeholder="Best number to text or call"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-green-400/50"
            autoComplete="tel"
            inputMode="tel"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-white/45">
            What part of Okeechobee?
          </span>
          <input
            value={values.contact_zone || ""}
            onChange={(event) => onChange("contact_zone", event.target.value)}
            placeholder="Near Town, Taylor Creek, Treasure Island, Basswood, etc."
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-green-400/50"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-white/45">
            Notes
          </span>
          <textarea
            value={values.notes || ""}
            onChange={(event) => onChange("notes", event.target.value)}
            placeholder="Gate, dogs, best time, how urgent, or anything we should know."
            rows={3}
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-green-400/50"
          />
        </label>
      </div>
    </div>
  );
}

function RequestWarmIntro() {
  return (
    <div className="mb-5 rounded-3xl border border-green-400/20 bg-green-400/[0.05] p-4">
      <div className="text-sm font-black text-green-300">
        Tell us what is going on.
      </div>

      <p className="mt-2 text-sm font-semibold leading-relaxed text-white/65">
        No judgment. Some yards just get away from people. This helps us understand
        the need, the area, and whether Piggy Bank support may be needed.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-black text-white/60">
          Takes about a minute
        </span>
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-black text-white/60">
          Basic info first
        </span>
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-black text-white/60">
          We review the next step
        </span>
      </div>
    </div>
  );
}

function PhotoPicker({
  values,
  onChange,
  onFilesChange,
}: {
  values: Record<string, string>;
  onChange: (group: string, value: string) => void;
  onFilesChange: (files: File[]) => void;
}) {
  const photoCount = Number(values.photo_count || "0");
  const photoNames = values.photo_names || "";

  return (
    <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-sm font-black text-white">
        Photos of the yard
      </div>

      <p className="mt-2 text-xs font-semibold leading-relaxed text-white/55">
        Optional, but helpful. Photos can show if it is a simple mow, overgrown,
        or something that needs review.
      </p>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-green-400/30 bg-green-400/[0.06] px-4 py-5 text-center hover:bg-green-400/[0.09]">
        <span className="text-sm font-black text-green-300">
          Add Photos
        </span>

        <span className="mt-1 text-xs font-semibold text-white/45">
          You can still send this without photos.
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            onFilesChange(files);
            onChange("photo_count", String(files.length));
            onChange("photo_names", files.map((file) => file.name).join(", "));
          }}
        />
      </label>

      {photoCount > 0 && (
        <div className="mt-4 rounded-2xl border border-green-400/20 bg-black/30 p-3">
          <div className="text-xs font-black text-green-300">
            {photoCount} photo{photoCount === 1 ? "" : "s"} selected
          </div>

          <div className="mt-1 break-words text-xs font-semibold text-white/45">
            {photoNames}
          </div>
        </div>
      )}
    </div>
  );
}








function GreenPigIcon() {
  return (
    <img
      src="/images/homeplanet-green-piggy-bank-transparent.png?v=20260629-105940"
      alt=""
      className="h-16 w-16 shrink-0 object-contain"
      aria-hidden="true"
    />
  );
}

function GoodToKnowItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-green-400/25 hover:bg-green-400/[0.035]">
      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-green-400 shadow-[0_0_14px_rgba(74,222,128,0.55)]" />
      <div className="text-sm font-bold leading-relaxed text-white/72">
        {text}
      </div>
    </div>
  );
}












