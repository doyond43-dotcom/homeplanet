import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Shield,
  Tag,
  UserRound,
} from "lucide-react";

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    const ten = digits.slice(1);
    return `+1 (${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function buildTelHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:${digits}`;
}

function buildSmsHref(phone: string, body: string) {
  const digits = phone.replace(/\D/g, "");
  return `sms:${digits}?body=${encodeURIComponent(body)}`;
}

function nowStamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

type ShippingForm = {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  email: string;
};

const INITIAL_SHIPPING: ShippingForm = {
  fullName: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  email: "",
};

export default function GuardianJoinDesk() {
  const [petName, setPetName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [petType, setPetType] = useState("Dog");

  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [shippingSubmittedAt, setShippingSubmittedAt] = useState<string | null>(null);
  const [isShippingSubmitted, setIsShippingSubmitted] = useState(false);

  const [statusNote, setStatusNote] = useState(
    "Enter your pet and owner details to create a live Guardian pet tag.",
  );

  const [shippingStatusNote, setShippingStatusNote] = useState(
    "After your pet tag is ready, enter your mailing details so we know where to send it.",
  );

  const [shipping, setShipping] = useState<ShippingForm>(INITIAL_SHIPPING);

  const previewName = petName.trim() || "Your Pet";
  const previewOwner = ownerName.trim() || "Owner Name";
  const previewPhone = phone.trim() || "(000) 000-0000";

  const smsBody = useMemo(() => {
    return `Hi ${previewOwner}, I found ${previewName}. I scanned the Planet Guardian pet tag.`;
  }, [previewName, previewOwner]);

  function handleCreateTag() {
    if (!petName.trim() || !ownerName.trim() || !phone.trim()) {
      setStatusNote("Enter pet name, owner name, and phone number first.");
      return;
    }

    setIsCreated(true);
    setCreatedAt(nowStamp());
    setStatusNote(`${previewName}'s live Guardian pet page is now ready.`);
    setShowShipping(false);
    setIsShippingSubmitted(false);
    setShippingSubmittedAt(null);
    setShippingStatusNote(
      "After your pet tag is ready, enter your mailing details so we know where to send it.",
    );
  }

  function handleOpenShipping() {
    if (!isCreated) return;
    setShowShipping(true);
    setShippingStatusNote("Enter your mailing details below so we can send your tag.");
  }

  function updateShipping<K extends keyof ShippingForm>(
    field: K,
    value: ShippingForm[K],
  ) {
    setShipping((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmitShipping() {
    if (
      !shipping.fullName.trim() ||
      !shipping.street.trim() ||
      !shipping.city.trim() ||
      !shipping.state.trim() ||
      !shipping.zip.trim()
    ) {
      setShippingStatusNote("Enter full name, street, city, state, and ZIP first.");
      return;
    }

    setIsShippingSubmitted(true);
    setShippingSubmittedAt(nowStamp());
    setShippingStatusNote(
      `Shipping details captured for ${shipping.fullName.trim()}. ${previewName}'s tag is ready to be mailed.`,
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="mx-auto max-w-[960px] px-6 py-8">
        <header className="mb-6 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-900/35 to-blue-900/35 p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.06),0_12px_40px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-cyan-300" />
            <h1 className="text-xl font-semibold tracking-wide">Create Your Pet Tag</h1>
          </div>

          <p className="mt-2 text-sm text-cyan-100/80">
            Set up a simple live rescue page for your pet. No pair code. No device linking.
            Just create the pet tag profile.
          </p>
        </header>

        <section className="rounded-3xl border border-cyan-400/20 bg-cyan-950/20 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.24)]">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-5">
              <div className="rounded-2xl border border-cyan-400/15 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-cyan-200/80">
                  <Tag className="h-4 w-4 text-cyan-300" />
                  Pet Profile Setup
                </div>
                <div className="mt-2 text-sm text-cyan-100/70">
                  This is the simple signup flow someone should see after tapping
                  “Create Your Pet Tag.”
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-900/10 p-4">
                <div className="text-sm uppercase tracking-wider text-cyan-200/80">
                  Pet Details
                </div>

                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm text-cyan-100/85">Pet Name</span>
                    <input
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="Bella"
                      className="w-full rounded-2xl border border-cyan-400/20 bg-[#0c1730] px-4 py-3 text-base text-white outline-none placeholder:text-cyan-100/35"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-cyan-100/85">Pet Type</span>
                    <select
                      value={petType}
                      onChange={(e) => setPetType(e.target.value)}
                      className="w-full rounded-2xl border border-cyan-400/20 bg-[#0c1730] px-4 py-3 text-base text-white outline-none"
                    >
                      <option>Dog</option>
                      <option>Cat</option>
                      <option>Pet</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-cyan-100/85">Owner Name</span>
                    <input
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Dan"
                      className="w-full rounded-2xl border border-cyan-400/20 bg-[#0c1730] px-4 py-3 text-base text-white outline-none placeholder:text-cyan-100/35"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-cyan-100/85">Phone Number</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="8635550199"
                      className="w-full rounded-2xl border border-cyan-400/20 bg-[#0c1730] px-4 py-3 text-base text-white outline-none placeholder:text-cyan-100/35"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleCreateTag}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/35 bg-cyan-500/20 px-4 py-3 text-sm font-medium text-cyan-50 transition shadow-[0_8px_22px_rgba(0,0,0,0.22)] hover:bg-cyan-500/30"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Create My Pet Tag</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-900/15 p-4">
                <div className="text-sm uppercase tracking-wider text-emerald-200/80">
                  Status
                </div>
                <div className="mt-2 text-base font-semibold">
                  {isCreated ? "Pet tag ready" : "Waiting to create"}
                </div>
                <div className="mt-1 text-sm text-emerald-100/75">{statusNote}</div>
                {createdAt && (
                  <div className="mt-2 text-xs text-emerald-200/70">
                    Created at {createdAt}
                  </div>
                )}

                {isCreated ? (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleOpenShipping}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300/35 bg-amber-500/15 px-4 py-3 text-sm font-medium text-amber-50 transition hover:bg-amber-500/25"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Send My Tag</span>
                    </button>
                    <p className="mt-3 text-xs text-emerald-100/65">
                      Next: enter your mailing details so we know where to send your real tag.
                    </p>
                  </div>
                ) : null}
              </div>

              {showShipping ? (
                <div className="rounded-2xl border border-amber-300/20 bg-amber-900/10 p-4">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-amber-200/85">
                    <MapPin className="h-4 w-4 text-amber-300" />
                    Mailing Details
                  </div>

                  <div className="mt-2 text-sm text-amber-100/75">
                    Where should we send {previewName}&apos;s tag?
                  </div>

                  <div className="mt-4 space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm text-amber-100/85">Full Name</span>
                      <input
                        value={shipping.fullName}
                        onChange={(e) => updateShipping("fullName", e.target.value)}
                        placeholder="Dan Doyon"
                        className="w-full rounded-2xl border border-amber-300/20 bg-[#0c1730] px-4 py-3 text-base text-white outline-none placeholder:text-amber-100/35"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm text-amber-100/85">Street Address</span>
                      <input
                        value={shipping.street}
                        onChange={(e) => updateShipping("street", e.target.value)}
                        placeholder="123 Main St"
                        className="w-full rounded-2xl border border-amber-300/20 bg-[#0c1730] px-4 py-3 text-base text-white outline-none placeholder:text-amber-100/35"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <label className="block sm:col-span-1">
                        <span className="mb-2 block text-sm text-amber-100/85">City</span>
                        <input
                          value={shipping.city}
                          onChange={(e) => updateShipping("city", e.target.value)}
                          placeholder="Okeechobee"
                          className="w-full rounded-2xl border border-amber-300/20 bg-[#0c1730] px-4 py-3 text-base text-white outline-none placeholder:text-amber-100/35"
                        />
                      </label>

                      <label className="block sm:col-span-1">
                        <span className="mb-2 block text-sm text-amber-100/85">State</span>
                        <input
                          value={shipping.state}
                          onChange={(e) => updateShipping("state", e.target.value)}
                          placeholder="FL"
                          className="w-full rounded-2xl border border-amber-300/20 bg-[#0c1730] px-4 py-3 text-base text-white outline-none placeholder:text-amber-100/35"
                        />
                      </label>

                      <label className="block sm:col-span-1">
                        <span className="mb-2 block text-sm text-amber-100/85">ZIP</span>
                        <input
                          value={shipping.zip}
                          onChange={(e) => updateShipping("zip", e.target.value)}
                          placeholder="34972"
                          className="w-full rounded-2xl border border-amber-300/20 bg-[#0c1730] px-4 py-3 text-base text-white outline-none placeholder:text-amber-100/35"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm text-amber-100/85">
                        Email (optional)
                      </span>
                      <input
                        value={shipping.email}
                        onChange={(e) => updateShipping("email", e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-amber-300/20 bg-[#0c1730] px-4 py-3 text-base text-white outline-none placeholder:text-amber-100/35"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleSubmitShipping}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300/35 bg-amber-500/15 px-4 py-3 text-sm font-medium text-amber-50 transition hover:bg-amber-500/25"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Submit Mailing Details</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {showShipping ? (
                <div className="rounded-2xl border border-sky-400/20 bg-sky-900/10 p-4">
                  <div className="text-sm uppercase tracking-wider text-sky-200/80">
                    Shipping Status
                  </div>
                  <div className="mt-2 text-base font-semibold">
                    {isShippingSubmitted ? "Ready to mail" : "Waiting for mailing details"}
                  </div>
                  <div className="mt-1 text-sm text-sky-100/75">{shippingStatusNote}</div>
                  {shippingSubmittedAt ? (
                    <div className="mt-2 text-xs text-sky-200/70">
                      Submitted at {shippingSubmittedAt}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-cyan-200/80">
                  <UserRound className="h-4 w-4 text-cyan-300" />
                  Live Preview
                </div>
                <div className="mt-2 text-sm text-white/70">
                  This shows the simple rescue page direction after signup.
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.24)]">
                <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/20 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">
                    Planet Guardian Pet
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {previewName}
                  </h2>
                  <p className="mt-1 text-sm text-white/70">
                    {petType} • Live rescue page preview
                  </p>
                </div>

                <div className="space-y-4 p-5">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                      Owner
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">{previewOwner}</p>
                    <p className="mt-1 text-sm text-white/70">{formatPhone(previewPhone)}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-400/20 bg-amber-900/10 p-4 text-sm leading-6 text-amber-100/90">
                    If {previewName} is safe with you, please call or text the owner so they
                    can respond quickly.
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      href={buildTelHref(previewPhone)}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/35 bg-emerald-900/20 px-4 py-3 text-sm font-medium text-emerald-50 transition hover:bg-emerald-800/30"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call Owner</span>
                    </a>

                    <a
                      href={buildSmsHref(previewPhone, smsBody)}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-blue-400/35 bg-blue-900/20 px-4 py-3 text-sm font-medium text-blue-50 transition hover:bg-blue-800/30"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Text Owner</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm uppercase tracking-wider text-cyan-200/80">
                  Why this is better
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-lg font-semibold text-white">Simple</div>
                    <div className="mt-1 text-xs text-white/65">No pair code confusion</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-lg font-semibold text-white">Fast</div>
                    <div className="mt-1 text-xs text-white/65">Create in seconds</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-lg font-semibold text-white">Clear</div>
                    <div className="mt-1 text-xs text-white/65">Built for pet owners</div>
                  </div>
                </div>
              </div>

              {isShippingSubmitted ? (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-900/15 p-4">
                  <div className="text-sm uppercase tracking-wider text-emerald-200/80">
                    Mail Summary
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-emerald-100/80">
                    <p>
                      <span className="font-semibold text-white">Ship to:</span>{" "}
                      {shipping.fullName}
                    </p>
                    <p>
                      <span className="font-semibold text-white">Address:</span>{" "}
                      {shipping.street}
                    </p>
                    <p>
                      <span className="font-semibold text-white">City / State / ZIP:</span>{" "}
                      {shipping.city}, {shipping.state} {shipping.zip}
                    </p>
                    {shipping.email ? (
                      <p>
                        <span className="font-semibold text-white">Email:</span>{" "}
                        {shipping.email}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}