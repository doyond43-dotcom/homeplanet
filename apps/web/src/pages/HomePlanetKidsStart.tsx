import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type SharingMode = "private" | "family" | "showcase";

export default function HomePlanetKidsStart() {
  const navigate = useNavigate();

  const [childName, setChildName] = useState("Haley");
  const [spaceName, setSpaceName] = useState("Haley’s Creator Space");
  const [ageRange, setAgeRange] = useState("10–12");
  const [parentContact, setParentContact] = useState("");
  const [sharingMode, setSharingMode] = useState<SharingMode>("private");

  const slug = useMemo(() => {
    const base = spaceName || childName || "kids-creator-space";
    return base
      .toLowerCase()
      .replace(/’/g, "")
      .replace(/'/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 42);
  }, [spaceName, childName]);

  const privacyCopy = {
    private: "Only the parent/guardian can view this creator space.",
    family: "Creates a protected family link after parent approval.",
    showcase: "Prepares a public showcase only after parent approval.",
  };

  function startSpace() {
    const payload = {
      childName,
      spaceName,
      ageRange,
      parentContact,
      sharingMode,
      slug,
      createdAt: new Date().toISOString(),
      protectedBy: "Predator Shield",
      status: "protected-started",
    };

    localStorage.setItem(`homeplanet-kids-space:${slug}`, JSON.stringify(payload));
    navigate(`/planet/kids/space/${slug}`);
  }

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[.9fr_1.1fr] md:px-8 md:py-14">
          <div className="flex flex-col justify-center">
            <button
              onClick={() => navigate("/planet/kids")}
              className="mb-5 w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-sky-700 shadow-sm"
            >
              ← HomePlanet Kids
            </button>

            <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
              Protected Start
            </p>

            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Create a protected creator space in under 60 seconds.
            </h1>

            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">
              This is not a signup trap. This is the first protected origin event
              for a child’s creative world.
            </p>

            <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-widest text-slate-500">
                What gets created
              </p>

              <div className="mt-4 space-y-3 text-sm font-bold text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-4">
                  🧾 A timestamped origin record
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  🛡 Predator Shield protection layer
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  👨‍👩‍👧 Parent-visible timeline
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  🎮 A real creator space for projects, ideas, and games
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
                    Start Creator Space
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    Protected by default
                  </h2>
                </div>
                <div className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-emerald-950">
                  PRIVATE
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-black text-slate-200">
                    Child display name
                  </span>
                  <input
                    value={childName}
                    onChange={(e) => {
                      setChildName(e.target.value);
                      if (!spaceName.trim() || spaceName === "Haley’s Creator Space") {
                        setSpaceName(`${e.target.value || "Kid"}’s Creator Space`);
                      }
                    }}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:ring-4 focus:ring-sky-300/30"
                    placeholder="Example: Haley"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-black text-slate-200">
                    Creator space name
                  </span>
                  <input
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:ring-4 focus:ring-sky-300/30"
                    placeholder="Example: Haley’s Creator Space"
                  />
                </label>

                <div>
                  <span className="text-sm font-black text-slate-200">
                    Age range
                  </span>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {["6–8", "9–11", "10–12", "13–15", "16–17", "Other"].map(
                      (age) => (
                        <button
                          key={age}
                          onClick={() => setAgeRange(age)}
                          className={`rounded-2xl px-3 py-3 text-sm font-black transition ${
                            ageRange === age
                              ? "bg-sky-300 text-slate-950"
                              : "bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/15"
                          }`}
                        >
                          {age}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <label className="block">
                  <span className="text-sm font-black text-slate-200">
                    Parent contact
                  </span>
                  <input
                    value={parentContact}
                    onChange={(e) => setParentContact(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 outline-none focus:ring-4 focus:ring-sky-300/30"
                    placeholder="Email or phone"
                  />
                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    Used for parent visibility and alerts. Not for spam.
                  </p>
                </label>

                <div>
                  <span className="text-sm font-black text-slate-200">
                    Sharing mode
                  </span>

                  <div className="mt-2 grid gap-2">
                    {[
                      ["private", "Private by default"],
                      ["family", "Family link after approval"],
                      ["showcase", "Public showcase after approval"],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSharingMode(key as SharingMode)}
                        className={`rounded-2xl p-4 text-left transition ${
                          sharingMode === key
                            ? "bg-emerald-300 text-slate-950"
                            : "bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/15"
                        }`}
                      >
                        <p className="font-black">{label}</p>
                        <p className="mt-1 text-xs font-bold opacity-80">
                          {privacyCopy[key as SharingMode]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-4">
                  <p className="text-sm font-black text-emerald-200">
                    Predator Shield starts active
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-300">
                    The creator space begins protected, private, and parent-visible.
                  </p>
                </div>

                <button
                  onClick={startSpace}
                  disabled={!childName.trim() || !spaceName.trim()}
                  className="w-full rounded-2xl bg-white px-6 py-4 text-base font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  🚀 Start Protected Creator Space
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
            Operating model
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-2xl">1</p>
              <h3 className="mt-2 font-black">Parent creates</h3>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                The guardian opens the safe space first.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-2xl">2</p>
              <h3 className="mt-2 font-black">Child builds</h3>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                Ideas, drawings, clips, and projects become real records.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-2xl">3</p>
              <h3 className="mt-2 font-black">System protects</h3>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                Predator Shield quietly watches for risk.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-2xl">4</p>
              <h3 className="mt-2 font-black">Proof follows</h3>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                The child’s creative timeline grows with them.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}