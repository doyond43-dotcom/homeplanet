import { useEffect, useMemo, useRef, useState } from "react";
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

  return parts.length ? parts.join(" \u00B7 ") : "Profile not entered yet";
}

function buildQrImageUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(data)}`;
}

export default function GuardianJoinDesk() {
  const [searchParams] = useSearchParams();

  const [petCount, setPetCount] = useState(
    () => parsePetCount(searchParams.get("pets")),
  );
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cashapp");
  const [paymentAmount, setPaymentAmount] = useState(pricing.setupTotal.toFixed(2));
  const [paymentMemo, setPaymentMemo] = useState(buildPetAwareMemo("", petCount, []));
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [confirmationDrawerOpen, setConfirmationDrawerOpen] = useState(false);
  const [paymentConfirmationMessage, setPaymentConfirmationMessage] = useState(
    "Payment submitted. Your order is waiting for verification.",
  );
  const [paymentMarked, setPaymentMarked] = useState(false);
  const [markingPayment, setMarkingPayment] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [manualPaymentOpen, setManualPaymentOpen] = useState(false);
  const paypalCaptureStarted = useRef(false);
  const [orderId, setOrderId] = useState(makeOrderId());
    const [customerAccessToken, setCustomerAccessToken] =
    useState("");const [submittingOrder, setSubmittingOrder] = useState(false);
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

  useEffect(() => {
    const paypalFlow = searchParams.get("paypal");
    const paypalOrderId = searchParams.get("token");

    if (!paypalFlow) return;

    const storedCheckoutRaw = window.localStorage.getItem(
      "guardian-paypal-checkout",
    );

    let storedCheckout: {
      orderId?: string;
      customerAccessToken?: string;
    } | null = null;

    try {
      storedCheckout = storedCheckoutRaw
        ? JSON.parse(storedCheckoutRaw)
        : null;
    } catch {
      storedCheckout = null;
    }

    const storedOrderId = storedCheckout?.orderId?.trim() || "";
    const storedAccessToken =
      storedCheckout?.customerAccessToken?.trim() || "";

    if (storedOrderId) {
      setOrderId(storedOrderId);
      setOrderPlaced(true);
    }

    if (storedAccessToken) {
      setCustomerAccessToken(storedAccessToken);
    }

    const cleanPayPalQuery = () => {
      const cleanUrl = new URL(window.location.href);

      cleanUrl.searchParams.delete("paypal");
      cleanUrl.searchParams.delete("token");
      cleanUrl.searchParams.delete("PayerID");

      window.history.replaceState(
        {},
        document.title,
        `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`,
      );
    };

    if (paypalFlow === "cancel") {
      setPaymentDrawerOpen(true);
      setConfirmationDrawerOpen(false);
      setSubmitError(
        "PayPal checkout was canceled. Your Guardian order is still saved.",
      );
      cleanPayPalQuery();
      return;
    }

    if (
      paypalFlow !== "return" ||
      !paypalOrderId ||
      !storedOrderId ||
      !storedAccessToken ||
      paypalCaptureStarted.current
    ) {
      return;
    }

    paypalCaptureStarted.current = true;
    setSubmitError("");
    setMarkingPayment(true);

    void (async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "paypal-capture-order",
          {
            body: {
              order_id: storedOrderId,
              customer_access_token: storedAccessToken,
              paypal_order_id: paypalOrderId,
            },
          },
        );

        if (error) throw error;

        if (!data?.ok) {
          throw new Error(
            data?.error || "PayPal payment could not be verified.",
          );
        }

        const { data: restoredOrderData, error: restoredOrderError } =
          await supabase.rpc("get_guardian_customer_order", {
            requested_access_token: storedAccessToken,
          });

        if (restoredOrderError) {
          throw new Error(
            `Payment was verified, but the order receipt could not be restored: ${restoredOrderError.message}`,
          );
        }

        const restoredOrder = Array.isArray(restoredOrderData)
          ? restoredOrderData[0]
          : restoredOrderData;

        if (!restoredOrder) {
          throw new Error(
            "Payment was verified, but the saved Guardian order could not be found.",
          );
        }

        const restoredPets = Array.isArray(restoredOrder.pets)
          ? restoredOrder.pets
          : [];

        setMailing({
          fullName: restoredOrder.customer_name || "",
          address: restoredOrder.shipping_address || "",
          city: restoredOrder.shipping_city || "",
          state: restoredOrder.shipping_state || "",
          zip: restoredOrder.shipping_zip || "",
          email: restoredOrder.customer_email || "",
          phone: restoredOrder.customer_phone || "",
        });

        if (restoredPets.length > 0) {
          setPets(restoredPets);
          setPetCount(restoredPets.length);
        }

        setPaymentAmount(
          Number(restoredOrder.setup_total || 0).toFixed(2),
        );

        setPaymentMemo(
          restoredOrder.payment_memo ||
            `${storedOrderId} Â· Guardian Pet Tag`,
        );

        setPaymentMarked(true);
        setPaymentVerified(true);
        setPaymentConfirmationMessage(
          "PayPal payment captured and verified. Your Guardian Pet Tag order is moving into fulfillment.",
        );

        setPaymentDrawerOpen(false);
        cleanPayPalQuery();
        window.localStorage.removeItem("guardian-paypal-checkout");

        window.setTimeout(() => {
          setConfirmationDrawerOpen(true);
        }, 180);
      } catch (error) {
        console.error("Could not capture PayPal payment:", error);

        paypalCaptureStarted.current = false;
        setPaymentDrawerOpen(true);

        setSubmitError(
          error instanceof Error && error.message
            ? error.message
            : "Your PayPal approval was received, but HomePlanet could not verify the capture. Your order is still saved.",
        );
      } finally {
        setMarkingPayment(false);
      }
    })();
  }, [searchParams]);
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
          pet.age.trim() &&
          pet.photoDataUrl,
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

    const nextOrderId = makeOrderId();    const nextCustomerAccessToken = crypto.randomUUID();



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
          customer_access_token: nextCustomerAccessToken,
    };

    try {
      const { error: insertError } = await supabase
        .from("guardian_orders")
        .insert(orderPayload);

            if (insertError) {
        throw new Error(insertError.message);
      }

      const { error: checkoutError } = await supabase.rpc(
        "create_guardian_homeplanet_checkout",
        {
          requested_order_id: nextOrderId,
          requested_access_token: nextCustomerAccessToken,
        },
      );

      if (checkoutError) {
        throw new Error(
          `Order saved, but HomePlanet Checkout could not be created: ${checkoutError.message}`,
        );
      }

      setOrderId(nextOrderId);
      setCustomerAccessToken(nextCustomerAccessToken);

      setOrderPlaced(true);

      setPaymentDrawerOpen(false);
      setConfirmationDrawerOpen(false);
      setPaymentMarked(false);
      setPaymentVerified(false);


      setPaymentMemo(

        `${nextOrderId} \u00B7 ${buildPetAwareMemo(

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

  async function startPayPalCheckout() {
    if (!orderPlaced || markingPayment) return;

    setSubmitError("");
    setMarkingPayment(true);

    try {
      if (!customerAccessToken) {
        throw new Error(
          "Your checkout access token is missing. Reopen your order receipt before starting PayPal.",
        );
      }

      const returnUrl = new URL(window.location.href);
      returnUrl.searchParams.set("paypal", "return");
      returnUrl.searchParams.delete("token");
      returnUrl.searchParams.delete("PayerID");

      const cancelUrl = new URL(window.location.href);
      cancelUrl.searchParams.set("paypal", "cancel");
      cancelUrl.searchParams.delete("token");
      cancelUrl.searchParams.delete("PayerID");

      window.localStorage.setItem(
        "guardian-paypal-checkout",
        JSON.stringify({
          orderId,
          customerAccessToken,
        }),
      );

      const { data, error } = await supabase.functions.invoke(
        "paypal-create-order",
        {
          body: {
            order_id: orderId,
            customer_access_token: customerAccessToken,
            return_url: returnUrl.toString(),
            cancel_url: cancelUrl.toString(),
          },
        },
      );

      if (error) throw error;

      if (!data?.ok || !data?.approval_url) {
        throw new Error(
          data?.error || "PayPal did not return a checkout link.",
        );
      }

      window.location.assign(data.approval_url);
    } catch (error) {
      console.error("Could not start PayPal checkout:", error);

      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "Your order is saved, but PayPal checkout could not be started.",
      );

      setMarkingPayment(false);
    }
  }
  async function markPaid() {
    if (!orderPlaced || markingPayment) {
      return;
    }

    setSubmitError("");
    setMarkingPayment(true);

    try {
            if (!customerAccessToken) {
        throw new Error(
          "Your checkout access token is missing. Reopen your order receipt before submitting payment.",
        );
      }

      const checkoutPaymentMethod =
        paymentMethod === "zelle" ? "zelle" : "cash_app";

      const { error } = await supabase.rpc(
        "submit_homeplanet_manual_payment",
        {
          requested_access_token: customerAccessToken,
          requested_payment_method: checkoutPaymentMethod,
        },
      );

      if (error) {
        throw error;
      }

      setPaymentMarked(true);

      setPaymentConfirmationMessage(
        paymentMethod === "zelle"
          ? "Zelle payment submitted. Your order is waiting for verification."
          : "Cash App payment submitted. Your order is waiting for verification.",
      );

      setPaymentDrawerOpen(false);

      window.setTimeout(() => {
        setConfirmationDrawerOpen(true);
      }, 180);
    } catch (error) {
      console.error("Could not record payment submission:", error);

      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "Your order is saved, but we could not record that payment was submitted. Please contact us before trying again.",
      );
    } finally {
      setMarkingPayment(false);
    }
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

  const receiptStatusLabel = paymentVerified
    ? "Payment Verified"
    : paymentMarked
      ? "Waiting for verification"
      : orderPlaced
        ? "Pending Payment"
        : "Not Placed";

  const receiptStatusText = paymentVerified
    ? "PayPal payment captured and verified"
    : paymentMarked
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
                  &larr;
                </span>

                <span className="relative inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/[0.07] py-2 pl-5 pr-4 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                  <span className="absolute left-2.5 h-1.5 w-1.5 rounded-full border border-cyan-200/60" />
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
                {orderPlaced
                ? `${selectedOrderTitle}'s Pet Tag Order`
                : "Get your pet's tag set up."}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
                {orderPlaced
                ? "Follow your order from payment verification through activation, shipping, and delivery."
                : "Add your information and your pet. We'll take care of the rest."}
              </p>

              <div className="hidden">
                <Link
                  to="/planet/guardian-pet"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/16 bg-white/[0.035] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.07]"
                >
                  &larr; Back to Pet Tag
                </Link>
              </div>
            </div>

            <div className={orderPlaced ? "hidden" : ""}>
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
                    placeholder="Email"
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
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold tracking-[-0.02em] text-white">
                    Pet Tags Needed
                  </h2>
                  <p className="mt-1 text-sm text-white/45">
                    One tag for each pet. Up to 6 tags per order.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/[0.1] bg-[#050e18]/75 p-2">
                  <button
                    type="button"
                    aria-label="Remove one Pet Tag"
                    disabled={orderPlaced || petCount <= 1}
                    onClick={() =>
                      setPetCount((current) => Math.max(1, current - 1))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-2xl font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    &minus;
                  </button>

                  <div
                    aria-live="polite"
                    className="min-w-10 text-center text-2xl font-bold text-white"
                  >
                    {petCount}
                  </div>

                  <button
                    type="button"
                    aria-label="Add one Pet Tag"
                    disabled={orderPlaced || petCount >= 6}
                    onClick={() =>
                      setPetCount((current) => Math.min(6, current + 1))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-2xl font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    +
                  </button>
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

                          <div className="mt-4 flex flex-wrap gap-3"><label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20">
                              Add Photo
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

                <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-4 sm:col-span-2">
                  <div className="text-xs uppercase tracking-[0.18em] text-emerald-200/70">
                    Shipping
                  </div>
                  <div className="mt-2 text-base font-semibold text-white">
                    Standard tracked shipping included
                  </div>
                  <div className="mt-1 text-sm text-white/50">
                    No additional shipping charge.
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

            </div>

            {orderPlaced && !paymentMarked && !paymentDrawerOpen ? (
              <button
                type="button"
                onClick={() => setPaymentDrawerOpen(true)}
                className="mt-3 w-full rounded-2xl border border-cyan-300/25 bg-cyan-300 px-5 py-4 text-base font-bold text-[#07111f] transition hover:bg-cyan-200"
              >
                Continue to Payment
              </button>
            ) : null}
            <div className={`${orderPlaced ? "" : "hidden"} mt-3 rounded-[28px] border border-white/[0.08] bg-[#091724] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]`}>
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.025em] text-white">
                    {paymentVerified
                      ? "Payment verified"
                      : paymentMarked
                        ? "Payment submitted"
                        : "Your Pet Tag order is ready"}
                  </h2>
                  <p className="mt-1 text-sm text-white/45">
                    {paymentVerified
                      ? "Your PayPal payment is verified and fulfillment can begin."
                      : paymentMarked
                        ? "Your order is waiting for verification."
                        : "This is your order receipt. Continue to payment when you are ready."}
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
                  <span className="text-white/45">Shipping:</span>{" "}
                  <span className="font-semibold text-white">
                    Standard tracked shipping included
                  </span>
                </div>
                <div className="mt-1 text-sm text-white/45">
                  No additional shipping charge.
                </div>
                <div className="mt-2">
                  <span className="text-white/45">Payment method:</span>{" "}
                  <span className="font-semibold text-white">
                    {paymentVerified
                      ? "PayPal"
                      : paymentMethod === "zelle"
                        ? "Zelle"
                        : "Cash App"}
                  </span>
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
              {customerAccessToken ? (
                <Link
                  to={`/planet/guardian-pet/order/${customerAccessToken}`}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-[#07111f] transition hover:bg-cyan-200"
                >
                  View My Order
                </Link>
              ) : null}


              {paymentMarked ? (
                <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="flex items-center gap-2 text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      {paymentVerified
                        ? "Your payment is verified. We'll update this page as your tag moves into preparation and shipping."
                        : "We'll update this page when your payment is verified and your tag moves into preparation."}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {orderPlaced && confirmationDrawerOpen ? (
            <div
              className="fixed inset-0 z-[110] flex items-start justify-center bg-black/75 px-0 backdrop-blur-sm sm:px-4 sm:pt-6"
              role="presentation"
            >
              <button
                type="button"
                aria-label="Close payment confirmation"
                onClick={() => setConfirmationDrawerOpen(false)}
                className="absolute inset-0 cursor-default"
              />

              <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="pet-tag-confirmation-title"
                className="relative z-10 max-h-[94vh] w-full overflow-y-auto rounded-b-[28px] border border-emerald-300/15 bg-[#091824] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.5)] sm:max-w-2xl sm:rounded-[28px]"
              >
                <button
                  type="button"
                  aria-label="Close payment confirmation"
                  onClick={() => setConfirmationDrawerOpen(false)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-[#050e18]/90 text-xl font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                >
                  &times;
                </button>

                <div className="pr-12">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
                    Payment submitted
                  </p>

                  <h2
                    id="pet-tag-confirmation-title"
                    className="mt-2 text-2xl font-bold tracking-[-0.025em] text-white"
                  >
                    We received your payment update
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {paymentConfirmationMessage}
                  </p>
                </div>

                <div className="mt-6 rounded-[24px] border border-white/[0.08] bg-[#06111c] p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-[#07111f]">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Order received
                        </p>
                        <p className="text-xs text-white/45">
                          Your Guardian Pet Tag order is saved.
                        </p>
                      </div>
                    </div>

                    <div className="ml-3 h-4 border-l border-emerald-300/30" />

                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-[#07111f]">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Payment submitted
                        </p>
                        <p className="text-xs text-white/45">
                          Your payment update is attached to this order.
                        </p>
                      </div>
                    </div>

                    <div className="ml-3 h-4 border-l border-cyan-300/35" />

                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-300/10">
                        <div className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-cyan-100">
                            {paymentVerified ? "Payment verified" : "Verification"}
                          </p>

                          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                            {paymentVerified ? "Complete" : "Current step"}
                          </span>
                        </div>

                        <p className="text-xs text-white/45">
                          We are confirming the payment before activation.
                        </p>
                      </div>
                    </div>

                    <div className="ml-3 h-4 border-l border-white/[0.12]" />

                    <div className="flex items-center gap-3 opacity-55">
                      <div className="h-7 w-7 shrink-0 rounded-full border border-white/[0.18] bg-white/[0.03]" />

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Tag activation
                        </p>
                        <p className="text-xs text-white/45">
                          Your Guardian profile and tag will be prepared.
                        </p>
                      </div>
                    </div>

                    <div className="ml-3 h-4 border-l border-white/[0.12]" />

                    <div className="flex items-center gap-3 opacity-55">
                      <div className="h-7 w-7 shrink-0 rounded-full border border-white/[0.18] bg-white/[0.03]" />

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Shipping
                        </p>
                        <p className="text-xs text-white/45">
                          Tracking will appear when your tag ships.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmationDrawerOpen(false)}
                  className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-4 text-base font-bold text-[#07111f] transition hover:bg-emerald-200"
                >
                  View My Order
                </button>
              </aside>
            </div>
          ) : null}
          {orderPlaced && paymentDrawerOpen ? (
            <div
              className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 px-0 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
              role="presentation"
            >
              <button
                type="button"
                aria-label="Close payment window"
                onClick={() => setPaymentDrawerOpen(false)}
                className="absolute inset-0 cursor-default"
              />

              <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="pet-tag-payment-title"
                className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] border border-cyan-300/15 bg-[#091824] p-4 shadow-[0_-18px_60px_rgba(0,0,0,0.45)] sm:max-w-3xl sm:rounded-[28px] sm:p-5"
              >
                <button
                  type="button"
                  aria-label="Close payment window"
                  onClick={() => setPaymentDrawerOpen(false)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-[#050e18]/90 text-xl font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                >
                  &times;
                </button>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300/80">
                  Order Received
                </p>

                <h2
                  id="pet-tag-payment-title"
                  className="mt-2 pr-12 text-3xl font-bold tracking-[-0.035em] text-white"
                >
                  Your Pet Tag order is ready
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/65">
                  Your order has been created successfully.
                </p>
              </div>

              <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Order Received
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#050e18]/75 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  Order ID
                </span>

                <span className="text-sm font-bold text-white">
                  {orderId}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#050e18]/75 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Order Progress
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-xs font-bold text-[#07111f]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-semibold text-white">
                    Order Received
                  </span>
                </div>

                {!paymentMarked ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10">
                      <div className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-cyan-100">
                        Payment Pending
                      </span>

                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-200">
                        Current Step
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-xs font-bold text-[#07111f]">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                      <span className="text-sm font-semibold text-white">
                        Payment Submitted
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/10">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-amber-100">
                          Payment Verification
                        </span>

                        <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-200">
                          Current Step
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {[
                  "Tag Activated",
                  "Preparing Shipment",
                  "Shipped",
                ].map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="h-6 w-6 shrink-0 rounded-full border border-white/15 bg-white/[0.025]" />
                    <span className="text-sm text-white/40">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/70">
              Complete your one-time setup payment below. We'll verify your payment
              and keep you updated as your order moves through activation and shipping.
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
                  {pricing.petCount} pet{petCount > 1 ? "s" : ""} {"\u00B7"} Setup {currency(pricing.setupTotal)}
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

            <button
              type="button"
              onClick={() => void startPayPalCheckout()}
              className={`mt-4 w-full rounded-2xl border px-5 py-4 text-base font-bold transition ${
                orderPlaced && !markingPayment
                  ? "border-[#0070ba]/40 bg-[#0070ba] text-white hover:bg-[#005ea6]"
                  : "cursor-not-allowed border-neutral-800 bg-neutral-900 text-white/45"
              }`}
              disabled={!orderPlaced || markingPayment}
            >
              {markingPayment ? "Opening PayPal..." : "Pay Securely with PayPal"}
            </button>

            <p className="mt-2 text-center text-xs leading-5 text-white/45">
              PayPal verifies your setup payment automatically.
            </p>

            <button
              type="button"
              onClick={() => setManualPaymentOpen((current) => !current)}
              className="mt-4 flex w-full items-center justify-between rounded-2xl border border-white/[0.10] bg-white/[0.035] px-4 py-3 text-left transition hover:bg-white/[0.06]"
              aria-expanded={manualPaymentOpen}
            >
              <span>
                <span className="block text-sm font-semibold text-white">
                  Other payment options
                </span>
                <span className="mt-0.5 block text-xs text-white/45">
                  Cash App or Zelle
                </span>
              </span>

              <span className="text-lg font-semibold text-white/55">
                {manualPaymentOpen ? "Ã¢Ë†â€™" : "+"}
              </span>
            </button>

            {manualPaymentOpen ? (
              <div className="mt-3 rounded-2xl border border-white/[0.08] bg-[#050e18]/70 p-3">
                <div
                  className={`rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 ${
                    orderPlaced ? "" : "pointer-events-none opacity-40"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">Cash App</div>
                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                      Manual
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-[#07131f] p-3 text-sm text-white/70">
                    Amount:{" "}
                    <span className="font-semibold text-white">
                      ${paymentAmount || "0.00"}
                    </span>
                    <br />
                    Memo:{" "}
                    <span className="font-semibold text-white">
                      {paymentMemo || "No memo"}
                    </span>
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
                  </div>

                  <div className="mt-3 grid gap-2">
                    <a
                      href={orderPlaced ? cashAppUrl : undefined}
                      onClick={() => {
                        if (orderPlaced) {
                          setPaymentMethod("cashapp");
                        }
                      }}
                      aria-disabled={!orderPlaced}
                      tabIndex={orderPlaced ? 0 : -1}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-[#07111f] transition hover:bg-cyan-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Pay with Cash App
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        if (!orderPlaced) return;
                        setPaymentMethod("cashapp");
                        copyText(cashAppUrl, "Cash App link");
                      }}
                      disabled={!orderPlaced}
                      className="inline-flex items-center justify-center rounded-xl border border-white/16 bg-white/[0.035] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.07]"
                    >
                      {copiedLabel === "Cash App link"
                        ? "Copied Cash App Link"
                        : "Copy Cash App Link"}
                    </button>
                  </div>
                </div>

                <div
                  className={`mt-3 rounded-2xl border border-neutral-800 bg-black/50 p-4 ${
                    orderPlaced ? "" : "pointer-events-none opacity-40"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Zelle</p>
                      <p className="mt-1 text-xs text-white/55">
                        {ZELLE_CONTACT}
                      </p>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                      Manual
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-[#07131f] p-3 text-sm text-white/70">
                    Send to:{" "}
                    <span className="font-semibold text-white">
                      {ZELLE_CONTACT}
                    </span>
                    <br />
                    Memo:{" "}
                    <span className="font-semibold text-white">
                      {paymentMemo || "No memo"}
                    </span>
                    <br />
                    Phone:{" "}
                    <span className="font-semibold text-white">
                      {ORDER_CONTACT_PHONE}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!orderPlaced) return;
                        setPaymentMethod("zelle");
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
                        setPaymentMethod("zelle");
                        copyText(paymentMemo, "memo");
                      }}
                      disabled={!orderPlaced}
                      className="inline-flex items-center justify-center rounded-xl border border-white/16 bg-white/[0.035] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.07]"
                    >
                      {copiedLabel === "memo" ? "Copied Memo" : "Copy Memo Only"}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void markPaid()}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    orderPlaced && !markingPayment
                      ? "border-emerald-300/25 bg-emerald-300 text-[#07111f] hover:bg-emerald-200"
                      : "cursor-not-allowed border-neutral-800 bg-neutral-900 text-white/45"
                  }`}
                  disabled={!orderPlaced || markingPayment}
                >
                  {markingPayment
                    ? "Submitting Payment..."
                    : "Submit Manual Payment for Verification"}
                </button>

                <p className="mt-3 text-xs leading-5 text-white/45">
                  Manual payments must be reviewed before tag fulfillment begins.
                </p>
              </div>
            ) : null}

            {submitError ? (
              <div
                role="alert"
                className="mt-3 rounded-2xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm font-semibold leading-6 text-rose-100"
              >
                {submitError}
              </div>
            ) : null}
              </aside>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}




















