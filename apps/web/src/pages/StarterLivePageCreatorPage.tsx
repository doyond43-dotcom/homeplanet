import { useMemo, useState } from "react";
import { getSupabase } from "../lib/supabase";

type VibeKey = "blue" | "emerald" | "sunset" | "midnight";
type BlockType = "whoWeAre" | "contactInfo" | "pricingNote" | "servicePills" | "livePhotoWall" | "localNote" | "paymentBlock" | "bookNow";

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
    ring: "ring-blue-400/60",
  },
  emerald: {
    name: "Emerald",
    accent: "from-emerald-500 to-green-400",
    primary: "bg-emerald-500",
    soft: "border-emerald-400/20 bg-emerald-500/10",
    text: "text-emerald-100",
    location: "text-emerald-300",
    ring: "ring-emerald-400/60",
  },
  sunset: {
    name: "Sunset Red",
    accent: "from-rose-500 to-orange-400",
    primary: "bg-rose-500",
    soft: "border-rose-400/20 bg-rose-500/10",
    text: "text-rose-100",
    location: "text-rose-300",
    ring: "ring-rose-400/60",
  },
  midnight: {
    name: "Midnight",
    accent: "from-slate-700 to-slate-900",
    primary: "bg-slate-700",
    soft: "border-slate-400/20 bg-slate-500/10",
    text: "text-slate-100",
    location: "text-slate-300",
    ring: "ring-slate-300/50",
  },
};

const defaultPhotos = [
  "/images/sebastian-softwash-hero.jpg",
  "/images/sebastian-softwash-action-1.jpg",
  "/images/sebastian-softwash-action-2.jpg",
];

const availableBlocks: LiveBlock[] = [
  { id: "whoWeAre", type: "whoWeAre", label: "Who We Are" },
  { id: "contactInfo", type: "contactInfo", label: "Contact Info" },
  { id: "pricingNote", type: "pricingNote", label: "Pricing Note" },
  { id: "servicePills", type: "servicePills", label: "Service Pills" },
  { id: "livePhotoWall", type: "livePhotoWall", label: "Live Photo Wall" },
  { id: "localNote", type: "localNote", label: "Local Note" },
  { id: "paymentBlock", type: "paymentBlock", label: "Payment Link" },
];

export default function StarterLivePageCreatorPage() {
  const [vibe, setVibe] = useState<VibeKey>("blue");
  const [activeBlockId, setActiveBlockId] = useState("whoWeAre");

  const [name, setName] = useState("Sebastian Softwash");
  const [city, setCity] = useState("Okeechobee, Florida");
  const [service, setService] = useState("Summer pressure washing jobs");
  const [phone, setPhone] = useState("863-532-0683");

  const [slug, setSlug] = useState("sebastian-softwash");

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

  const [localNoteTitle, setLocalNoteTitle] = useState("Local Note");
  const [localNoteText, setLocalNoteText] = useState(
    "Trying to stay productive this summer, work hard, save money, and help local families out at the same time."
  );

  const [paymentTitle, setPaymentTitle] = useState("Payment Link");
  const [paymentPrice, setPaymentPrice] = useState("$0");
  const [paymentNote, setPaymentNote] = useState("After we agree on the price, you can pay here.");
  const [paymentUrl, setPaymentUrl] = useState("");

  const [blocks, setBlocks] = useState<LiveBlock[]>(availableBlocks);
  const [heroPhoto, setHeroPhoto] = useState(defaultPhotos[0]);
  const [wallPhotos, setWallPhotos] = useState<string[]>(defaultPhotos);

  const active = vibes[vibe];

  function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read image file."));
      }
    };

    reader.onerror = () => reject(reader.error || new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

async function handleHeroUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  setHeroPhoto(await fileToDataUrl(file));

  event.target.value = "";
}

  async function handleWallUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  const newPhotos = await Promise.all(files.map(fileToDataUrl));
  setWallPhotos((current) => [...current, ...newPhotos].slice(0, 6));

  event.target.value = "";
}
  const selectedBlock = blocks.find((block) => block.id === activeBlockId);

  
  const cleanPhone = phone.replace(/\D/g, "");
  const smsPhone = cleanPhone.length === 10 ? `+1${cleanPhone}` : `+${cleanPhone}`;
  const requestBody = encodeURIComponent(
    `Hey, I saw ${name}'s live page and wanted to request work. I can send a photo now.`
  );
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
    if (activeBlockId === id) {
      const next = blocks.find((block) => block.id !== id);
      setActiveBlockId(next?.id || "");
    }
  }

  function addBlock(block: LiveBlock) {
    setBlocks((current) => {
      if (current.some((item) => item.id === block.id)) return current;
      return [...current, block];
    });
    setActiveBlockId(block.id);
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

  function previewWrap(block: LiveBlock, children: React.ReactNode) {
    const isActive = activeBlockId === block.id;

    return (
      <div
        key={block.id}
        onClick={() => setActiveBlockId(block.id)}
        className={`cursor-pointer rounded-[1.75rem] transition ${isActive ? `ring-2 ${active.ring} ring-offset-2 ring-offset-[#07101d]` : "hover:ring-1 hover:ring-white/20"}`}
      >
        {children}
      </div>
    );
  }

  function renderPreviewBlock(block: LiveBlock) {
    if (block.type === "whoWeAre") {
      return previewWrap(
        block,
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Who We Are
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{whoWeAre}</p>
        </div>
      );
    }

    if (block.type === "pricingNote") {
      return previewWrap(
        block,
        <div className={`rounded-[1.5rem] border ${active.soft} p-4`}>
          <p className={`text-sm font-black ${active.text}`}>{pricingTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{pricingText}</p>
        </div>
      );
    }

    if (block.type === "servicePills") {
      return previewWrap(
        block,
        <div className="rounded-[1.5rem] p-3">          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">            Service Pills
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {servicePills.map((item) => (
              <div
                key={item}
                className={`rounded-[1.2rem] border ${active.soft} px-3 py-4 text-center text-xs font-semibold ${active.text}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === "paymentBlock") {
      return previewWrap(
        block,
        <div className={`rounded-[1.5rem] border ${active.soft} p-4`}>
          <p className={`text-xs font-black uppercase tracking-[0.2em] ${active.location}`}>
            {paymentTitle}
          </p>
          <p className="mt-3 text-3xl font-black text-white">{paymentPrice}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{paymentNote}</p>
          <div className="mt-4 flex h-12 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
            Pay Now
          </div>
        </div>
      );
    }

    if (block.type === "localNote") {
      return previewWrap(
        block,
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            {localNoteTitle}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{localNoteText}</p>
        </div>
      );
    }

    if (block.type === "livePhotoWall") {
      return previewWrap(
        block,
        <div className="rounded-[1.5rem]">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Live Photo Wall
          </p>
          <div className="grid grid-cols-2 gap-3">
            {wallPhotos.map((image) => (
              <div key={image} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
                <img src={image} alt="live wall" className="h-44 w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return previewWrap(
      block,
      <a href={`sms:${smsPhone}?&body=${requestBody}`} className="flex h-16 w-full items-center justify-between rounded-[1.6rem] bg-white px-6 text-left text-black">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Ready?
          </p>
          <p className="mt-1 text-lg font-black">Request Work</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
          ?
        </div>
      </a>
    );
  }
  async function launchLivePage() {
    const cleanSlug =
      slug
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "starter-live-page";

    const pageData = {
      name,
      city,
      service,
      phone,
      whoWeAre,
      pricingTitle,
      pricingText,
      localNoteTitle,
      localNoteText,
      paymentTitle,
      paymentPrice,
      paymentNote,
      paymentUrl,
      services: servicePills,
      heroPhoto,
      wallPhotos,
      vibe,
      blocks: blocks.filter((block) => block.type !== "bookNow"),
    };

    const supabase = getSupabase();

    const { error } = await supabase.from("starter_live_pages").upsert(
      {
        slug: cleanSlug,
        page_data: pageData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error("[starter_live_pages] save error:", error);
      alert(`Could not launch live page: ${error.message}`);
      return;
    }

    window.location.href = `/planet/starter/${cleanSlug}`;
  }


  function renderSettings() {
    if (!selectedBlock) {
      return (
        <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-400">
          Select a Live Block to edit it.
        </p>
      );
    }

    if (selectedBlock.type === "whoWeAre") {
      return (
        <div className="space-y-3">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <input value={service} onChange={(event) => setService(event.target.value)} placeholder="What do you do?" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />

          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Live Page Slug
            </p>

            <div className="flex items-center rounded-2xl border border-white/10 bg-black/40 px-4">
              <span className="text-xs text-slate-500">
                /planet/starter/
              </span>

              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="your-business-name"
                className="h-12 flex-1 bg-transparent px-2 text-sm outline-none"
              />
            </div>
          </div>
          <textarea value={whoWeAre} onChange={(event) => setWhoWeAre(event.target.value)} rows={4} placeholder="Who We Are" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
        </div>
      );
    }

    if (selectedBlock.type === "contactInfo") {
      return (
        <div className="space-y-3">
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone number"
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none"
          />

          <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed text-slate-400">
            This number powers Message, Call, and Request Work on the launched live page.
          </p>
        </div>
      );
    }

    if (selectedBlock.type === "pricingNote") {
      return (
        <div className="space-y-3">
          <input value={pricingTitle} onChange={(event) => setPricingTitle(event.target.value)} placeholder="Pricing note title" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <textarea value={pricingText} onChange={(event) => setPricingText(event.target.value)} rows={4} placeholder="Pricing note text" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
        </div>
      );
    }

    if (selectedBlock.type === "servicePills") {
      return (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-slate-400">
            Separate each service with a comma. HomePlanet keeps the pills clean.
          </p>
          <textarea value={servicesText} onChange={(event) => setServicesText(event.target.value)} rows={4} placeholder="Driveways, Patios, Sidewalks" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
        </div>
      );
    }

    if (selectedBlock.type === "paymentBlock") {
      return (
        <div className="space-y-3">
          <input value={paymentTitle} onChange={(event) => setPaymentTitle(event.target.value)} placeholder="Payment title" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <input value={paymentPrice} onChange={(event) => setPaymentPrice(event.target.value)} placeholder="$75" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <textarea value={paymentNote} onChange={(event) => setPaymentNote(event.target.value)} rows={3} placeholder="Payment note" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
          <input value={paymentUrl} onChange={(event) => setPaymentUrl(event.target.value)} placeholder="Payment link: Cash App, Venmo, Square, Stripe..." className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed text-slate-400">
            Keep this simple. Use a payment link they already have. Full invoice tracking belongs in Gold.
          </p>
        </div>
      );
    }

    if (selectedBlock.type === "localNote") {
      return (
        <div className="space-y-3">
          <input value={localNoteTitle} onChange={(event) => setLocalNoteTitle(event.target.value)} placeholder="Local Note title" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
          <textarea value={localNoteText} onChange={(event) => setLocalNoteText(event.target.value)} rows={4} placeholder="Write a quick local note" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none" />
          <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed text-slate-400">
            Use this for a human note, local context, summer goal, family-owned message, or quick background.
          </p>
        </div>
      );
    }

    if (selectedBlock.type === "livePhotoWall") {
      return (
        <div className="space-y-3">
          <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-slate-400">
            Add photos to the Live Photo Wall. The hero photo is controlled from the Photos card above.
          </p>

          <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 text-sm font-semibold text-slate-300">
            Add Photos to Photo Wall
            <input type="file" accept="image/*" multiple onChange={handleWallUpload} className="hidden" />
          </label>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none" />
        <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-slate-400">
          This number powers Message, Call, and Request Work on the launched live page.
        </p>
      </div>
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
                Click a Live Block on the left or directly inside the preview.
                Edit the words. HomePlanet protects the design.
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
                      vibe === key ? "border-white/40 bg-white/10" : "border-white/10 bg-black/40 hover:border-white/20"
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
                  <p className="font-semibold">Live Blocks</p>
                  <p className="text-sm text-slate-400">Click a block to edit it. Reorder anytime.</p>
                </div>
              </div>

              <div className="space-y-2">
                {blocks.map((block) => {
                  const isActive = activeBlockId === block.id;

                  return (
                    <div
                      key={block.id}
                      onClick={() => setActiveBlockId(block.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition ${
                        isActive ? `border-white/30 bg-white/10 ring-1 ${active.ring}` : "border-white/10 bg-black/40 hover:border-white/20"
                      }`}
                    >
                      <p className="text-sm font-bold">{block.label}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={(event) => { event.stopPropagation(); moveBlock(block.id, "up"); }} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                          Up
                        </button>
                        <button onClick={(event) => { event.stopPropagation(); moveBlock(block.id, "down"); }} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                          Down
                        </button>
                        <button onClick={(event) => { event.stopPropagation(); removeBlock(block.id); }} className="rounded-full border border-red-400/20 px-3 py-1 text-xs text-red-200">
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {availableBlocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => addBlock(block)}
                    className="rounded-2xl border border-dashed border-white/20 px-3 py-3 text-xs font-bold text-slate-300 hover:border-white/40"
                  >
                    + {block.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-black">
                  P
                </div>
                <div>
                  <p className="font-semibold">Photos</p>
                  <p className="text-sm text-slate-400">Upload the hero photo and live photo wall.</p>
                </div>
              </div>

              <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 text-sm font-semibold text-slate-300">
                Upload Hero Photo
                <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
              </label>

              <label className="flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 text-sm font-semibold text-slate-300">
                Upload Photo Wall
                <input type="file" accept="image/*" multiple onChange={handleWallUpload} className="hidden" />
              </label>
            </div>


            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 font-black">
                  3
                </div>
                <div>
                  <p className="font-semibold">
                    {selectedBlock ? `${selectedBlock.label} Settings` : "Live Block Settings"}
                  </p>
                  <p className="text-sm text-slate-400">Focused controls for the selected block.</p>
                </div>
              </div>

              {renderSettings()}
            </div>

            <button onClick={launchLivePage} className="flex h-16 w-full items-center justify-center rounded-[1.6rem] bg-white text-lg font-black text-black">Launch Live Page</button>
          </div>
        </div>

        <div className="w-full lg:w-[58%]">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/40">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-sm font-medium text-slate-400">Interactive Live Preview</p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07101d]">
                <div className="relative overflow-hidden">
                  <img src={heroPhoto} alt="Hero" className="h-[360px] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className={`text-sm uppercase tracking-[0.3em] ${active.location}`}>{city}</p>
                    <h2 className="mt-3 text-4xl font-black leading-tight">{name || "Your Live Page"}</h2>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-200">{service}</p>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <a href={`sms:${smsPhone}`} className={`flex h-14 items-center justify-center rounded-2xl ${active.primary} font-bold`}>
                      Message
                    </a>
                    <a href={`tel:${smsPhone}`} className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] font-bold">
                      Call
                    </a>
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
            Live Blocks v3: click blocks in the editor or preview to edit them.
          </p>
        </div>
      </div>
    </div>
  );
}

























