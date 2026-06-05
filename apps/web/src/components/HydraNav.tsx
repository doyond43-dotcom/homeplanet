import { Link, useLocation } from "react-router-dom";

const navItems = [
  ["Landing", "/planet/hydra"],
  ["Assets", "/planet/hydra/assets"],
  ["Intake", "/planet/hydra/intake?asset=Treatment%20Plant"],
  ["Report", "/planet/hydra/report"],
  ["Dashboard", "/planet/hydra/dashboard?asset=Treatment%20Plant"],
];

export default function HydraNav() {
  const location = useLocation();

  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-white">
      <Link to="/planet/hydra" className="font-black tracking-wide">
        <span className="text-cyan-300">Hydra</span> Operations
      </Link>

      <div className="flex flex-wrap gap-2">
        {navItems.map(([label, href]) => {
          const active =
            href === "/planet/hydra"
              ? location.pathname === "/planet/hydra"
              : location.pathname.startsWith(href.split("?")[0]);

          return (
            <Link
              key={label}
              to={href}
              className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                active
                  ? "border-cyan-300 bg-cyan-300 text-slate-950"
                  : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/60 hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
