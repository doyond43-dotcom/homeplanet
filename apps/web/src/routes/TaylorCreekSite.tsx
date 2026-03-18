import { useMemo } from "react";

const SHOP_PHONE_DISPLAY = "(863) 467-2221";
const SHOP_PHONE_TEL = "+18634672221";
const SHOP_ADDRESS_LINE = "3826 US-441, Okeechobee, FL 34974";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Taylor+Creek+Autorepair+inc+3826+US-441+Okeechobee+FL+34974";

// Routes (DO NOT CHANGE — keeps QR working)
const CHECKIN_HREF = "/c/taylor-creek";
const BOARD_HREF = "/live/taylor-creek/board";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    alert(`Copied: ${text}`);
  }
}

function isAdminMode() {
  try {
    const url = new URL(window.location.href);
    const v = (url.searchParams.get("admin") || "").toLowerCase().trim();
    return v === "1" || v === "true" || v === "yes" || v === "on";
  } catch {
    return false;
  }
}

function InfoPill({ text }: { text: string }) {
  return (
    <div className="inline-flex min-h-[42px] items-center rounded-full border border-[#334861] bg-[#102033] px-4 py-2 text-[13px] font-semibold text-[#dbe7f6]">
      {text}
    </div>
  );
}

function ActionButton({
  href,
  label,
  primary = false,
  newTab = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
  newTab?: boolean;
}) {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noreferrer" : undefined}
      className={cx(
        "inline-flex min-h-[54px] items-center justify-center rounded-[18px] px-5 py-3 text-center text-[16px] font-semibold transition",
        primary
          ? "bg-gradient-to-r from-[#12a9ff] to-[#10e66a] text-[#082033] shadow-[0_14px_28px_rgba(0,0,0,0.22)]"
          : "border border-[#465b73] bg-[#122132] text-white hover:border-[#6d86a1]",
      )}
    >
      {label}
    </a>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-[#324559] bg-[#0d1826] p-4 sm:p-5">
      <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8ea5c0]">
        {title}
      </div>
      <div className="mt-3 text-[16px] leading-7 text-[#d0dceb]">{children}</div>
    </section>
  );
}

export default function TaylorCreekSite() {
  const adminMode = isAdminMode();

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen bg-[#08111d] text-white">
      <div className="mx-auto w-full max-w-[920px] px-4 py-5 sm:px-5 sm:py-6">
        {/* TOP HEADER */}
        <header className="rounded-[28px] border border-[#2d415a] bg-[#0d1826] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.32)] sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#334861] bg-[#13243a] text-[26px] font-extrabold text-white">
                  TC
                </div>

                <div className="min-w-0">
                  <div className="text-[30px] font-semibold leading-tight text-white sm:text-[34px]">
                    Taylor Creek Auto Repair
                  </div>
                  <div className="mt-1 text-[15px] leading-5 text-[#aebed1]">
                    Okeechobee, Florida • HomePlanet Verified Node
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:inline-flex min-h-[42px] items-center rounded-full border border-[#6b5a2a] bg-[#2a220f] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#f2dd95]">
              Gold Tier
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <InfoPill text="Receipt-ready" />
            <InfoPill text="Timestamped" />
            <InfoPill text="Verified intake" />
            <InfoPill text="Public lookup" />
          </div>
        </header>

        {/* HERO */}
        <section className="mt-5 rounded-[28px] border border-[#2d415a] bg-[#0d1826] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.32)] sm:p-5">
          <div className="max-w-3xl">
            <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8ea5c0]">
              Fast customer check-in
            </div>

            <h1 className="mt-3 text-[34px] font-semibold leading-[1.02] text-white sm:text-[44px]">
              Check in your vehicle
            </h1>

            <p className="mt-3 text-[18px] leading-7 text-[#d0dceb]">
              Start your service request in seconds. Your intake is saved immediately and a receipt is generated the
              moment it lands.
            </p>

            <p className="mt-3 text-[15px] leading-6 text-[#9eb3ca]">
              Tell the shop what you need before you talk to the mechanic. Add a photo if it helps. No lost texts. No
              “we never got it.”
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ActionButton href={CHECKIN_HREF} label="Start Check-In" primary />
            <ActionButton href={`tel:${SHOP_PHONE_TEL}`} label={`Call ${SHOP_PHONE_DISPLAY}`} />
          </div>

          {adminMode ? (
            <div className="mt-3">
              <ActionButton href={BOARD_HREF} label="Open Live Board" />
            </div>
          ) : null}

          <div className="mt-4 rounded-[20px] border border-[#324559] bg-[#0f1d2d] p-4">
            <div className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8fa6c0]">
              What happens next
            </div>
            <div className="mt-3 space-y-2 text-[16px] leading-7 text-[#d0dceb]">
              <div>1. Tap check-in and choose what you need.</div>
              <div>2. Add your name, vehicle, and phone number.</div>
              <div>3. Get a receipt instantly while the request enters the system.</div>
            </div>
          </div>

          <div className="mt-4 text-[13px] font-medium text-[#8ea5c0]">
            Takes about 20 seconds • Receipt generated instantly
          </div>
        </section>

        {/* DETAILS */}
        <div className="mt-5 grid gap-4">
          <DetailCard title="Why this works">
            <div className="space-y-3">
              <p>
                <span className="font-semibold text-white">Presence-first:</span> your request is anchored the moment
                you submit it, before confusion, edits, or “we never got it.”
              </p>
              <p>
                <span className="font-semibold text-white">Cleaner triage:</span> adding your vehicle details helps the
                shop identify the right vehicle faster and reduces mixups.
              </p>
              <p>
                <span className="font-semibold text-white">Better proof:</span> every intake becomes a time-anchored
                record the moment it lands.
              </p>
            </div>
          </DetailCard>

          <DetailCard title="Operating hours">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4 border-b border-[#243648] pb-2">
                  <span className="font-semibold text-white">Mon–Fri</span>
                  <span>8:00am – 5:00pm</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[#243648] pb-2">
                  <span className="font-semibold text-white">Saturday</span>
                  <span>By appointment</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-white">Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </DetailCard>

          <DetailCard title="Node contact">
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-white">Phone</div>
                <div className="mt-1">
                  <a href={`tel:${SHOP_PHONE_TEL}`} className="underline decoration-dotted underline-offset-4">
                    {SHOP_PHONE_DISPLAY}
                  </a>
                </div>
              </div>

              <div>
                <div className="font-semibold text-white">Address</div>
                <div className="mt-1">{SHOP_ADDRESS_LINE}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <ActionButton href={`tel:${SHOP_PHONE_TEL}`} label="Call" />
                <button
                  type="button"
                  onClick={() => copyToClipboard(SHOP_PHONE_TEL)}
                  className="inline-flex min-h-[54px] items-center justify-center rounded-[18px] border border-[#465b73] bg-[#122132] px-5 py-3 text-center text-[16px] font-semibold text-white transition hover:border-[#6d86a1]"
                >
                  Copy Phone
                </button>
                <ActionButton href={MAPS_URL} label="Directions" newTab />
                <button
                  type="button"
                  onClick={() => copyToClipboard(SHOP_ADDRESS_LINE)}
                  className="inline-flex min-h-[54px] items-center justify-center rounded-[18px] border border-[#465b73] bg-[#122132] px-5 py-3 text-center text-[16px] font-semibold text-white transition hover:border-[#6d86a1]"
                >
                  Copy Address
                </button>
              </div>
            </div>
          </DetailCard>

          <DetailCard title="Public lookup enabled">
            Customers and managers can reference records quickly when needed. Intake, receipt, and service context stay
            tied together instead of floating around as disconnected texts or calls.
          </DetailCard>
        </div>

        {/* FOOTER */}
        <footer className="mt-6 border-t border-[#162231] pt-6 text-center text-[12px] text-[#6f8399]">
          © {year} Taylor Creek Auto Repair
        </footer>
      </div>
    </div>
  );
}