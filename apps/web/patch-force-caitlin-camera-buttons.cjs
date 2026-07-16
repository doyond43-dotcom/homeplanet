const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-force-camera-buttons", raw);

const start = raw.indexOf('                <div className="mt-4 grid grid-cols-2 gap-2">', raw.indexOf('uploadingPhotoType === "before"'));
const end = raw.indexOf('                <div className="mt-4 space-y-4">', start);

if (start === -1 || end === -1) {
  throw new Error("Could not find the existing photo button grid.");
}

const replacement = `                <div className="mt-4 grid grid-cols-2 gap-2">
                  <label className="rounded-xl border border-pink-300/25 bg-pink-400/10 py-3 text-center text-sm font-black text-pink-100">
                    {uploadingPhotoType === "before" ? "Uploading..." : "Take Before"}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(event) => {
                        void handlePhotoUpload("before", event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <label className="rounded-xl border border-pink-300/25 bg-pink-400/10 py-3 text-center text-sm font-black text-pink-100">
                    Upload Before
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
                    {uploadingPhotoType === "after" ? "Uploading..." : "Take After"}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(event) => {
                        void handlePhotoUpload("after", event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <label className="rounded-xl border border-pink-300/25 bg-pink-400/10 py-3 text-center text-sm font-black text-pink-100">
                    Upload After
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

`;

raw = raw.slice(0, start) + replacement + raw.slice(end);

fs.writeFileSync(path, raw);
