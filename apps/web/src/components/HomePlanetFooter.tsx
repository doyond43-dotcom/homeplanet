export default function HomePlanetFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-6 border-t border-[#162231] pt-6 pb-6 text-center">
      <div className="flex items-center justify-center gap-2 text-[13px] font-semibold text-[#9fb3c8]">
        <span className="text-[16px]">🪐</span>
        <span>HomePlanet © {year}. All rights reserved.</span>
      </div>

      <div className="mt-2 text-[12px] text-[#6f8399]">
        Presence-first systems and workflows protected.
      </div>
    </footer>
  );
}