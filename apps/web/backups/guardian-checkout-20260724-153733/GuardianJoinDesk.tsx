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
    <div className="min-h-screen bg-black px-4 py-4 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
          <div className="min-w-0">
            <div className="rounded-[28px] border border-neutral-800 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,#171717_0%,#0a0a0a_100%)] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Guardian Checkout
                </div>
                <div className="rounded-full border border-neutral-700 bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
                  {petCount} pet{petCount > 1 ? "s" : ""}
                </div>
              </div>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                Buy your pet tag today
              </h1>
              <p className="mt-1 max-w-2xl text-xs text-neutral-400">
                Simple transaction. Shipping info, pet info, payment amount, memo, and one clean payment move.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to="/planet/guardian-pet"
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-semibold text-white"
                >
                  Back to Sales Page
                </Link>
              </div>
            </div>

            <div className="mt-3 rounded-[28px] border border-neutral-800 bg-neutral-950 p-4">
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold">Buyer + Shipping</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    This is all the customer needs to complete the order.
                  </p>
                </div>
                <div className="rounded-full border border-neutral-700 bg-black px-3 py-1 text-xs font-semibold text-neutral-300">
                  Order
                </div>
              </div>

              <div className="grid gap-3">
                <input
                  placeholder="Full Name"
                  value={mailing.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                />
                <input
                  placeholder="Street Address"
                  value={mailing.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                />

                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    placeholder="City"
                    value={mailing.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                  />
                  <input
                    placeholder="State"
                    value={mailing.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                  />
                  <input
                    placeholder="ZIP"
                    value={mailing.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    placeholder="Confirmation email"
                    value={mailing.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                  />
                  <input
                    placeholder="Phone"
                    value={mailing.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-[28px] border border-neutral-800 bg-neutral-950 p-4">
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold">Pet Profile{petCount > 1 ? "s" : ""}</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    This is the real animal identity the tag order is for.
                  </p>
                </div>
                <div className="rounded-full border border-neutral-700 bg-black px-3 py-1 text-xs font-semibold text-neutral-300">
                  {petCount} profile{petCount > 1 ? "s" : ""}
                </div>
              </div>

              <div className="space-y-4">
                {pets.map((pet, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-neutral-800 bg-black/40 p-4"
                  >
                    <div className="mb-3 text-sm font-semibold text-white">
                      Pet {index + 1}
                    </div>

                    

                    <div className="mb-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="h-28 w-28 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
                          {pet.photoDataUrl ? (
                            <img
                              src={pet.photoDataUrl}
                              alt={`${pet.name || `Pet ${index + 1}`} preview`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-neutral-500">
                              Pet photo preview
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                            Pet Photo
                          </div>
                          <p className="mt-1 text-sm leading-6 text-neutral-400">
                            Add or take a photo so the tag order has a real visual identity.
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
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
                        className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                      />
                      <input
                        placeholder="Type (Dog, Cat, etc)"
                        value={pet.type}
                        onChange={(e) => updatePet(index, "type", e.target.value)}
                        className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                      />
                      <input
                        placeholder="Breed"
                        value={pet.breed}
                        onChange={(e) => updatePet(index, "breed", e.target.value)}
                        className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                      />
                      <input
                        placeholder="Age"
                        value={pet.age}
                        onChange={(e) => updatePet(index, "age", e.target.value)}
                        className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                      />
                      <input
                        placeholder="Color / markings"
                        value={pet.color}
                        onChange={(e) => updatePet(index, "color", e.target.value)}
                        className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500 sm:col-span-2"
                      />
                    </div>

                    <textarea
                      placeholder="Allergies, meds, temperament, emergency notes"
                      value={pet.notes}
                      onChange={(e) => updatePet(index, "notes", e.target.value)}
                      className="mt-3 min-h-[96px] w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                    />

                    <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-400">
                      {pet.name.trim() ? (
                        <>
                          <div className="font-semibold text-white">{pet.name}</div>
                          <div className="mt-1">{petSummaryLine(pet)}</div>
                          {pet.notes.trim() ? (
                            <div className="mt-2 text-neutral-500">Notes: {pet.notes}</div>
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

            <div className="mt-3 rounded-[28px] border border-neutral-800 bg-neutral-950 p-4">
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Fast pricing, no confusion.
                  </p>
                </div>
                <div className="rounded-full border border-neutral-700 bg-black px-3 py-1 text-xs font-semibold text-neutral-300">
                  {orderId}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-neutral-800 bg-black/40 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    Pet count
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {pricing.petCount}
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-black/40 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    Each Pet Tag
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {currency(TAG_SETUP)} setup + {currency(TAG_MONTHLY)}/mo
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-black/40 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
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
                <div className="rounded-2xl border border-neutral-800 bg-black/40 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    Monthly total
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {currency(pricing.monthlyTotal)}/mo
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-black/40 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
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
                  disabled={submittingOrder}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-60"
                >
                  {submittingOrder ? "Saving Order..." : "Place Order"}
                </button>

                <button
                  type="button"
                  onClick={markPaid}
                  className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold ${
                    orderPlaced
                      ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-50"
                      : "cursor-not-allowed border border-neutral-800 bg-neutral-900 text-neutral-500"
                  }`}
                >
                  I Sent Payment
                </button>
              </div>
            </div>

            <div className="mt-3 rounded-[28px] border border-neutral-800 bg-neutral-950 p-4">
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold">Receipt State</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Quick receipt-style confirmation.
                  </p>
                </div>
                <div className="rounded-full border border-neutral-700 bg-black px-3 py-1 text-xs font-semibold text-neutral-300">
                  {receiptStatusLabel}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-black/40 p-4 text-sm text-neutral-300">
                <div>
                  <span className="text-neutral-500">Order ID:</span>{" "}
                  <span className="font-semibold text-white">{orderId}</span>
                </div>
                <div className="mt-2">
                  <span className="text-neutral-500">Customer:</span>{" "}
                  <span className="font-semibold text-white">
                    {mailing.fullName || "Not entered yet"}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-neutral-500">Confirmation email:</span>{" "}
                  <span className="font-semibold text-white">
                    {mailing.email || "Not entered yet"}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-neutral-500">Ship to:</span>{" "}
                  <span className="font-semibold text-white">
                    {mailing.address
                      ? `${mailing.address}, ${mailing.city}, ${mailing.state} ${mailing.zip}`
                      : "Not entered yet"}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-neutral-500">Setup charge:</span>{" "}
                  <span className="font-semibold text-white">{currency(pricing.setupTotal)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-neutral-500">Monthly:</span>{" "}
                  <span className="font-semibold text-white">
                    {currency(pricing.monthlyTotal)}/month
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-neutral-500">Payment method:</span>{" "}
                  <span className="font-semibold text-white">Cash App primary / Zelle backup</span>
                </div>
                <div className="mt-2">
                  <span className="text-neutral-500">Status:</span>{" "}
                  <span className="font-semibold text-white">{receiptStatusText}</span>
                </div>
                <div className="mt-2">
                  <span className="text-neutral-500">Email status:</span>{" "}
                  <span className="font-semibold text-white">{emailStatusText}</span>
                </div>

                <div className="mt-4 border-t border-neutral-800 pt-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    Pet profile{petCount > 1 ? "s" : ""}
                  </div>

                  <div className="mt-3 space-y-3">
                    {pets.map((pet, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-neutral-800 bg-neutral-950 p-3"
                      >
                        <div className="font-semibold text-white">
                          {pet.name.trim() || `Pet ${index + 1}`}
                        </div>
                        <div className="mt-1 text-neutral-400">{petSummaryLine(pet)}</div>
                        {pet.notes.trim() ? (
                          <div className="mt-2 text-neutral-500">Notes: {pet.notes}</div>
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

          <aside className="sticky top-3 h-fit rounded-[28px] border border-cyan-900/60 bg-[linear-gradient(180deg,rgba(12,30,36,0.96)_0%,rgba(8,14,20,0.98)_100%)] p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
                  Payment Layer
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Take payment fast</h2>
              </div>
              <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {orderPlaced ? "Order Ready" : "Ready"}
              </div>
            </div>

            <p className="mt-2 text-sm text-neutral-300">
              Cash App is the fastest pay-now path. Zelle stays here as backup only.
            </p>

            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Selected Order
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {selectedOrderTitle}
                </h3>
                <p className="mt-1 text-sm text-neutral-200">
                  {pricing.petCount} pet{petCount > 1 ? "s" : ""} · Setup {currency(pricing.setupTotal)}
                </p>
                <p className="mt-1 text-sm text-neutral-300">
                  Monthly {currency(pricing.monthlyTotal)}/month
                </p>
                {firstPet?.type?.trim() || firstPet?.breed?.trim() ? (
                  <p className="mt-1 text-sm text-neutral-400">
                    {petSummaryLine(firstPet)}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                  Payment Amount
                </span>
                <input
                  type="text"
                  value={paymentAmount}
                  readOnly
                  aria-readonly="true"
                  className="w-full cursor-not-allowed rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm font-semibold text-white/85 outline-none"
                />

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  Calculated automatically from the number of Pet Tags in this order.
                </p>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                  Payment Memo
                </span>
                <input
                  type="text"
                  value={paymentMemo}
                  onChange={(event) => setPaymentMemo(event.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
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

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-300">
                Amount: <span className="font-semibold text-white">${paymentAmount || "0.00"}</span>
                <br />
                Memo: <span className="font-semibold text-white">{paymentMemo || "No memo"}</span>
              </div>

              <div className="mt-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
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

                <p className="mt-3 text-center text-xs leading-5 text-neutral-400">
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-black"
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
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-semibold text-white"
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
                  <p className="mt-1 text-xs text-neutral-400">{ZELLE_CONTACT}</p>
                </div>
                <div className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                  Backup
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-300">
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
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-semibold text-white"
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
                  ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-50 hover:bg-emerald-500/25"
                  : "cursor-not-allowed border-neutral-800 bg-neutral-900 text-neutral-500"
              }`}
              disabled={!orderPlaced}
            >
              I Sent Payment
            </button>

            <div className="mt-3 rounded-2xl border border-neutral-800 bg-black/40 p-4 text-xs leading-6 text-neutral-400">
              Place the order first, send the exact setup payment through Cash App or Zelle, then tap I Sent Payment. We verify the payment before fulfillment.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}





