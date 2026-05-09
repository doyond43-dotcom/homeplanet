import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type OrderForm = {
  customer_name: string;
  phone: string;
  email: string;
  product_type: string;
  quantity: string;
  notes: string;
  marketing_opt_in: boolean;
};

const initialForm: OrderForm = {
  customer_name: "",
  phone: "",
  email: "",
  product_type: "",
  quantity: "",
  notes: "",
  marketing_opt_in: true,
};

export default function PrintShopOrderPage() {
  const [form, setForm] = useState<OrderForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const updateField = (field: keyof OrderForm, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submitOrder = async () => {
    setSuccess("");
    setError("");

    if (!form.customer_name.trim()) {
      setError("Please enter your name or business name.");
      return;
    }

    if (!form.phone.trim() && !form.email.trim()) {
      setError("Please enter a phone number or email so the shop can contact you.");
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase.from("printshop_orders").insert({
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      product_type: form.product_type.trim(),
      quantity: form.quantity.trim(),
      notes: form.notes.trim(),
      marketing_opt_in: form.marketing_opt_in,
      status: "quote-received",
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setForm(initialForm);
    setSuccess("Order request sent. The shop can review it now.");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 bg-black/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/planet/printshop" className="text-sm font-bold tracking-wide">
            LIVE PRINT STUDIO
          </Link>

          <Link
            to="/planet/printshop"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-300">
          START ORDER
        </div>

        <h1 className="text-5xl font-black tracking-tight">Start Your Print Order</h1>

        <p className="mt-4 max-w-2xl text-white/60">
          Tell us what you need printed. Shirts, hats, banners, decals, embroidery, rush jobs, or full business/event packages.
        </p>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <Field label="Name / Business">
            <input
              value={form.customer_name}
              onChange={(event) => updateField("customer_name", event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Enter name or business"
            />
          </Field>

          <Field label="Phone Number">
            <input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Enter phone number"
            />
          </Field>

          <Field label="Email">
            <input
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Enter email"
            />
          </Field>

          <Field label="Product Type">
            <input
              value={form.product_type}
              onChange={(event) => updateField("product_type", event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Shirts, hats, banners, decals..."
            />
          </Field>

          <Field label="Quantity">
            <input
              value={form.quantity}
              onChange={(event) => updateField("quantity", event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="How many?"
            />
          </Field>

          <div className="rounded-3xl border border-white/10 bg-[#111111] p-5">
            <label className="flex items-start gap-3 text-sm font-semibold text-white/70">
              <input
                type="checkbox"
                checked={form.marketing_opt_in}
                onChange={(event) => updateField("marketing_opt_in", event.target.checked)}
                className="mt-1"
              />
              Send me order updates and occasional shop specials.
            </label>
          </div>
        </section>

        <div className="mt-6 rounded-3xl border border-white/10 bg-[#111111] p-5">
          <label className="text-sm font-semibold text-white/70">Order Notes</label>

          <textarea
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            className="mt-3 min-h-32 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
            placeholder="Sizes, colors, artwork notes, event details, rush instructions..."
          />
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
            {success}
          </div>
        )}

        <button
          onClick={submitOrder}
          disabled={saving}
          className="mt-8 rounded-full bg-cyan-400 px-7 py-3 font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Sending..." : "Submit Order Request"}
        </button>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-5">
      <label className="text-sm font-semibold text-white/70">{label}</label>
      {children}
    </div>
  );
}
