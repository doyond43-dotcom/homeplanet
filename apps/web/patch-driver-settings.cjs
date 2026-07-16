const fs = require("fs");
const path = "./src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

if (!text.includes("type DriverSettings")) {
  text = text.replace(
`type Ride = {
  id: number;
  time: string;
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  tripType: TripType;
  notes: string;
  status: RideStatus;
};`,
`type Ride = {
  id: number;
  time: string;
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  tripType: TripType;
  notes: string;
  status: RideStatus;
};

type DriverSettings = {
  businessName: string;
  driverName: string;
  businessPhone: string;
  cashApp: string;
  venmo: string;
  zelle: string;
  defaultPaymentMode: "link" | "qr" | "tap" | "cash";
  paymentMessage: string;
  navigationApp: "Google Maps" | "Waze" | "Apple Maps";
};

const defaultDriverSettings: DriverSettings = {
  businessName: "Sherry's Transportation",
  driverName: "Sherry Carter",
  businessPhone: "8630000000",
  cashApp: "YourCashApp",
  venmo: "",
  zelle: "",
  defaultPaymentMode: "qr",
  paymentMessage: "Thanks for riding with {{businessName}}! You can pay here: {{paymentLink}}",
  navigationApp: "Google Maps",
};`
  );
}

text = text.replace(
`  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"link" | "qr" | "tap" | "cash">("qr");`,
`  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [driverSettings, setDriverSettings] = useState<DriverSettings>(() => {
    const saved = localStorage.getItem("hp_transportation_driver_settings");
    if (!saved) return defaultDriverSettings;

    try {
      return { ...defaultDriverSettings, ...JSON.parse(saved) };
    } catch {
      return defaultDriverSettings;
    }
  });
  const [paymentMode, setPaymentMode] = useState<"link" | "qr" | "tap" | "cash">(defaultDriverSettings.defaultPaymentMode);`
);

if (!text.includes("function updateDriverSetting")) {
  text = text.replace(
`  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }`,
`  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateDriverSetting<K extends keyof DriverSettings>(field: K, value: DriverSettings[K]) {
    setDriverSettings((current) => ({ ...current, [field]: value }));
  }

  function saveDriverSettings() {
    localStorage.setItem("hp_transportation_driver_settings", JSON.stringify(driverSettings));
    setPaymentMode(driverSettings.defaultPaymentMode);
    setSettingsOpen(false);
  }`
  );
}

text = text.replace(
`    return (
      <article className={\`\${mobile ? "" : "hidden lg:block"} rounded-[2rem] border border-emerald-400/20 bg-black/35 p-5\`}>`,
`    const cashAppHandle = driverSettings.cashApp.replace(/^\\$/, "") || "YourCashApp";
    const cashAppDisplay = \`$\${cashAppHandle}\`;
    const cashAppLink = \`https://cash.app/$\${cashAppHandle}\`;
    const paymentText = driverSettings.paymentMessage
      .replace("{{businessName}}", driverSettings.businessName)
      .replace("{{paymentLink}}", cashAppLink);
    const paymentSmsLink = \`sms:\${selectedRide.phone}?&body=\${encodeURIComponent(paymentText)}\`;

    return (
      <article className={\`\${mobile ? "" : "hidden lg:block"} rounded-[2rem] border border-emerald-400/20 bg-black/35 p-5\`}>`
);

text = text.replace(
`      Your ride payment link is ready: https://cash.app/$YourCashApp`,
`      <a href={paymentSmsLink} className="block rounded-2xl bg-emerald-400 px-4 py-3 text-center text-sm font-black text-black">
        Send Payment Text
      </a>
      <p className="mt-3 break-all text-xs text-zinc-400">{cashAppLink}</p>`
);

text = text.replaceAll("$YourCashApp", "{cashAppDisplay}");

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

if (!text.includes("Driver Settings")) {
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

            <div className="mt-5 grid gap-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Business</p>
                <div className="mt-3 grid gap-3">
                  <input value={driverSettings.businessName} onChange={(e) => updateDriverSetting("businessName", e.target.value)} placeholder="Business Name" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  <input value={driverSettings.driverName} onChange={(e) => updateDriverSetting("driverName", e.target.value)} placeholder="Driver Name" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  <input value={driverSettings.businessPhone} onChange={(e) => updateDriverSetting("businessPhone", e.target.value)} placeholder="Business Phone" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Payments</p>
                <div className="mt-3 grid gap-3">
                  <input value={driverSettings.cashApp} onChange={(e) => updateDriverSetting("cashApp", e.target.value)} placeholder="Cash App Username" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  <input value={driverSettings.venmo} onChange={(e) => updateDriverSetting("venmo", e.target.value)} placeholder="Venmo Username Optional" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  <input value={driverSettings.zelle} onChange={(e) => updateDriverSetting("zelle", e.target.value)} placeholder="Zelle Optional" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />

                  <select value={driverSettings.defaultPaymentMode} onChange={(e) => updateDriverSetting("defaultPaymentMode", e.target.value as DriverSettings["defaultPaymentMode"])} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none">
                    <option value="link">Text Link</option>
                    <option value="qr">QR Code</option>
                    <option value="tap">Tap Pay</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Payment Message</p>
                <textarea value={driverSettings.paymentMessage} onChange={(e) => updateDriverSetting("paymentMessage", e.target.value)} rows={4} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Navigation</p>
                <select value={driverSettings.navigationApp} onChange={(e) => updateDriverSetting("navigationApp", e.target.value as DriverSettings["navigationApp"])} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none">
                  <option>Google Maps</option>
                  <option>Waze</option>
                  <option>Apple Maps</option>
                </select>
              </div>

              <button onClick={saveDriverSettings} className="rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-black">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {drawerOpen && selectedRide && (`
  );
}

fs.writeFileSync(path, text);
console.log("Driver Settings drawer installed.");
