const fs = require("fs");
const path = "./src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

text = text.replace(
  '  const [paymentMode, setPaymentMode] = useState<"link" | "qr" | "tap" | "cash">("qr");',
  '  const [paymentMode, setPaymentMode] = useState<"link" | "qr" | "tap" | "cash">("qr");\n  const [completedActionLabel, setCompletedActionLabel] = useState<string | null>(null);'
);

text = text.replace(
  `      <button
        onClick={() => updateStatus(selectedRide.id, current.next)}
        className="mt-4 w-full rounded-3xl bg-emerald-400 px-6 py-6 text-left text-xl font-black text-black transition-all duration-200 active:scale-[0.98]"
      >
        {current.label}
      </button>`,
  `      <button
        onClick={() => {
          setCompletedActionLabel(current.label);
          window.setTimeout(() => {
            updateStatus(selectedRide.id, current.next);
            setCompletedActionLabel(null);
          }, 150);
        }}
        className={\`mt-4 w-full rounded-3xl px-6 py-6 text-left text-xl font-black transition-all duration-200 active:scale-[0.98] \${completedActionLabel === current.label ? "border border-emerald-400/30 bg-emerald-950/70 text-emerald-100" : "bg-emerald-400 text-black shadow-lg shadow-emerald-500/20"}\`}
      >
        {completedActionLabel === current.label ? \`? \${current.label}\` : current.label}
      </button>`
);

fs.writeFileSync(path, text);
console.log("Living action card completion animation added.");
