import { Link } from "react-router-dom";

const legalLinks = [
  { label: "Privacy Policy", to: "/planet/marshall-rosenbach/privacy" },
  { label: "Terms of Use", to: "/planet/marshall-rosenbach/terms" },
  { label: "Legal Disclaimer", to: "/planet/marshall-rosenbach/disclaimer" },
];

export default function MarshallRosenbachFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#090a0c] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-black tracking-[0.05em]">
            Law Offices of Marshall E. Rosenbach
          </div>
          <div className="mt-2 text-white/55">Personal Injury</div>
          <div className="mt-1 text-white/45">North Palm Beach, Florida</div>
          <div className="mt-3 text-xs text-white/30">
            © 2026 Law Offices of Marshall E. Rosenbach
          </div>
        </div>

        <div className="md:text-right">
          <nav className="flex flex-wrap gap-x-5 gap-y-3 md:justify-end" aria-label="Legal">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-semibold text-white/55 transition hover:text-[#ddb15f]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 text-xs text-white/25">Powered by HomePlanet</div>
        </div>
      </div>
    </footer>
  );
}
