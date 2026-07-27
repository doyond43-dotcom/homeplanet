import { useState } from "react";
import { CheckCircle2, Copy, ExternalLink, X } from "lucide-react";
import { supabase } from "../lib/supabase";

type PaymentStatus =
  | "pending_payment"
  | "payment_verified";

type CreatedOrder = {
  order_id: string;
  customer_access_token: string;
};

type FormState = {
  customerName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  petName: string;
  petType: string;
  breed: string;
  age: string;
  color: string;
  notes: string;
  photoDataUrl: string;
  paymentStatus: PaymentStatus;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
};

const emptyForm: FormState = {
  customerName: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "Okeechobee",
  state: "Florida",
  zip: "34974",
  petName: "",
  petType: "Dog",
  breed: "",
  age: "",
  color: "",
  notes: "",
  photoDataUrl: "",
  paymentStatus: "pending_payment",
};

function normalizeCreatedOrder(value: unknown): CreatedOrder | null {
  if (Array.isArray(value)) {
    return (value[0] as CreatedOrder | undefined) ?? null;
  }

  return value && typeof value === "object"
    ? (value as CreatedOrder)
    : null;
}

export default function GuardianInPersonOrderDrawer({
  open,
  onClose,
  onCreated,
}: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdOrder, setCreatedOrder] =
    useState<CreatedOrder | null>(null);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const customerOrderUrl = createdOrder
    ? `${window.location.origin}/planet/guardian-pet/order/${createdOrder.customer_access_token}`
    : "";

  const inputClass =
    "mt-2 min-h-12 w-full rounded-2xl border border-white/[0.1] bg-[#07111f] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-300/45";

  function update<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updatePetPhoto(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Choose a valid pet photo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setErrorMessage("The pet photo could not be read.");
        return;
      }

      update("photoDataUrl", reader.result);
      setErrorMessage("");
    };

    reader.onerror = () => {
      setErrorMessage("The pet photo could not be read.");
    };

    reader.readAsDataURL(file);
  }

  function closeDrawer() {
    if (saving) return;

    setForm(emptyForm);
    setErrorMessage("");
    setCreatedOrder(null);
    setCopied(false);
    onClose();
  }

  async function createOrder() {
    if (
      !form.customerName.trim() ||
      !form.email.trim() ||
      !form.streetAddress.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.zip.trim() ||
      !form.petName.trim() ||
      !form.photoDataUrl
    ) {
      setErrorMessage(
        "Complete the customer, shipping address, pet name, and pet photo.",
      );
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.rpc(
        "create_guardian_in_person_order",
        {
          requested_customer_name: form.customerName.trim(),
          requested_customer_email: form.email.trim(),
          requested_customer_phone: form.phone.trim(),
          requested_shipping_address:
            form.streetAddress.trim(),
          requested_shipping_city: form.city.trim(),
          requested_shipping_state: form.state.trim(),
          requested_shipping_zip: form.zip.trim(),
          requested_pet_name: form.petName.trim(),
          requested_pet_type: form.petType.trim(),
          requested_pet_breed: form.breed.trim(),
          requested_pet_age: form.age.trim(),
          requested_pet_color: form.color.trim(),
          requested_pet_notes: form.notes.trim(),
          requested_pet_photo_data_url: form.photoDataUrl,
                    requested_payment_status: "pending_payment",
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      const created = normalizeCreatedOrder(data);

      if (
        !created?.order_id ||
        !created.customer_access_token
      ) {
        throw new Error(
          "The new order was created without a customer link.",
        );
      }

            const { error: checkoutError } = await supabase.rpc(
        "create_guardian_homeplanet_checkout",
        {
          requested_order_id: created.order_id,
          requested_access_token:
            created.customer_access_token,
        },
      );

      if (checkoutError) {
        throw new Error(
          `Order created, but HomePlanet Checkout could not be created: ${checkoutError.message}`,
        );
      }

      if (form.paymentStatus === "payment_verified") {
        const { data: checkoutData, error: checkoutReadError } =
          await supabase.rpc(
            "get_homeplanet_operator_checkout",
            {
              requested_product_type: "guardian_pet_tag",
              requested_product_order_id: created.order_id,
            },
          );

        if (checkoutReadError) {
          throw new Error(checkoutReadError.message);
        }

        const checkoutRecord = Array.isArray(checkoutData)
          ? checkoutData[0]
          : checkoutData;

        const checkoutId =
          checkoutRecord &&
          typeof checkoutRecord === "object" &&
          "checkout_id" in checkoutRecord
            ? String(checkoutRecord.checkout_id)
            : "";

        if (!checkoutId) {
          throw new Error(
            "The shared checkout was created without an operator checkout ID.",
          );
        }

        const { error: cashPaymentError } = await supabase.rpc(
          "record_homeplanet_cash_payment",
          {
            requested_checkout_id: checkoutId,
          },
        );

        if (cashPaymentError) {
          throw new Error(cashPaymentError.message);
        }
      }

      setCreatedOrder(created);
      await onCreated();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create the in-person order.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function copyCustomerLink() {
    try {
      await navigator.clipboard.writeText(customerOrderUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      setErrorMessage("Could not copy the customer link.");
    }
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close in-person order"
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="in-person-order-title"
        className="absolute inset-y-0 right-0 w-full overflow-y-auto border-l border-white/[0.09] bg-[#09131f] shadow-2xl sm:max-w-xl"
      >
        <div className="sticky top-0 z-10 border-b border-white/[0.08] bg-[#09131f]/95 px-5 py-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200/65">
                Guardian Pet Tag
              </p>

              <h2
                id="in-person-order-title"
                className="mt-2 text-2xl font-bold"
              >
                Create In-Person Order
              </h2>

              <p className="mt-2 text-sm text-white/50">
                Enter the order once while you are with the customer.
              </p>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              disabled={saving}
              aria-label="Close"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.04]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-7">
          {errorMessage ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-300/20 bg-red-300/[0.08] p-4 text-sm text-red-100"
            >
              {errorMessage}
            </div>
          ) : null}

          {createdOrder ? (
            <section className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.08] p-5">
              <div className="flex items-center gap-3 text-emerald-100">
                <CheckCircle2 className="h-6 w-6" />

                <div>
                  <h3 className="text-xl font-bold">
                    Order Created
                  </h3>

                                    <p className="mt-1 text-sm text-emerald-100/65">
                    {createdOrder.order_id}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-emerald-100/55">
                    The order and its HomePlanet Checkout record are connected.
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-white/60">
                Give the customer this private link so they can follow
                their order through delivery.
              </p>

              <button
                type="button"
                onClick={() => void copyCustomerLink()}
                className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-4 text-base font-bold text-[#07111f]"
              >
                <Copy className="h-5 w-5" />
                {copied
                  ? "Customer Link Copied"
                  : "Copy Customer Link"}
              </button>

              <a
                href={customerOrderUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.12] bg-white/[0.04] px-5 py-3 text-sm font-bold"
              >
                View Customer Order
                <ExternalLink className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={closeDrawer}
                className="mt-3 min-h-12 w-full rounded-2xl border border-white/[0.1] px-5 py-3 text-sm font-bold text-white/75"
              >
                Done
              </button>
            </section>
          ) : (
            <>
              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5">
                <h3 className="text-lg font-bold">Customer</h3>

                <div className="mt-5 space-y-4">
                  <label className="block text-xs font-semibold text-white/60">
                    Full Name
                    <input
                      autoComplete="name"
                      value={form.customerName}
                      onChange={(event) =>
                        update("customerName", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="block text-xs font-semibold text-white/60">
                    Email
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) =>
                        update("email", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="block text-xs font-semibold text-white/60">
                    Phone
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(event) =>
                        update("phone", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5">
                <h3 className="text-lg font-bold">Shipping</h3>

                <div className="mt-5 space-y-4">
                  <label className="block text-xs font-semibold text-white/60">
                    Street Address
                    <input
                      autoComplete="street-address"
                      value={form.streetAddress}
                      onChange={(event) =>
                        update("streetAddress", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <label className="block text-xs font-semibold text-white/60">
                    City
                    <input
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(event) =>
                        update("city", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-semibold text-white/60">
                      State
                      <input
                        autoComplete="address-level1"
                        value={form.state}
                        onChange={(event) =>
                          update("state", event.target.value)
                        }
                        className={inputClass}
                      />
                    </label>

                    <label className="block text-xs font-semibold text-white/60">
                      ZIP
                      <input
                        inputMode="numeric"
                        autoComplete="postal-code"
                        value={form.zip}
                        onChange={(event) =>
                          update("zip", event.target.value)
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5">
                <h3 className="text-lg font-bold">Pet</h3>

                <div className="mt-5 space-y-4">
                  <label className="block text-xs font-semibold text-white/60">
                    Pet Name
                    <input
                      value={form.petName}
                      onChange={(event) =>
                        update("petName", event.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-semibold text-white/60">
                      Pet Type
                      <input
                        value={form.petType}
                        onChange={(event) =>
                          update("petType", event.target.value)
                        }
                        className={inputClass}
                      />
                    </label>

                    <label className="block text-xs font-semibold text-white/60">
                      Breed
                      <input
                        value={form.breed}
                        onChange={(event) =>
                          update("breed", event.target.value)
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-semibold text-white/60">
                      Age
                      <input
                        value={form.age}
                        onChange={(event) =>
                          update("age", event.target.value)
                        }
                        className={inputClass}
                      />
                    </label>

                    <label className="block text-xs font-semibold text-white/60">
                      Color / Markings
                      <input
                        value={form.color}
                        onChange={(event) =>
                          update("color", event.target.value)
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <label className="block text-xs font-semibold text-white/60">
                    Notes
                    <textarea
                      rows={4}
                      value={form.notes}
                      onChange={(event) =>
                        update("notes", event.target.value)
                      }
                      className={`${inputClass} resize-none`}
                    />
                  </label>

                  <div>
                    <div className="text-xs font-semibold text-white/60">
                      Pet Photo
                    </div>

                    <div className="mt-2 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#07111f]">
                      {form.photoDataUrl ? (
                        <img
                          src={form.photoDataUrl}
                          alt="Pet preview"
                          className="h-56 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-40 items-center justify-center px-5 text-center text-sm text-white/35">
                          Take or upload a clear photo of the pet.
                        </div>
                      )}
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-[#07111f] transition hover:bg-cyan-200">
                        Take or Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(event) =>
                            updatePetPhoto(event.target.files?.[0])
                          }
                          className="hidden"
                        />
                      </label>

                      {form.photoDataUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            update("photoDataUrl", "")
                          }
                          className="min-h-12 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/75"
                        >
                          Remove Photo
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5">
                <h3 className="text-lg font-bold">Payment</h3>

                <div className="mt-5 space-y-3">
                                    {[
                    {
                      value: "pending_payment",
                      title: "Waiting for Payment",
                      description:
                        "Create the order now. The customer can pay from their private order page.",
                    },
                    {
                      value: "payment_verified",
                      title: "Cash Received and Verified",
                      description:
                        "You personally received the cash payment. HomePlanet will record and verify it now.",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        update(
                          "paymentStatus",
                          option.value as PaymentStatus,
                        )
                      }
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        form.paymentStatus === option.value
                          ? "border-cyan-300/45 bg-cyan-300/[0.1]"
                          : "border-white/[0.08] bg-black/15"
                      }`}
                    >
                      <div className="font-bold">
                        {option.title}
                      </div>

                      <div className="mt-1 text-sm leading-6 text-white/50">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <button
                type="button"
                onClick={() => void createOrder()}
                disabled={saving}
                className="min-h-14 w-full rounded-2xl bg-cyan-300 px-6 py-4 text-base font-bold text-[#07111f] transition hover:bg-cyan-200 disabled:opacity-50"
              >
                {saving
                  ? "Creating Order..."
                  : "Create Pet Tag Order"}
              </button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
