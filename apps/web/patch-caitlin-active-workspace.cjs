const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-active-workspace-drawer-cleanup", raw);

// Keep card names one-line / full-width feel
raw = raw.replace(
  'className="flex-1 text-left">',
  'className="min-w-0 flex-1 text-left">'
);

raw = raw.replace(
  '<h2 className="text-2xl font-black">{signal.name}</h2>',
  '<h2 className="truncate whitespace-nowrap text-2xl font-black">{signal.name}</h2>'
);

// Replace top drawer header/contact dropdown with active workspace header
const drawerStart = raw.indexOf('            <button\n              onClick={() => {\n                setSelected(null);');
const workspaceStart = raw.indexOf('            <div className="mt-5 space-y-4 overflow-auto pb-6">');

if (drawerStart === -1 || workspaceStart === -1 || workspaceStart <= drawerStart) {
  throw new Error("Could not find drawer header block.");
}

const newHeader = `            <div className="relative rounded-2xl border border-pink-300/20 bg-pink-400/10 p-4 pr-16">
              <button
                onClick={() => {
                  setSelected(null);
                  setShowContactDetails(false);
                  setShowHeaderDetails(false);
                }}
                className="absolute right-4 top-4 rounded-xl border border-white/10 bg-white/10 p-3"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>

              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-pink-300">
                Active Workspace
              </p>
              <h2 className="mt-3 truncate whitespace-nowrap text-4xl font-black leading-tight">
                {selected.name}
              </h2>
              <p className="mt-1 truncate text-xl font-black text-pink-300">{selected.service}</p>
              <p className="mt-1 truncate text-sm font-bold text-zinc-400">{selected.location}</p>
            </div>

`;

raw = raw.slice(0, drawerStart) + newHeader + raw.slice(workspaceStart);

// Put Call/Text/Navigate inside Contact / Details expanded area
raw = raw.replace(
  `                    <div className="space-y-1 text-sm text-zinc-200">
                      <div>Service: {selected.service}</div>
                      <div>Home: {selected.home}</div>
                      <div>Condition: {selected.condition}</div>
                      <div>Pets: {selected.pets}</div>
                      <div>Preferred: {selected.preferred}</div>
                    </div>`,
  `                    <div className="space-y-1 text-sm text-zinc-200">
                      <div>Service: {selected.service}</div>
                      <div>Home: {selected.home}</div>
                      <div>Condition: {selected.condition}</div>
                      <div>Pets: {selected.pets}</div>
                      <div>Preferred: {selected.preferred}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <a href={selected.phone ? \`tel:\${selected.phone}\` : undefined} className="rounded-xl border border-pink-300/30 bg-pink-400/10 py-3 text-center text-xs font-black">
                        <Phone className="mx-auto mb-1" size={16} />
                        Call
                      </a>
                      <a href={smsBody(selected.phone, buildFirstReplyText(selected))} className="rounded-xl border border-pink-300/30 bg-pink-400/10 py-3 text-center text-xs font-black">
                        <MessageCircle className="mx-auto mb-1" size={16} />
                        Text
                      </a>
                      <a
                        href={\`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(selected.location)}\`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-pink-300/30 bg-pink-400/10 py-3 text-center text-xs font-black"
                      >
                        <MapPin className="mx-auto mb-1" size={16} />
                        Navigate
                      </a>
                    </div>`
);

// Remove old fake WORK / PHOTOS block, keep real saved-photo block
const firstWork = raw.indexOf('              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">', raw.indexOf("WORK / PHOTOS"));
const secondWork = raw.indexOf('              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">', firstWork + 10);

if (firstWork !== -1 && secondWork !== -1) {
  raw = raw.slice(0, firstWork) + raw.slice(secondWork);
}

fs.writeFileSync(path, raw);
