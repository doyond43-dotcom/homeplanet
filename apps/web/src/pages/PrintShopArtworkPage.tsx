import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type ArtworkForm = {
  customer_name: string;
  phone: string;
  email: string;
  artwork_notes: string;
  print_placement: string;
  colors_needed: string;
};

const initialForm: ArtworkForm = {
  customer_name: "",
  phone: "",
  email: "",
  artwork_notes: "",
  print_placement: "",
  colors_needed: "",
};

export default function PrintShopArtworkPage() {
  const [form, setForm] = useState<ArtworkForm>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const updateField = (field: keyof ArtworkForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submitArtwork = async () => {
    setSuccess("");
    setError("");

    if (!form.customer_name.trim()) {
      setError("Please enter your name or business name.");
      return;
    }

    if (!form.phone.trim() && !form.email.trim()) {
      setError("Please enter a phone number or email so the shop can match your artwork.");
      return;
    }

    if (!file) {
      setError("Please choose an artwork file first.");
      return;
    }

    setSaving(true);

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const filePath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("printshop-artwork")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setSaving(false);
      setError(uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("printshop-artwork")
      .getPublicUrl(filePath);

    const artworkUrl = publicUrlData.publicUrl;

    const notes = [
      form.artwork_notes.trim() ? `Artwork notes: ${form.artwork_notes.trim()}` : "",
      form.print_placement.trim() ? `Placement: ${form.print_placement.trim()}` : "",
      form.colors_needed.trim() ? `Colors: ${form.colors_needed.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const { error: insertError } = await supabase.from("printshop_orders").insert({
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      product_type: "Artwork Upload",
      quantity: "",
      notes,
      artwork_url: artworkUrl,
      status: "artwork-review",
      marketing_opt_in: true,
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setForm(initialForm);
    setFile(null);
    setSuccess("Artwork uploaded and saved to the shop board.");
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
          ARTWORK UPLOAD
        </div>

        <h1 className="text-5xl font-black tracking-tight">Upload Your Artwork</h1>

        <p className="mt-4 max-w-2xl text-white/60">
          Send the logo, design, mockup, or reference image for your print job. This keeps artwork review tied to the order flow.
        </p>

        <section className="mt-10 rounded-[32px] border border-dashed border-cyan-400/30 bg-cyan-400/5 p-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400 text-2xl font-black text-black">
            +
          </div>

          <h2 className="text-2xl font-bold">Drop artwork here</h2>

          <p className="mt-3 text-sm text-white/50">
            PNG, JPG, PDF, SVG, AI, or mockup image.
          </p>

          <label className="mt-7 inline-flex cursor-pointer rounded-full bg-cyan-400 px-7 py-3 font-bold text-black transition hover:scale-[1.02]">
            Choose File
            <input
              type="file"
              className="hidden"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>

          {file && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
              Selected: {file.name}
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <Field label="Order / Customer Name">
            <input
              value={form.customer_name}
              onChange={(event) => updateField("customer_name", event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Enter order / customer name"
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

          <Field label="Print Placement">
            <input
              value={form.print_placement}
              onChange={(event) => updateField("print_placement", event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Front chest, back, sleeve, hat front..."
            />
          </Field>

          <Field label="Colors Needed">
            <input
              value={form.colors_needed}
              onChange={(event) => updateField("colors_needed", event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Black, white, neon green, full color..."
            />
          </Field>

          <Field label="Artwork Notes">
            <textarea
              value={form.artwork_notes}
              onChange={(event) => updateField("artwork_notes", event.target.value)}
              className="mt-3 min-h-24 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Anything the shop should know about this file..."
            />
          </Field>
        </section>

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
          onClick={submitArtwork}
          disabled={saving}
          className="mt-8 rounded-full bg-cyan-400 px-7 py-3 font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Uploading..." : "Save Artwork To Board"}
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
