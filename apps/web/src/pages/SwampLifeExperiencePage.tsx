import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { Camera, Fish, MapPin, MessageCircle, Phone, ShipWheel, Sunset, Waves } from "lucide-react";

type RidePhoto = { id: string; image?: string; image_url?: string; caption: string };

const STORAGE_KEY = "hp:swamp-life:photos";

const starterPhotos: RidePhoto[] = [
  {
    id: "1",
    image: "/images/swamp-life-airboat-family-ride-action.jpg",
    caption: "Real airboat ride across Lake Okeechobee",
  },
  {
    id: "2",
    image: "/images/swamp-life-family-captain-group-photo.jpg",
    caption: "Family memories with Captain D",
  },
  {
    id: "3",
    image: "/images/swamp-life-hidden-florida-waterfall.jpg",
    caption: "Hidden Florida adventure moments",
  },
  {
    id: "4",
    image: "/images/swamp-life-holy-smokes-airboat-moment.jpg",
    caption: "Summer airboat memories",
  },
  {
    id: "5",
    image: "/images/swamp-life-kid-airboat-adventure.jpg",
    caption: "Exploring the marsh like a local",
  },
  {
    id: "6",
    image: "/images/swamp-life-airboat-okeechobee-marsh.jpg",
    caption: "Classic Florida swamp life",
  },
];

const quickCards = [
  { icon: Sunset, title: "Sunset Rides" },
  { icon: Fish, title: "Wildlife Moments" },
  { icon: Waves, title: "Lake Adventures" },
  { icon: ShipWheel, title: "Local Guided Tours" },
];

export default function SwampLifeExperiencePage() {
  const [photos, setPhotos] = useState<RidePhoto[]>(starterPhotos);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<RidePhoto | null>(null);

  useEffect(() => {
    loadMoments();
  }, []);

  async function loadMoments() {
    const { data, error } = await supabase
      .from("swamp_life_moments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPhotos([...(data || []), ...starterPhotos]);
  }

  async function uploadRidePhoto(file: File) {
    try {
      setUploading(true);

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const filePath = `ride-photos/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("swamp-life-moments")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/jpeg",
        });

      if (uploadError) {
        console.error("Swamp Life upload error:", uploadError);
        alert(`Upload failed: ${uploadError.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("swamp-life-moments")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase
        .from("swamp_life_moments")
        .insert({
          image_url: imageUrl,
          caption: "Swamp Life ride memory",
        });

      if (insertError) {
        console.error("Swamp Life insert error:", insertError);
        alert(`Photo uploaded, but wall save failed: ${insertError.message}`);
        return;
      }

      await loadMoments();
    } finally {
      setUploading(false);
    }
  }

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadRidePhoto(file);
    event.target.value = "";
  };
  const getPhotoUrl = (photo: RidePhoto) => photo.image_url || photo.image || "";

  async function sharePhoto(photo: RidePhoto) {
    const url = getPhotoUrl(photo);
    const title = photo.caption || "Swamp Life ride memory";

    if (navigator.share) {
      await navigator.share({ title, text: title, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    alert("Photo link copied.");
  }

  async function deletePhoto(photo: RidePhoto) {
    if (!photo.image_url) return;

    const confirmed = window.confirm("Delete this ride photo from the wall?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("swamp_life_moments")
      .delete()
      .eq("id", photo.id);

    if (error) {
      console.error("Swamp Life delete error:", error);
      alert(`Delete failed: ${error.message}`);
      return;
    }

    setSelectedPhoto(null);
    await loadMoments();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative h-[760px] overflow-hidden md:h-[720px]">
        <img
          src="/images/swamp-life-airboat-hero-clean-hd.jpg.png"
          alt="Swamp Life Airboat Tours"
          className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
        />

        
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute left-5 top-36 z-10 max-w-md md:left-[calc((100vw-1100px)/2)] md:top-36">
          <div className="mb-5 inline-flex rounded-full bg-emerald-500/80 px-4 py-1.5 text-sm font-bold text-emerald-950 shadow-lg">
            Lake Okeechobee Experience
          </div>

          <h1 className="text-5xl font-black leading-[0.95] drop-shadow-xl md:text-6xl">
            Swamp Life
            <br />
            Airboat Tours
          </h1>

          <p className="mt-6 max-w-sm text-base font-medium leading-relaxed text-white/90 drop-shadow">
            Explore Eagle Bay, Lemkin Creek, and Lake Okeechobee like a local.
          </p>

          <div className="mt-7 grid max-w-md grid-cols-2 gap-4">
            <button onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })} className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-black shadow-xl">
              Book Ride
            </button>

            <a href="tel:15615126356" className="flex items-center justify-center gap-2 rounded-2xl bg-black/45 px-5 py-4 text-sm font-bold ring-1 ring-white/25 backdrop-blur">
              <Phone size={17} /> Call
            </a>

            <a href="sms:15615126356" className="flex items-center justify-center gap-2 rounded-2xl bg-black/45 px-5 py-4 text-sm font-bold ring-1 ring-white/25 backdrop-blur">
              <MessageCircle size={17} /> Message
            </a>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-500/35 px-5 py-4 text-sm font-black text-emerald-200 ring-1 ring-emerald-400/40 backdrop-blur">
              <Camera size={17} /> Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
            </label>
          </div>
        </div>

        <div className="absolute bottom-[-48px] left-1/2 z-20 grid w-[min(92vw,900px)] -translate-x-1/2 grid-cols-2 gap-4 md:grid-cols-4">
          {quickCards.map((card) => {
            const Icon = card.icon;
            const getPhotoUrl = (photo: RidePhoto) => photo.image_url || photo.image || "";

  async function sharePhoto(photo: RidePhoto) {
    const url = getPhotoUrl(photo);
    const title = photo.caption || "Swamp Life ride memory";

    if (navigator.share) {
      await navigator.share({ title, text: title, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    alert("Photo link copied.");
  }

  async function deletePhoto(photo: RidePhoto) {
    if (!photo.image_url) return;

    const confirmed = window.confirm("Delete this ride photo from the wall?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("swamp_life_moments")
      .delete()
      .eq("id", photo.id);

    if (error) {
      console.error("Swamp Life delete error:", error);
      alert(`Delete failed: ${error.message}`);
      return;
    }

    setSelectedPhoto(null);
    await loadMoments();
  }

  return (
              <div key={card.title} className="rounded-3xl border border-white/15 bg-zinc-950/95 p-5 shadow-2xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                  <Icon size={22} />
                </div>
                <h3 className="text-sm font-black">{card.title}</h3>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pt-20">
        <div className="rounded-3xl border border-white/15 bg-zinc-950 p-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Captain Capture</p>
              <h2 className="mt-3 text-3xl font-black">Capture Ride Moments</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75">
                Captain-controlled experience captures. One tap. Sunset moments, fish catches, wildlife sightings, and family memories uploaded directly to the ride wall.
              </p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
              <Camera />
            </div>
          </div>

          <label className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-black text-black">
            <Camera size={18} /> {uploading ? "Uploading..." : "Upload Ride Photo"}
            <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Experience Wall</p>
        <h2 className="mt-2 text-3xl font-black">Ride Memories</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedPhoto(photo)}
              className="overflow-hidden rounded-3xl border border-white/15 bg-zinc-950 text-left transition hover:border-emerald-400/60"
            >
              <img src={getPhotoUrl(photo)} alt={photo.caption || "Swamp Life ride memory"} className="h-56 w-full object-cover brightness-100 contrast-100 saturate-100" />
              <div className="p-4">
                <p className="text-sm font-bold text-white/85">{photo.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="booking" className="mx-auto max-w-4xl px-5 pb-12">
        <div className="rounded-3xl border border-white/15 bg-zinc-950 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Quick Booking</p>
          <h2 className="mt-2 text-3xl font-black">Book Your Ride</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <input placeholder="Your name" className="rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm outline-none" />
            <input placeholder="Preferred date" className="rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm outline-none" />
            <input placeholder="Group size" className="rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm outline-none" />
          </div>

          <textarea placeholder="Questions or special requests" rows={4} className="mt-3 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm outline-none" />

          <a href="sms:15615126356?body=Hey%20Swamp%20Life%2C%20I%27d%20like%20to%20book%20an%20airboat%20ride." className="mt-3 flex w-full items-center justify-center rounded-2xl bg-white px-5 py-4 text-sm font-black text-black">
            Send Booking Request
          </a>        </div>      </section>      <footer className="border-t border-white/10 px-5 py-8 text-center">
  <a
    href="/planet/get-live"
    
    className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-black"
  >
    Get Your Business Live
  </a>
</footer>

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 px-4 pb-4 md:items-center md:pb-0">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-zinc-950 shadow-2xl">
            <img src={getPhotoUrl(selectedPhoto)} alt={selectedPhoto.caption || "Swamp Life ride memory"} className="h-72 w-full object-cover" />
            <div className="p-5">
              <p className="text-sm font-bold text-white/85">{selectedPhoto.caption || "Swamp Life ride memory"}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={() => sharePhoto(selectedPhoto)} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-black">
                  Share
                </button>

                <a href={`sms:?body=${encodeURIComponent(getPhotoUrl(selectedPhoto))}`} className="flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-black text-black">
                  Text
                </a>

                <button onClick={() => deletePhoto(selectedPhoto)} disabled={!selectedPhoto.image_url} className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35">Delete</button>

                <button onClick={() => setSelectedPhoto(null)} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <a href="https://maps.google.com" className="fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-black shadow-2xl">
        <MapPin />
      </a>
    </main>
  );
}























