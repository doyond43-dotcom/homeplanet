import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type SafariMoment = {
  id: string;
  animalSlug: string;
  animalName: string;
  animalType: string;
  emoji: string;
  title: string;
  createdAt: string;
  boardSlug: string;
  source: "qr-scan";
  unlocked: boolean;
  photoDataUrl?: string;
  photoAddedAt?: string;
};

function formatStamp(date: Date) {
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const maxWidth = 900;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");

        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not compress image."));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL("image/jpeg", 0.72);
        resolve(compressed);
      };

      img.onerror = () => reject(new Error("Could not load image."));
      img.src = String(reader.result);
    };

    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export default function SafariMomentPage() {
  const { momentId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [moment, setMoment] = useState<SafariMoment | null>(null);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (!momentId) return;

    const raw = localStorage.getItem(`hp:safari-moment:${momentId}`);
    if (!raw) return;

    try {
      setMoment(JSON.parse(raw));
    } catch {}
  }, [momentId]);

  function saveMoment(updated: SafariMoment) {
    localStorage.setItem(`hp:safari-moment:${updated.id}`, JSON.stringify(updated));

    const rawFeed = localStorage.getItem("hp:safari-feed") || "[]";

    try {
      const feed = JSON.parse(rawFeed) as SafariMoment[];

      const exists = feed.some((item) => item.id === updated.id);
      const nextFeed = exists
        ? feed.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
        : [updated, ...feed];

      localStorage.setItem("hp:safari-feed", JSON.stringify(nextFeed));
    } catch {
      localStorage.setItem("hp:safari-feed", JSON.stringify([updated]));
    }

    setMoment(updated);
  }

  function handleUnlock() {
    if (!moment) return;

    const updated = { ...moment, unlocked: true };
    saveMoment(updated);

    setJustUnlocked(true);
    window.setTimeout(() => setJustUnlocked(false), 2200);
  }

  async function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!moment) return;

    setPhotoError("");

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressedPhoto = await compressImage(file);

      const updated: SafariMoment = {
        ...moment,
        unlocked: true,
        photoDataUrl: compressedPhoto,
        photoAddedAt: formatStamp(new Date()),
      };

      saveMoment(updated);

      setJustUnlocked(true);
      window.setTimeout(() => setJustUnlocked(false), 2200);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setPhotoError("Photo did not attach. Try a smaller image or screenshot.");
    }
  }

  if (!moment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07120d] text-white">
        <p className="text-lg">Loading moment...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07120d] px-4 py-6 text-white">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl md:p-10">
        {justUnlocked && (
          <div className="mb-5 rounded-2xl border border-emerald-300/30 bg-emerald-400/15 px-5 py-4 text-center font-black text-emerald-200">
            Photo Memory Updated 🎉
          </div>
        )}

        {photoError && (
          <div className="mb-5 rounded-2xl border border-red-300/30 bg-red-400/10 px-5 py-4 text-center font-bold text-red-200">
            {photoError}
          </div>
        )}

        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
          Safari Moment Captured
        </p>

        <h1 className="mt-2 text-4xl font-black md:text-5xl">
          You met {moment.animalName} {moment.emoji}
        </h1>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-widest text-white/50">
            Verified Interaction
          </p>
          <p className="mt-2 text-lg font-bold text-emerald-300">
            {moment.createdAt}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm leading-6 text-white/70">
            This moment was captured live at the exhibit. No app. No account.
            This is your proof of interaction with {moment.animalName}.
          </p>
        </div>

        {moment.unlocked && (
          <div className="mt-6 rounded-[1.75rem] border border-emerald-300/20 bg-emerald-400/[0.08] p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200/70">
                  Photo Memory Ready
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  Staff photo attached
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                  This paid memory add-on is tied directly to the timestamped
                  animal interaction.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/25 p-4 text-center">
                {moment.photoDataUrl ? (
                  <img
                    src={moment.photoDataUrl}
                    alt={`${moment.animalName} memory`}
                    className="h-32 w-32 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="text-6xl">{moment.emoji}</div>
                )}

                <p className="mt-2 text-sm font-black">
                  {moment.animalName} Memory
                </p>
                <p className="mt-1 text-xs text-white/45">
                  {moment.photoAddedAt ? `Added ${moment.photoAddedAt}` : "Unlocked add-on"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-black">Proof stays connected</p>
                <p className="mt-1 text-xs text-white/50">
                  Memory is tied to this exact visit moment.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-black">Guest can save page</p>
                <p className="mt-1 text-xs text-white/50">
                  No app or account needed to return to it.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-black">Upsell is simple</p>
                <p className="mt-1 text-xs text-white/50">
                  Photo, video, plush, feeding add-on, or VIP moment.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-black transition hover:bg-white/20"
            >
              {moment.photoDataUrl ? "Replace Photo Memory" : "Attach Photo Memory"}
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            onClick={() => navigate(`/planet/live/${moment.boardSlug}`)}
            className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-bold transition hover:bg-white/20"
          >
            View Live Safari Board
          </button>

          {!moment.unlocked ? (
            <button
              onClick={handleUnlock}
              className="rounded-2xl bg-white px-6 py-4 font-black text-[#07120d] shadow-xl"
            >
              Unlock Photo Memory ($5)
            </button>
          ) : (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-6 py-4 text-center font-bold text-emerald-300">
              Photo Memory Unlocked ✓
            </div>
          )}
        </div>

        <div className="mt-10 text-center text-xs text-white/40">
          HomePlanet Presence • Proof of Experience • No Tracking
        </div>
      </section>
    </main>
  );
}