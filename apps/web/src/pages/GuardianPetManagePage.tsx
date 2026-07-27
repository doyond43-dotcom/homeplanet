import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type PetStatus = "safe" | "missing" | "traveling";

type OwnerPet = {
  publicId: string;
  ownerToken: string;
  name: string;
  type: string | null;
  breed: string | null;
  age: string | null;
  color: string | null;
  photoUrl: string | null;
  ownerName: string;
  callNumber: string | null;
  textNumber: string | null;
  temperament: string | null;
  lastSeen: string | null;
  rewardText: string | null;
  status: PetStatus;
};

function normalizePet(value: unknown): OwnerPet | null {
  if (!value || typeof value !== "object") return null;

  const pet = value as Partial<OwnerPet>;

  if (!pet.publicId || !pet.ownerToken || !pet.name) {
    return null;
  }

  return {
    publicId: pet.publicId,
    ownerToken: pet.ownerToken,
    name: pet.name,
    type: pet.type ?? "",
    breed: pet.breed ?? "",
    age: pet.age ?? "",
    color: pet.color ?? "",
    photoUrl: pet.photoUrl ?? "",
    ownerName: pet.ownerName || "Pet Owner",
    callNumber: pet.callNumber ?? "",
    textNumber: pet.textNumber ?? "",
    temperament: pet.temperament ?? "",
    lastSeen: pet.lastSeen ?? "",
    rewardText: pet.rewardText ?? "",
    status: pet.status || "safe",
  };
}

export default function GuardianPetManagePage() {
  const { ownerToken = "" } = useParams();

  const [pet, setPet] = useState<OwnerPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPet() {
      const { data, error } = await supabase.rpc(
        "get_guardian_pet_owner_profile",
        {
          requested_owner_token: ownerToken,
        },
      );

      if (!active) return;

      if (error) {
        setPageError(error.message);
        setLoading(false);
        return;
      }

      const loaded = normalizePet(data);

      if (!loaded) {
        setPageError(
          "This private owner link is not valid.",
        );
        setLoading(false);
        return;
      }

      setPet(loaded);
      setLoading(false);
    }

    void loadPet();

    return () => {
      active = false;
    };
  }, [ownerToken]);

  function update<K extends keyof OwnerPet>(
    field: K,
    value: OwnerPet[K],
  ) {
    setSaved(false);
    setPet((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );
  }

  function choosePhoto(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file || !pet) return;

    if (!file.type.startsWith("image/")) {
      setSaveError("Choose an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        update("photoUrl", reader.result);
      }
    };

    reader.readAsDataURL(file);
  }

  async function saveProfile(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!pet) return;

    setSaving(true);
    setSaved(false);
    setSaveError("");

    const { error } = await supabase.rpc(
      "update_guardian_pet_owner_profile",
      {
        requested_owner_token: ownerToken,
        requested_pet_name: pet.name,
        requested_pet_type: pet.type || "",
        requested_breed: pet.breed || "",
        requested_age: pet.age || "",
        requested_color: pet.color || "",
        requested_photo_data_url: pet.photoUrl || "",
        requested_owner_name: pet.ownerName,
        requested_call_number: pet.callNumber || "",
        requested_text_number: pet.textNumber || "",
        requested_temperament:
          pet.temperament || "",
        requested_last_seen: pet.lastSeen || "",
        requested_reward_text:
          pet.rewardText || "",
        requested_status: pet.status,
      },
    );

    if (error) {
      setSaveError(error.message);
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl">
          Loading your pet page...
        </div>
      </main>
    );
  }

  if (!pet || pageError) {
    return (
      <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl rounded-[28px] border border-rose-300/20 bg-rose-300/[0.06] p-6">
          <h1 className="text-2xl font-bold">
            Owner page unavailable
          </h1>
          <p className="mt-3 text-white/65">
            {pageError}
          </p>
        </div>
      </main>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-white/12 bg-white px-4 py-4 text-base text-black";

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-7 text-white">
      <div className="mx-auto max-w-2xl">
        <header className="mb-5">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            Private owner page
          </div>
          <h1 className="mt-2 text-3xl font-bold">
            Manage {pet.name}&apos;s Pet Tag
          </h1>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Keep this link private. Changes update the
            public QR page immediately.
          </p>
        </header>

        <form
          onSubmit={saveProfile}
          className="space-y-4"
        >
          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-4">
              {pet.photoUrl ? (
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  className="h-24 w-24 rounded-[22px] object-cover"
                />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-[22px] bg-white/[0.08] text-4xl">
                  ðŸ¾
                </div>
              )}

              <label className="cursor-pointer rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.08] px-4 py-3 text-sm font-bold text-cyan-100">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={choosePhoto}
                />
              </label>
            </div>
          </section>

          <section className="grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Pet name
              <input
                required
                value={pet.name}
                onChange={(event) =>
                  update("name", event.target.value)
                }
                className={inputClass}
              />
            </label>

            <label className="text-sm font-bold">
              Status
              <select
                value={pet.status}
                onChange={(event) =>
                  update(
                    "status",
                    event.target.value as PetStatus,
                  )
                }
                className={inputClass}
              >
                <option value="safe">Safe</option>
                <option value="missing">Missing</option>
                <option value="traveling">
                  Traveling
                </option>
              </select>
            </label>

            <label className="text-sm font-bold">
              Pet type
              <input
                value={pet.type || ""}
                onChange={(event) =>
                  update("type", event.target.value)
                }
                className={inputClass}
              />
            </label>

            <label className="text-sm font-bold">
              Breed
              <input
                value={pet.breed || ""}
                onChange={(event) =>
                  update("breed", event.target.value)
                }
                className={inputClass}
              />
            </label>

            <label className="text-sm font-bold">
              Age
              <input
                value={pet.age || ""}
                onChange={(event) =>
                  update("age", event.target.value)
                }
                className={inputClass}
              />
            </label>

            <label className="text-sm font-bold">
              Color
              <input
                value={pet.color || ""}
                onChange={(event) =>
                  update("color", event.target.value)
                }
                className={inputClass}
              />
            </label>
          </section>

          <section className="space-y-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <label className="block text-sm font-bold">
              Owner name
              <input
                value={pet.ownerName}
                onChange={(event) =>
                  update(
                    "ownerName",
                    event.target.value,
                  )
                }
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-bold">
              Call number
              <input
                value={pet.callNumber || ""}
                onChange={(event) =>
                  update(
                    "callNumber",
                    event.target.value,
                  )
                }
                inputMode="tel"
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-bold">
              Text number
              <input
                value={pet.textNumber || ""}
                onChange={(event) =>
                  update(
                    "textNumber",
                    event.target.value,
                  )
                }
                inputMode="tel"
                className={inputClass}
              />
            </label>
          </section>

          <section className="space-y-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <label className="block text-sm font-bold">
              About your pet
              <textarea
                value={pet.temperament || ""}
                onChange={(event) =>
                  update(
                    "temperament",
                    event.target.value,
                  )
                }
                rows={4}
                className={inputClass}
                placeholder="Friendly, nervous around strangers, medical needs, approach instructions..."
              />
            </label>

            <label className="block text-sm font-bold">
              Last seen
              <input
                value={pet.lastSeen || ""}
                onChange={(event) =>
                  update(
                    "lastSeen",
                    event.target.value,
                  )
                }
                className={inputClass}
                placeholder="Shown when status is Missing"
              />
            </label>

            <label className="block text-sm font-bold">
              Reward or return message
              <input
                value={pet.rewardText || ""}
                onChange={(event) =>
                  update(
                    "rewardText",
                    event.target.value,
                  )
                }
                className={inputClass}
                placeholder="Reward available upon safe return"
              />
            </label>
          </section>

          {saveError ? (
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.07] p-4 text-sm text-rose-100">
              {saveError}
            </div>
          ) : null}

          {saved ? (
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.07] p-4 text-sm font-semibold text-emerald-100">
              Changes saved. The public Pet Tag page
              is updated.
            </div>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-cyan-300 px-5 py-4 text-base font-bold text-[#07111f] disabled:opacity-50"
          >
            {saving
              ? "Saving Changes..."
              : "Save Pet Tag Changes"}
          </button>

          <Link
            to={`/planet/guardian-pet/pet/${pet.publicId}`}
            target="_blank"
            className="block rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-4 text-center font-bold"
          >
            View Public Pet Page
          </Link>
        </form>
      </div>
    </main>
  );
}
