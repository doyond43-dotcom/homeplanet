const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-restore-real-photo-card", raw);

const workStart = raw.indexOf('              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">', raw.indexOf("WORK / PHOTOS"));
const reviewsStart = raw.indexOf('              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">', raw.indexOf("REVIEWS"));

if (workStart === -1 || reviewsStart === -1 || reviewsStart <= workStart) {
  throw new Error("Could not find WORK / PHOTOS to REVIEWS section.");
}

const realWorkPhotos = `              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
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

raw = raw.slice(0, workStart) + realWorkPhotos + raw.slice(reviewsStart);

fs.writeFileSync(path, raw);
