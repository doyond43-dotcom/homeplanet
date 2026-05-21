export default function StarterLivePageCreatorPage() {
  const vibeCards = [
    { name: "Ocean Blue", accent: "from-blue-500 to-cyan-400", description: "Clean, modern, trustworthy" },
    { name: "Emerald", accent: "from-emerald-500 to-green-400", description: "Fresh, energetic, premium" },
    { name: "Sunset Red", accent: "from-rose-500 to-orange-400", description: "Bold, emotional, creator-focused" },
    { name: "Midnight", accent: "from-slate-700 to-slate-900", description: "Minimal, dark, cinematic" },
  ];

  const previewImages = [
    "/images/sebastian-softwash-hero.jpg",
    "/images/sebastian-softwash-action-1.jpg",
    "/images/sebastian-softwash-action-2.jpg",
  ];

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 lg:flex-row lg:items-start">
        <div className="w-full lg:w-[42%]">
          <div className="sticky top-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-blue-300">HomePlanet Creator</p>
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                Launch your live page.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
                No complicated website builders. No corporate setup process. Just upload your photos,
                add your info, and launch a clean live page that feels real.
              </p>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-black">1</div>
                <div>
                  <p className="font-semibold">Choose your vibe</p>
                  <p className="text-sm text-slate-400">Pick the look and feel for your live page.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {vibeCards.map((card) => (
                  <button key={card.name} className="rounded-[1.5rem] border border-white/10 bg-black/40 p-3 text-left">
                    <div className={`h-20 rounded-2xl bg-gradient-to-br ${card.accent}`} />
                    <p className="mt-3 font-semibold">{card.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{card.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-black">2</div>
                <div>
                  <p className="font-semibold">Upload your photos</p>
                  <p className="text-sm text-slate-400">Hero image + a few work photos.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {previewImages.map((image) => (
                  <div key={image} className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-black">
                    <img src={image} alt="preview" className="h-32 w-full object-cover" />
                  </div>
                ))}
              </div>

              <button className="flex h-14 w-full items-center justify-center rounded-[1.25rem] border border-dashed border-white/20 bg-black/30 text-sm font-semibold text-slate-300">
                Upload Photos
              </button>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 font-black">3</div>
                <div>
                  <p className="font-semibold">Add your details</p>
                  <p className="text-sm text-slate-400">Keep it simple and personal.</p>
                </div>
              </div>

              <div className="space-y-3">
                <input placeholder="Your name" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none placeholder:text-slate-500" />
                <input placeholder="What do you do?" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none placeholder:text-slate-500" />
                <input placeholder="Phone number" className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm outline-none placeholder:text-slate-500" />
                <textarea rows={4} placeholder="Short intro" className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm outline-none placeholder:text-slate-500" />
              </div>
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
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Okeechobee, Florida</p>
                    <h2 className="mt-3 text-4xl font-black leading-tight">Sebastian Softwash</h2>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-200">
                      Summer pressure washing jobs around Okeechobee. Driveways, sidewalks, patios, and outdoor cleanup.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex h-14 items-center justify-center rounded-2xl bg-blue-500 font-bold">Message</button>
                    <button className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] font-bold">Call</button>
                  </div>

                  <div className="rounded-[1.5rem] border border-blue-400/20 bg-blue-500/10 p-4">
                    <p className="text-sm font-black text-blue-100">No square footage headaches.</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                      Just send a photo of what you need cleaned up and I’ll give you a fair price.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {["Driveways", "Patios", "Sidewalks", "Outdoor Cleanup"].map((item) => (
                      <div key={item} className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-3 py-4 text-center text-xs font-semibold text-slate-200">
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {previewImages.map((image) => (
                      <div key={image} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
                        <img src={image} alt="gallery" className="h-44 w-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <button className="flex h-16 w-full items-center justify-between rounded-[1.6rem] bg-white px-6 text-left text-black">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Ready to book?</p>
                      <p className="mt-1 text-lg font-black">Request a Wash</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">→</div>
                  </button>

                  <div className="mt-10 border-t border-white/10 pt-6 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Fueled by HomePlanet</p>
                    <button className="mt-3 inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300">
                      Launch your own live page.
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
