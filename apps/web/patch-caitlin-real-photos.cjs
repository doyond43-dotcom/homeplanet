const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-real-saved-photos", raw);

// Add saved photo type
if (!raw.includes("type CleaningPhoto =")) {
  raw = raw.replace(
    /(type Signal = \{[\s\S]*?\};)/,
    `$1

type CleaningPhoto = {
  id: string;
  request_id: string;
  business_slug: string;
  photo_type: "before" | "after";
  file_path: string;
  public_url: string;
  created_at: string;
};`
  );
}

// Add photo state
if (!raw.includes("const [photos, setPhotos]")) {
  raw = raw.replace(
    'const [showHeaderDetails, setShowHeaderDetails] = useState(false);',
    `const [showHeaderDetails, setShowHeaderDetails] = useState(false);
  const [photos, setPhotos] = useState<CleaningPhoto[]>([]);
  const [uploadingPhotoType, setUploadingPhotoType] = useState<"before" | "after" | null>(null);`
  );
}

// Add real photo functions before component return
if (!raw.includes("async function handlePhotoUpload")) {
  raw = raw.replace(
    /\n\s*return \(/,
    `

  useEffect(() => {
    if (!selected?.id) {
      setPhotos([]);
      return;
    }

    let alive = true;

    async function loadPhotos() {
      const { data, error } = await supabase
        .from("cleaning_request_photos")
        .select("*")
        .eq("request_id", selected.id)
        .eq("business_slug", "only-the-essentials")
        .order("created_at", { ascending: false });

      if (!alive) return;

      if (error) {
        console.error("Could not load cleaning request photos:", error);
        setPhotos([]);
        return;
      }

      setPhotos((data || []) as CleaningPhoto[]);
    }

    loadPhotos();

    return () => {
      alive = false;
    };
  }, [selected?.id]);

  async function handlePhotoUpload(photoType: "before" | "after", files: FileList | null) {
    if (!selected || !files || files.length === 0) return;

    setUploadingPhotoType(photoType);

    try {
      const savedPhotos: CleaningPhoto[] = [];

      for (const file of Array.from(files)) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const filePath = selected.id + "/" + photoType + "/" + Date.now() + "-" + safeName;

        const upload = await supabase.storage
          .from("cleaning-request-photos")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (upload.error) throw upload.error;

        const publicUrl = supabase.storage
          .from("cleaning-request-photos")
          .getPublicUrl(filePath).data.publicUrl;

        const inserted = await supabase
          .from("cleaning_request_photos")
          .insert({
            request_id: selected.id,
            business_slug: "only-the-essentials",
            photo_type: photoType,
            file_path: filePath,
            public_url: publicUrl,
          })
          .select("*")
          .single();

        if (inserted.error) throw inserted.error;
        savedPhotos.push(inserted.data as CleaningPhoto);
      }

      setPhotos((current) => [...savedPhotos, ...current]);
    } catch (error) {
      console.error("Photo upload failed:", error);
      window.alert("Photo upload failed. Check console.");
    } finally {
      setUploadingPhotoType(null);
    }
  }

  async function removePhoto(photo: CleaningPhoto) {
    const confirmed = window.confirm("Remove this photo from the request?");
    if (!confirmed) return;

    const storageDelete = await supabase.storage
      .from("cleaning-request-photos")
      .remove([photo.file_path]);

    if (storageDelete.error) {
      console.error("Could not remove photo file:", storageDelete.error);
      window.alert("Could not remove photo file. Check console.");
      return;
    }

    const rowDelete = await supabase
      .from("cleaning_request_photos")
      .delete()
      .eq("id", photo.id);

    if (rowDelete.error) {
      console.error("Could not remove photo row:", rowDelete.error);
      window.alert("Photo file removed, but database row failed. Check console.");
      return;
    }

    setPhotos((current) => current.filter((item) => item.id !== photo.id));
  }

  const beforePhotos = photos.filter((photo) => photo.photo_type === "before");
  const afterPhotos = photos.filter((photo) => photo.photo_type === "after");

  return (`
  );
}

const workStart = raw.indexOf('              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">', raw.indexOf("WORK / PHOTOS"));
const paymentStart = raw.indexOf('              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">', raw.indexOf("PAYMENT"));

if (workStart === -1 || paymentStart === -1 || paymentStart <= workStart) {
  throw new Error("Could not find WORK / PHOTOS block.");
}

const workBlock = `              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
                  WORK / PHOTOS
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Work Status</span>
                    <span className="font-bold text-yellow-300">Not Started</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Before Photos</span>
                    <span className="font-bold">{beforePhotos.length ? \`\${beforePhotos.length} Saved\` : "Not Added"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">After Photos</span>
                    <span className="font-bold">{afterPhotos.length ? \`\${afterPhotos.length} Saved\` : "Not Added"}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <label className="rounded-xl border border-pink-300/25 bg-pink-400/10 py-3 text-center text-sm font-black text-pink-100">
                    {uploadingPhotoType === "before" ? "Uploading..." : "Upload Before"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        void handlePhotoUpload("before", event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <label className="rounded-xl border border-pink-300/25 bg-pink-400/10 py-3 text-center text-sm font-black text-pink-100">
                    {uploadingPhotoType === "after" ? "Uploading..." : "Upload After"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        void handlePhotoUpload("after", event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">Before Photos</p>
                    {beforePhotos.length ? (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {beforePhotos.map((photo) => (
                          <div key={photo.id} className="overflow-hidden rounded-xl border border-white/10 bg-black">
                            <img src={photo.public_url} alt="Before cleaning" className="h-28 w-full object-cover" />
                            <div className="grid grid-cols-3 gap-1 p-2 text-[10px] font-black">
                              <a href={photo.public_url} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 py-2 text-center">View</a>
                              <button type="button" onClick={() => copyText("Photo link copied", photo.public_url)} className="rounded-lg bg-white/10 py-2">Copy</button>
                              <button type="button" onClick={() => void removePhoto(photo)} className="rounded-lg bg-red-500/20 py-2 text-red-200">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 rounded-xl border border-white/10 bg-black/40 p-3 text-sm font-bold text-zinc-400">No before photos saved yet.</div>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">After Photos</p>
                    {afterPhotos.length ? (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {afterPhotos.map((photo) => (
                          <div key={photo.id} className="overflow-hidden rounded-xl border border-white/10 bg-black">
                            <img src={photo.public_url} alt="After cleaning" className="h-28 w-full object-cover" />
                            <div className="grid grid-cols-3 gap-1 p-2 text-[10px] font-black">
                              <a href={photo.public_url} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 py-2 text-center">View</a>
                              <button type="button" onClick={() => copyText("Photo link copied", photo.public_url)} className="rounded-lg bg-white/10 py-2">Copy</button>
                              <button type="button" onClick={() => void removePhoto(photo)} className="rounded-lg bg-red-500/20 py-2 text-red-200">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 rounded-xl border border-white/10 bg-black/40 p-3 text-sm font-bold text-zinc-400">No after photos saved yet.</div>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-pink-400/10 p-3 text-sm font-bold text-pink-100">
                  Next Move: Take before and after photos if needed so the job proof stays with the request.
                </div>
              </div>

`;

raw = raw.slice(0, workStart) + workBlock + raw.slice(paymentStart);

fs.writeFileSync(path, raw);
