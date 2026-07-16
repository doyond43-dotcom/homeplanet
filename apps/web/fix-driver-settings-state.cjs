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
  driverName: "Sherry",
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

if (!text.includes("const [driverSettings, setDriverSettings]")) {
  text = text.replace(
`  const [settingsOpen, setSettingsOpen] = useState(false);`,
`  const [settingsOpen, setSettingsOpen] = useState(false);
  const [driverSettings, setDriverSettings] = useState<DriverSettings>(() => {
    const saved = localStorage.getItem("hp_transportation_driver_settings");
    if (!saved) return defaultDriverSettings;

    try {
      return { ...defaultDriverSettings, ...JSON.parse(saved) };
    } catch {
      return defaultDriverSettings;
    }
  });`
  );
}

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

fs.writeFileSync(path, text);
console.log("Driver settings state and helpers fixed.");
