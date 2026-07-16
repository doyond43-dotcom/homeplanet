const fs = require("fs");
const path = "./src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

text = text.replace(
'  const [drawerOpen, setDrawerOpen] = useState(false);',
'  const [drawerOpen, setDrawerOpen] = useState(false);\n  const [settingsOpen, setSettingsOpen] = useState(false);'
);

text = text.replace(
`          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
            HomePlanet Transportation
          </p>`,
`          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
              HomePlanet Transportation
            </p>

            <button
              onClick={() => setSettingsOpen(true)}
              className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-100"
            >
              ? Settings
            </button>
          </div>`
);

text = text.replace(
`      {drawerOpen && selectedRide && (`,
`      {settingsOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            aria-label="Close settings"
            onClick={() => setSettingsOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-[2rem] border border-emerald-400/20 bg-[#050805] p-5 shadow-2xl shadow-black">
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/25" />

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                  Driver Settings
                </p>
                <h2 className="mt-2 text-2xl font-black">Business Setup</h2>
              </div>

              <button onClick={() => setSettingsOpen(false)} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black">
                Close
              </button>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-zinc-300">
                Settings shell is ready.
              </p>
            </div>
          </div>
        </div>
      )}

      {drawerOpen && selectedRide && (`
);

fs.writeFileSync(path, text);
console.log("Settings shell installed.");
