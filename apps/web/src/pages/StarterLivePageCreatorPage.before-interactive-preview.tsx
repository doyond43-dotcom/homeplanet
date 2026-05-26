import { useMemo, useState } from "react";

type VibeKey = "blue" | "emerald" | "sunset" | "midnight";
type BlockType =
  | "whoWeAre"
  | "pricingNote"
  | "servicePills"
  | "livePhotoWall"
  | "bookNow";

type LiveBlock = {
  id: string;
  type: BlockType;
  label: string;
};

const vibes = {
  blue: {
    name: "Ocean Blue",
    accent: "from-blue-500 to-cyan-400",
    primary: "bg-blue-500",
    soft: "border-blue-400/20 bg-blue-500/10",
    text: "text-blue-100",
    location: "text-blue-300",
  },
  emerald: {
    name: "Emerald",
    accent: "from-emerald-500 to-green-400",
    primary: "bg-emerald-500",
    soft: "border-emerald-400/20 bg-emerald-500/10",
    text: "text-emerald-100",
    location: "text-emerald-300",
  },
  sunset: {
    name: "Sunset Red",
    accent: "from-rose-500 to-orange-400",
    primary: "bg-rose-500",
    soft: "border-rose-400/20 bg-rose-500/10",
    text: "text-rose-100",
    location: "text-rose-300",
  },
  midnight: {
    name: "Midnight",
    accent: "from-slate-700 to-slate-900",
    primary: "bg-slate-700",
    soft: "border-slate-400/20 bg-slate-500/10",
    text: "text-slate-100",
    location: "text-slate-300",
  },
};

const defaultPhotos = [
  "/images/sebastian-softwash-hero.jpg",
  "/images/sebastian-softwash-action-1.jpg",
  "/images/sebastian-softwash-action-2.jpg",
];

const availableBlocks: LiveBlock[] = [
  { id: "whoWeAre", type: "whoWeAre", label: "Who We Are" },
  { id: "pricingNote", type: "pricingNote", label: "Pricing Note" },
  { id: "servicePills", type: "servicePills", label: "Service Pills" },
  { id: "livePhotoWall", type: "livePhotoWall", label: "Live Photo Wall" },
  { id: "bookNow", type: "bookNow", label: "Book Now" },
];

export default function StarterLivePageCreatorPage() {
  const [vibe, setVibe] = useState<VibeKey>("blue");
  const [name, setName] = useState("Sebastian Softwash");
  const [city, setCity] = useState("Okeechobee, Florida");
  const [service, setService] = useState("Summer pressure washing jobs");
  const [phone, setPhone] = useState("863-532-0683");

  const [whoWeAre, setWhoWeAre] = useState(
    "Helping local families with driveways, sidewalks, patios, and outdoor cleanup."
  );

  const [pricingTitle, setPricingTitle] = useState("No square footage headaches.");
  const [pricingText, setPricingText] = useState(
    "Just send a photo of what you need cleaned up and I’ll give you a fair price."
  );

  const [servicesText, setServicesText] = useState(
    "Driveways, Patios, Sidewalks, Outdoor Cleanup"
  );

  const [blocks, setBlocks] = useState<LiveBlock[]>(availableBlocks);

  const active = vibes[vibe];

  const servicePills = useMemo(
    () =>
      servicesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 6),
    [servicesText]
  );

  function removeBlock(id: string) {
    setBlocks((current) => current.filter((block) => block.id !== id));
  }

  function addBlock(block: LiveBlock) {
    setBlocks((current) => {
      if (current.some((item) => item.id === block.id)) return current;
      return [...current, block];
    });
  }

  function moveBlock(id: string, direction: "up" | "down") {
    setBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      if (index === -1) return current;

      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, item);
      return copy;
    });
  }

  function renderPreviewBlock(block: LiveBlock) {
    if (block.type === "whoWeAre") {
      return (
        <div key={block.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Who We Are
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{whoWeAre}</p>
        </div>
      );
    }

    if (block.type === "pricingNote") {
      return (
        <div key={block.id} className={`rounded-[1.5rem] border ${active.soft} p-4`}>
          <p className={`text-sm font-black ${active.text}`}>{pricingTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{pricingText}</p>
        </div>
      );
    }

    if (block.type === "servicePills") {
      return (
        <div key={block.id}>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Service Pills
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {servicePills.map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-3 py-4 text-center text-xs font-semibold text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === "livePhotoWall") {
      return (
        <div key={block.id}>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Live Photo Wall
          </p>
          <div className="grid grid-cols-2 gap-3">
            {defaultPhotos.map((image) => (
              <div key={image} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
                <img src={image} alt="live wall" className="h-44 w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <button
        key={block.id}
        className="flex h-16 w-full items-center justify-between rounded-[1.6rem] bg-white px-6 text-left text-black"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Ready?
          </p>
          <p className="mt-1 text-lg font-black">Request Work</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
          →
        </div>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 lg:flex-row lg:items-start">
        <div className="w-full lg:w-[42%]">
          <div className="sticky top-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-blue-300">
                HomePlanet Creator
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                Launch your live page.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
                Build from Live Blocks. You control the words. HomePlanet keeps the page clean.
              </p>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${active.primary} font-black`}>
                  1
                </div>
                <div>
                  <p className="font-semibold">Choose your vibe</p>
                  <p className="text-sm text-slate-400">Pick the feel. The Live Blocks stay clean.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(vibes) as VibeKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setVibe(key)}
                    className={`rounded-[1.5rem] border p-3 text-left transition ${
                      vibe === key
                        ? "border-white/40 bg-white/10"
                        : "border-white/10 bg-black/40 hover:border-white/20"
                    }`}
                  >
                    <div className={`h-20 rounded-2xl bg-gradient-to-br ${vibes[key].accent}`} />
                    <p className="mt-3 font-semibold">{vibes[key].name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      Tap to preview this style.
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-black">
                  2
                </div>
                <div>
                  <p className="font-semibold">Edit Live Blocks</p>
                  <p className="text-sm text-slate-400">Add, remove, and reorder the page blocks.</p>
                </div>
              </div>

              <div className="space-y-2">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
                  >
                    <p className="text-sm font-bold">{block.label}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveBlock(block.id, "up")}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
                      >
                        Up
                      </button>
                      <button
                        onClick={() => moveBlock(block.id, "down")}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
                      >
                        Down
                      </button>
                      <button
                        onClick={() => removeBlock(block.id)}
                        className="rounded-full border border-red-400/20 px-3 py-1 text-xs text-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {availableBlocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => addBlock(block)}
                    className="rounded-2xl border border-dashed border-white/20 px-3 py-3 text-xs font-bold text-slate-300"
                  >
                    + {block.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 font-black">
                  3
                </div>
                <div>
                  <p className="font-semibold">Block Content</p>
                  <p className="text-sm text-slate-400">Tiny inputs. Clean output.</p>
                </div>
              </div>

              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
              <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
              <input value={service} onChange={(event) => setService(event.target.value)} placeholder="What do you do?" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
              <textarea value={whoWeAre} onChange={(event) => setWhoWeAre(event.target.value)} rows={3} placeholder="Who We Are" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
              <input value={servicesText} onChange={(event) => setServicesText(event.target.value)} placeholder="Service pills" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
              <input value={pricingTitle} onChange={(event) => setPricingTitle(event.target.value)} placeholder="Pricing note title" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
              <textarea value={pricingText} onChange={(event) => setPricingText(event.target.value)} rows={3} placeholder="Pricing note" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
            </div>

            <button className="flex h-16 w-full items-center justify-center rounded-[1.6rem] bg-white text-lg font-black text-black">
              Launch Live Page
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[58%]">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/40">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-sm font-medium text-slate-400">Live Preview</p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101d]">
                <div className="relative overflow-hidden">
                  <img src="/images/sebastian-softwash-hero.jpg" alt="Hero" className="h-[360px] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className={`text-sm uppercase tracking-[0.3em] ${active.location}`}>{city}</p>
                    <h2 className="mt-3 text-4xl font-black leading-tight">{name || "Your Live Page"}</h2>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-200">{service}</p>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <button className={`flex h-14 items-center justify-center rounded-2xl ${active.primary} font-bold`}>
                      Message
                    </button>
                    <button className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] font-bold">
                      Call
                    </button>
                  </div>

                  {blocks.map((block) => renderPreviewBlock(block))}

                  <div className="mt-10 border-t border-white/10 pt-6 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      Fueled by HomePlanet
                    </p>
                    <button className="mt-3 inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300">
                      Launch your own live page.
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Live Blocks v2: add, remove, reorder, and edit core blocks.
          </p>
        </div>
      </div>
    </div>
  );
}