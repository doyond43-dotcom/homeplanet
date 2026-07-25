import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ExternalLink, QrCode } from "lucide-react";
import { supabase } from "../lib/supabase";

const chime =
  typeof Audio !== "undefined"
    ? new Audio("/sounds/homeplanet-chime.wav")
    : null;

type PaymentMethod = "cashapp" | "zelle";

type MailingState = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
};

type PetProfile = {
  name: string;
  type: string;
  breed: string;
  age: string;
  color: string;
  notes: string;
  photoDataUrl: string;
};

type EmailState = "idle" | "sending" | "sent" | "failed";

const TAG_SETUP = 25;
const TAG_MONTHLY = 5;
const MULTI_TAG_THRESHOLD = 3;
const MULTI_TAG_SETUP_DISCOUNT = 25;

const CASH_APP_CASHTAG = "$homeplanetsystems";
const ZELLE_CONTACT = "dannyscandys@gmail.com";
const ORDER_CONTACT_PHONE = "863-532-0683";

function currency(value: number) {
  return `$${value.toFixed(2)}`;
}

function parsePetCount(value: string | null) {
  const parsed = Number(value ?? "1");
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

function getPricing(petCount: number) {
  const extraPets = Math.max(0, petCount - 1);

  const setupDiscount =
    petCount >= MULTI_TAG_THRESHOLD
      ? MULTI_TAG_SETUP_DISCOUNT
      : 0;

  return {
    petCount,
    extraPets,
    setupDiscount,
    setupTotal: petCount * TAG_SETUP - setupDiscount,
    monthlyTotal: petCount * TAG_MONTHLY,
  };
}

function buildCashAppUrl(amount: string, memo: string) {
  const cashtag = CASH_APP_CASHTAG.replace("$", "");
  const params = new URLSearchParams();

  if (amount) params.set("amount", amount);
  if (memo) params.set("note", memo);

  return `https://cash.app/$${cashtag}${params.toString() ? `?${params.toString()}` : ""}`;
}

function buildZelleCopy(amount: string, memo: string) {
  return `Send ${amount ? `$${amount}` : "payment"} to ${ZELLE_CONTACT}${memo ? ` | Memo: ${memo}` : ""}`;
}

function buildPetAwareMemo(
  fullName: string,
  petCount: number,
  pets: PetProfile[],
) {
  const firstPetName = pets[0]?.name?.trim();

  if (firstPetName) {
    const petLabel =
      petCount > 1 ? `${firstPetName} + ${petCount - 1} more` : firstPetName;
    return `Guardian Pet Tag - ${petLabel} - ${petCount} pet${petCount > 1 ? "s" : ""}`;
  }

  const buyer = fullName.trim() || "customer";
  return `Guardian Pet Tag - ${buyer} - ${petCount} pet${petCount > 1 ? "s" : ""}`;
}

function makeOrderId() {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GPT-${part}`;
}

function createEmptyPets(count: number): PetProfile[] {
  return Array.from({ length: count }, () => ({
    name: "",
    type: "",
    breed: "",
    age: "",
    color: "",
    notes: "",
    photoDataUrl: "",
  }));
}

function petSummaryLine(pet: PetProfile) {
  const parts = [
    pet.type.trim(),
    pet.breed.trim(),
    pet.age.trim(),
    pet.color.trim(),
  ].filter(Boolean);

  return parts.length ? parts.join(" · ") : "Profile not entered yet";
}

function buildQrImageUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(data)}`;
}

export default function GuardianJoinDesk() {
  const [searchParams] = useSearchParams();

  const petCount = parsePetCount(searchParams.get("pets"));
  const pricing = useMemo(() => getPricing(petCount), [petCount]);

  const [mailing, setMailing] = useState<MailingState>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: ORDER_CONTACT_PHONE,
  });

  const [pets, setPets] = useState<PetProfile[]>(() => createEmptyPets(petCount));
  const [paymentMethod] = useState<PaymentMethod>("cashapp");
  const [paymentAmount, setPaymentAmount] = useState(pricing.setupTotal.toFixed(2));
  const [paymentMemo, setPaymentMemo] = useState(buildPetAwareMemo("", petCount, []));
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMarked, setPaymentMarked] = useState(false);
  const [orderId, setOrderId] = useState(makeOrderId());
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [emailState, setEmailState] = useState<EmailState>("idle");

  useEffect(() => {
    setPets((current) => {
      if (current.length === petCount) return current;

      if (current.length < petCount) {
        return [
          ...current,
          ...Array.from({ length: petCount - current.length }, () => ({
            name: "",
            type: "",
            breed: "",
            age: "",
            color: "",
            notes: "",
            photoDataUrl: "",
          })),
        ];
      }

      return current.slice(0, petCount);
    });

    setPaymentAmount(pricing.setupTotal.toFixed(2));
  }, [petCount, pricing.setupTotal]);
  useEffect(() => {
    if (orderPlaced) return;

    setPaymentMemo(
      buildPetAwareMemo(mailing.fullName, petCount, pets)
    );
  }, [mailing.fullName, petCount, pets, orderPlaced]);

  function updateField(field: keyof MailingState, value: string) {
    setMailing((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updatePet(index: number, field: keyof PetProfile, value: string) {
    setPets((prev) =>
      prev.map((pet, i) => (i === index ? { ...pet, [field]: value } : pet)),
    );
  }

  

  function updatePetPhoto(index: number, file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose a photo file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      updatePet(index, "photoDataUrl", result);
    };

    reader.onerror = () => {
      alert("Could not load that pet photo. Please try another image.");
    };

    reader.readAsDataURL(file);
  }

  function removePetPhoto(index: number) {
    updatePet(index, "photoDataUrl", "");
  }

function isValid() {
    return (
      mailing.fullName.trim() &&
      mailing.address.trim() &&
      mailing.city.trim() &&
      mailing.state.trim() &&
      mailing.zip.trim() &&
      mailing.email.trim() &&
      pets.every(
        (pet) =>
          pet.name.trim() &&
          pet.type.trim() &&
          pet.breed.trim() &&
          pet.age.trim(),
      )
    );
  }

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel(null), 1600);
    } catch (error) {
      console.error(`Failed to copy ${label}:`, error);
      alert(`Could not copy ${label}.`);
    }
  }

  async function placeOrder() {
    if (!isValid()) {
      alert("Please complete the buyer, shipping, pet profile, and confirmation email fields first.");
      return;
    }

    setSubmittingOrder(true);
    setSubmitError("");
    setEmailState("idle");

    const nextOrderId = makeOrderId();

    const orderPayload = {
      order_id: nextOrderId,
      customer_name: mailing.fullName.trim(),
      customer_email: mailing.email.trim(),
      customer_phone: mailing.phone.trim() || null,
      shipping_address: mailing.address.trim(),
      shipping_city: mailing.city.trim(),
      shipping_state: mailing.state.trim(),
      shipping_zip: mailing.zip.trim(),
      payment_method: paymentMethod,
      payment_amount: Number(paymentAmount || pricing.setupTotal.toFixed(2)),
      payment_memo: paymentMemo,
      pet_count: pricing.petCount,
      setup_total: pricing.setupTotal,
      monthly_total: pricing.monthlyTotal,
      pets,
      status: "pending_payment",
      payment_marked: false,
    };

    try {
      const { error: insertError } = await supabase
        .from("guardian_orders")
        .insert(orderPayload);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setOrderId(nextOrderId);

      setOrderPlaced(true);

      setPaymentMarked(false);


      setPaymentMemo(

        `${nextOrderId} · ${buildPetAwareMemo(

          mailing.fullName,

          petCount,

          pets

        )}`

      );


      setEmailState("sending");

      const { error: functionError } = await supabase.functions.invoke(
        "send-guardian-order-email",
        {
          body: orderPayload,
        },
      );

      if (functionError) {
        setEmailState("failed");
        setSubmitError(`Order saved, but email sending failed: ${functionError.message}`);
      } else {
        setEmailState("sent");

        try {
          if (chime) {
            chime.currentTime = 0;
            chime.play();
          }
        } catch (e) {
          console.log("Chime blocked by browser");
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save order.";
      setSubmitError(message);
      alert(message);
    } finally {
      setSubmittingOrder(false);
    }
  }

  async function markPaid() {
    if (!orderPlaced) {
      alert("Place the order first so the payment ties to a real order.");
      return;
    }

    setSubmitError("");

    const { error } = await supabase
      .from("guardian_orders")
      .update({
        status: "payment_submitted",
      })
      .eq("order_id", orderId);

    if (error) {
      console.error("Could not record payment submission:", error);

      setSubmitError(
        "Your order is saved, but we could not record that payment was submitted. Please contact us before trying again."
      );

      return;
    }

    setPaymentMarked(true);
  }

  const cashAppUrl = useMemo(
    () => buildCashAppUrl(paymentAmount, paymentMemo),
    [paymentAmount, paymentMemo],
  );

  const zelleCopyText = useMemo(
    () => buildZelleCopy(paymentAmount, paymentMemo),
    [paymentAmount, paymentMemo],
  );

  const cashAppQr = useMemo(() => buildQrImageUrl(cashAppUrl), [cashAppUrl]);

  const firstPet = pets[0];
  const selectedOrderTitle =
    firstPet?.name?.trim() || mailing.fullName || "Pet tag order";

  const receiptStatusLabel = paymentMarked
    ? "Payment Submitted"
    : orderPlaced
      ? "Pending Payment"
      : "Not Placed";

  const receiptStatusText = paymentMarked
    ? "Waiting for verification"
    : orderPlaced
      ? "Waiting for payment"
      : "Checkout not submitted";

  const emailStatusText =
    emailState === "sent"
      ? "Confirmation sent"
      : emailState === "failed"
        ? "Order saved, email pending"
        : emailState === "sending"
          ? "Sending confirmation"
          : "No confirmation sent yet";

  return (
    <div className="min-h-screen bg-[#07111f] px-4 py-6 text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl">
          <div className="min-w-0">
            <header className="flex min-h-[52px] items-center border-b border-white/[0.07] px-1 pb-3">
              <Link
                to="/planet/guardian-pet"
                className="inline-flex items-center gap-3 text-white/70 transition hover:text-white"
              >
                <span className="text-lg leading-none" aria-hidden="true">
                  ←
                </span>

                <span className="relative inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/[0.06] py-1.5 pl-4 pr-3 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
                  <span className="absolute left-2 h-1 w-1 rounded-full border border-cyan-200/55" />
                  Pet Tag
                </span>
              </Link>
            </header>
            <div className="py-6 sm:py-8">
              <div className="hidden">
                <div className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Pet Tag
                </div>
                <div className="rounded-full border border-white/[0.12] bg-[#07111f]/70/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  {petCount} pet{petCount > 1 ? "s" : ""}
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl">
                Get your pet's tag set up.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
                Add your information and your pet. We'll take care of the rest.
              </p>

              <div className="hidden">
                <Link
                  to="/planet/guardian-pet"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/16 bg-white/[0.035] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.07]"
                >
                  ← Back to Pet Tag
                </Link>
              </div>
            </div>

            <div className="mt-3 rounded-[28px] border border-white/[0.08] bg-[#091724] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.025em] text-white">Where should we send it?</h2>
                  <p className="mt-1 text-sm text-white/45">
                    Tell us where your Pet Tag should go.
                  </p>
                </div>
                <div className="rounded-full border border-white/[0.12] bg-[#07111f]/70 px-3 py-1 text-xs font-semibold text-white/70">
                  Order
                </div>
              </div>

              <div className="grid gap-3">
                <input
                  placeholder="Full Name"
                  value={mailing.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                />
                <input
                  placeholder="Street Address"
                  value={mailing.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                />

                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    placeholder="City"
                    value={mailing.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                  />
                  <input
                    placeholder="State"
                    value={mailing.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                  />
                  <input
                    placeholder="ZIP"
                    value={mailing.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                    className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    placeholder="Confirmation email"
                    value={mailing.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                  />
                  <input
                    placeholder="Phone"
                    value={mailing.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-[28px] border border-white/[0.08] bg-[#091724] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.025em] text-white">Tell us about your pet{petCount > 1 ? "s" : ""}</h2>
                  <p className="mt-1 text-sm text-white/45">
                    Add the details someone may need if your pet ever gets out.
                  </p>
                </div>
                <div className="rounded-full border border-white/[0.12] bg-[#07111f]/70 px-3 py-1 text-xs font-semibold text-white/70">
                  {petCount} profile{petCount > 1 ? "s" : ""}
                </div>
              </div>

              <div className="space-y-4">
                {pets.map((pet, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/[0.08] bg-[#050e18]/75 p-4"
                  >
                    <div className="mb-3 text-sm font-semibold text-white">
                      Pet {index + 1}
                    </div>

                    

                    <div className="mb-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="h-28 w-28 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07131f]">
                          {pet.photoDataUrl ? (
                            <img
                              src={pet.photoDataUrl}
                              alt={`${pet.name || `Pet ${index + 1}`} preview`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-white/45">
                              Pet photo preview
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                            Pet Photo
                          </div>
                          <p className="mt-1 text-sm leading-6 text-white/55">
                            Add or take a photo so the tag order has a real visual identity.
                          </p>

                          <div className="hidden">
                            <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20">
                              Add / Take Photo
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(event) => updatePetPhoto(index, event.target.files?.[0])}
                                className="hidden"
                              />
                            </label>

                            {pet.photoDataUrl ? (
                              <button
                                type="button"
                                onClick={() => removePetPhoto(index)}
                                className="inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-900"
                              >
                                Remove Photo
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        placeholder="Pet Name"
                        value={pet.name}
                        onChange={(e) => updatePet(index, "name", e.target.value)}
                        className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                      />
                      <input
                        placeholder="Type (Dog, Cat, etc)"
                        value={pet.type}
                        onChange={(e) => updatePet(index, "type", e.target.value)}
                        className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                      />
                      <input
                        placeholder="Breed"
                        value={pet.breed}
                        onChange={(e) => updatePet(index, "breed", e.target.value)}
                        className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                      />
                      <input
                        placeholder="Age"
                        value={pet.age}
                        onChange={(e) => updatePet(index, "age", e.target.value)}
                        className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                      />
                      <input
                        placeholder="Color / markings"
                        value={pet.color}
                        onChange={(e) => updatePet(index, "color", e.target.value)}
                        className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50 sm:col-span-2"
                      />
                    </div>

                    <textarea
                      placeholder="Allergies, meds, temperament, emergency notes"
                      value={pet.notes}
                      onChange={(e) => updatePet(index, "notes", e.target.value)}
                      className="mt-3 min-h-[96px] w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                    />

                    <div className="mt-3 rounded-xl border border-white/[0.08] bg-[#07131f] p-3 text-sm text-white/55">
                      {pet.name.trim() ? (
                        <>
                          <div className="font-semibold text-white">{pet.name}</div>
                          <div className="mt-1">{petSummaryLine(pet)}</div>
                          {pet.notes.trim() ? (
                            <div className="mt-2 text-white/45">Notes: {pet.notes}</div>
                          ) : null}
                        </>
                      ) : (
                        <div>Pet profile not entered yet.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 rounded-[28px] border border-white/[0.08] bg-[#091724] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.025em] text-white">Your Pet Tag</h2>
                  <p className="mt-1 text-sm text-white/45">
                    Everything for your tag, clear and simple.
                  </p>
                </div>
                <div className="rounded-full border border-white/[0.12] bg-[#07111f]/70 px-3 py-1 text-xs font-semibold text-white/70">
                  {orderId}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/[0.08] bg-[#050e18]/75 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Pet count
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {pricing.petCount}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#050e18]/75 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Each Pet Tag
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {currency(TAG_SETUP)} setup + {currency(TAG_MONTHLY)}/mo
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#050e18]/75 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                    {pricing.setupDiscount > 0
                      ? "Multi-Tag Savings Applied"
                      : "3+ Tag Savings"}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {pricing.setupDiscount > 0
                      ? `You saved ${currency(pricing.setupDiscount)} on setup.`
                      : `Order 3 or more tags and one ${currency(MULTI_TAG_SETUP_DISCOUNT)} setup fee is waived.`}
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-emerald-300/80">
                    Setup total
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {currency(pricing.setupTotal)}
                  </div>

                  {pricing.setupDiscount > 0 ? (
                    <div className="mt-1 text-xs font-semibold text-emerald-300">
                      Includes {currency(pricing.setupDiscount)} multi-tag savings
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.08] bg-[#050e18]/75 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Monthly total
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {currency(pricing.monthlyTotal)}/mo
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#050e18]/75 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Payment memo
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {paymentMemo}
                  </div>
                </div>
              </div>

              {submitError ? (
                <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                  {submitError}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void placeOrder()}
                  disabled={submittingOrder || orderPlaced}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-300 px-6 py-4 text-base font-bold text-[#07111f] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {submittingOrder
                    ? "Saving Order..."
                    : orderPlaced
                      ? "Order Placed"
                      : "Place My Pet Tag Order"}
                </button>

              </div>
            </div>

            <div className={`${paymentMarked ? "" : "hidden"} mt-3 rounded-[28px] border border-white/[0.08] bg-[#091724] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]`}>
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.025em] text-white">You're all set</h2>
                  <p className="mt-1 text-sm text-white/45">
                    Your Pet Tag order and payment update are together here.
                  </p>
                </div>
                <div className="rounded-full border border-white/[0.12] bg-[#07111f]/70 px-3 py-1 text-xs font-semibold text-white/70">
                  {receiptStatusLabel}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#050e18]/75 p-4 text-sm text-white/70">
                <div>
                  <span className="text-white/45">Order ID:</span>{" "}
                  <span className="font-semibold text-white">{orderId}</span>
                </div>
                <div className="mt-2">
                  <span className="text-white/45">Customer:</span>{" "}
                  <span className="font-semibold text-white">
                    {mailing.fullName || "Not entered yet"}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-white/45">Confirmation email:</span>{" "}
                  <span className="font-semibold text-white">
                    {mailing.email || "Not entered yet"}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-white/45">Ship to:</span>{" "}
                  <span className="font-semibold text-white">
                    {mailing.address
                      ? `${mailing.address}, ${mailing.city}, ${mailing.state} ${mailing.zip}`
                      : "Not entered yet"}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-white/45">Setup charge:</span>{" "}
                  <span className="font-semibold text-white">{currency(pricing.setupTotal)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-white/45">Monthly:</span>{" "}
                  <span className="font-semibold text-white">
                    {currency(pricing.monthlyTotal)}/month
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-white/45">Payment method:</span>{" "}
                  <span className="font-semibold text-white">Cash App primary / Zelle backup</span>
                </div>
                <div className="mt-2">
                  <span className="text-white/45">Status:</span>{" "}
                  <span className="font-semibold text-white">{receiptStatusText}</span>
                </div>
                <div className="mt-2">
                  <span className="text-white/45">Email status:</span>{" "}
                  <span className="font-semibold text-white">{emailStatusText}</span>
                </div>

                <div className="mt-4 border-t border-white/[0.08] pt-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Pet profile{petCount > 1 ? "s" : ""}
                  </div>

                  <div className="mt-3 space-y-3">
                    {pets.map((pet, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-white/[0.08] bg-[#07131f] p-3"
                      >
                        <div className="font-semibold text-white">
                          {pet.name.trim() || `Pet ${index + 1}`}
                        </div>
                        <div className="mt-1 text-white/55">{petSummaryLine(pet)}</div>
                        {pet.notes.trim() ? (
                          <div className="mt-2 text-white/45">Notes: {pet.notes}</div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {paymentMarked ? (
                <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="flex items-center gap-2 text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      Payment submitted. We will verify it before the order moves to fulfillment.
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <aside className={`${orderPlaced && !paymentMarked ? "" : "hidden"} rounded-[28px] border border-cyan-300/10 bg-[#091824] p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.06)]`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
                  Pet Tag Payment
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-white">Complete your payment</h2>
              </div>
              <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {orderPlaced ? "Order Ready" : "Ready"}
              </div>
            </div>

            <p className="mt-2 text-sm text-white/70">
              Choose Cash App or Zelle to complete your setup payment.
            </p>

            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Your Pet Tag
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {selectedOrderTitle}
                </h3>
                <p className="mt-1 text-sm text-neutral-200">
                  {pricing.petCount} pet{petCount > 1 ? "s" : ""} · Setup {currency(pricing.setupTotal)}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  Monthly {currency(pricing.monthlyTotal)}/month
                </p>
                {firstPet?.type?.trim() || firstPet?.breed?.trim() ? (
                  <p className="mt-1 text-sm text-white/55">
                    {petSummaryLine(firstPet)}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                  Payment Amount
                </span>
                <input
                  type="text"
                  value={paymentAmount}
                  readOnly
                  aria-readonly="true"
                  className="w-full cursor-not-allowed rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm font-semibold text-white/85 outline-none"
                />

                <p className="mt-2 text-xs leading-5 text-white/45">
                  Calculated automatically from the number of Pet Tags in this order.
                </p>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                  Payment Memo
                </span>
                <input
                  type="text"
                  value={paymentMemo}
                  onChange={(event) => setPaymentMemo(event.target.value)}
                  className="w-full rounded-xl border border-white/[0.10] bg-[#050e18]/85 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
                  placeholder="Guardian Pet Tag"
                />
              </label>
            </div>

            {!orderPlaced ? (
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] p-4">
                <div className="text-sm font-semibold text-amber-100">
                  Place your order to unlock payment
                </div>

                <p className="mt-1 text-xs leading-5 text-white/50">
                  Your order is saved first so payment can be tied to the correct order ID.
                </p>
              </div>
            ) : null}

            <div
              className={`mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 ${
                orderPlaced ? "" : "pointer-events-none opacity-40"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white">Cash App</div>
                <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Primary
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#07131f] p-3 text-sm text-white/70">
                Amount: <span className="font-semibold text-white">${paymentAmount || "0.00"}</span>
                <br />
                Memo: <span className="font-semibold text-white">{paymentMemo || "No memo"}</span>
              </div>

              <div className="mt-3 rounded-2xl border border-white/[0.08] bg-[#07131f] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  <QrCode className="h-4 w-4" />
                  Scan to pay
                </div>

                <div className="flex justify-center">
                  <img
                    src={cashAppQr}
                    alt="Cash App payment QR"
                    className={`h-56 w-56 rounded-2xl border border-white/10 bg-white p-3 ${
                      orderPlaced ? "" : "blur-lg"
                    }`}
                  />
                </div>

                <p className="mt-3 text-center text-xs leading-5 text-white/55">
                  On desktop: scan this QR with your phone to open Cash App fast.
                </p>
              </div>

              <div className="mt-3 grid gap-2">
                <a
                  href={orderPlaced ? cashAppUrl : undefined}
                  aria-disabled={!orderPlaced}
                  tabIndex={orderPlaced ? 0 : -1}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-4 text-base font-bold text-[#07111f] transition hover:bg-cyan-200"
                >
                  <ExternalLink className="h-4 w-4" />
                  Pay with Cash App
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (!orderPlaced) return;
                    copyText(cashAppUrl, "Cash App link");
                  }}
                  disabled={!orderPlaced}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/16 bg-white/[0.035] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.07]"
                >
                  {copiedLabel === "Cash App link" ? "Copied Cash App Link" : "Copy Cash App Link"}
                </button>
              </div>
            </div>

            <div
              className={`mt-4 rounded-2xl border border-neutral-800 bg-black/50 p-4 ${
                orderPlaced ? "" : "pointer-events-none opacity-40"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Zelle</p>
                  <p className="mt-1 text-xs text-white/55">{ZELLE_CONTACT}</p>
                </div>
                <div className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                  Backup
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#07131f] p-3 text-sm text-white/70">
                Send to: <span className="font-semibold text-white">{ZELLE_CONTACT}</span>
                <br />
                Memo: <span className="font-semibold text-white">{paymentMemo || "No memo"}</span>
                <br />
                Phone: <span className="font-semibold text-white">{ORDER_CONTACT_PHONE}</span>
              </div>

              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!orderPlaced) return;
                    copyText(zelleCopyText, "Zelle payment details");
                  }}
                  disabled={!orderPlaced}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black"
                >
                  {copiedLabel === "Zelle payment details"
                    ? "Copied Zelle Details"
                    : "Copy Zelle Details"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!orderPlaced) return;
                    copyText(paymentMemo, "memo");
                  }}
                  disabled={!orderPlaced}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/16 bg-white/[0.035] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.07]"
                >
                  {copiedLabel === "memo" ? "Copied Memo" : "Copy Memo Only"}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={markPaid}
              className={`mt-4 w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                orderPlaced
                  ? "border-emerald-300/25 bg-emerald-300 text-[#07111f] hover:bg-emerald-200"
                  : "cursor-not-allowed border-neutral-800 bg-neutral-900 text-white/45"
              }`}
              disabled={!orderPlaced}
            >
              I Sent Payment
            </button>

            <div className="mt-3 rounded-2xl border border-white/[0.08] bg-[#050e18]/75 p-4 text-xs leading-6 text-white/55">
              Place the order first, send the exact setup payment through Cash App or Zelle, then tap I Sent Payment. We verify the payment before fulfillment.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}










