import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import { supabase } from "../lib/supabase";

type PetStatus = "safe" | "missing" | "traveling";

type PublicPet = {
  publicId: string;
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

type FinderSituation =
  | "safe-with-me"
  | "seen-nearby"
  | "appears-hurt"
  | "";

function telHref(number: string | null) {
  return number
    ? `tel:${number.replace(/\D/g, "")}`
    : undefined;
}

function smsHref(
  number: string | null,
  body: string,
) {
  if (!number) return undefined;

  return `sms:${number.replace(/\D/g, "")}&body=${encodeURIComponent(
    body,
  )}`;
}

function asPet(value: unknown): PublicPet | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<PublicPet>;

  if (!candidate.publicId || !candidate.name) return null;

  return {
    publicId: candidate.publicId,
    name: candidate.name,
    type: candidate.type ?? null,
    breed: candidate.breed ?? null,
    age: candidate.age ?? null,
    color: candidate.color ?? null,
    photoUrl: candidate.photoUrl ?? null,
    ownerName: candidate.ownerName || "Pet Owner",
    callNumber: candidate.callNumber ?? null,
    textNumber: candidate.textNumber ?? null,
    temperament: candidate.temperament ?? null,
    lastSeen: candidate.lastSeen ?? null,
    rewardText: candidate.rewardText ?? null,
    status: candidate.status || "safe",
  };
}

export default function GuardianPetLivePage() {
  const { petId = "" } = useParams();
  const location = useLocation();

  const finderMode = location.pathname.includes(
    "/guardian-pet/found/",
  );

  const [pet, setPet] = useState<PublicPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [situation, setSituation] =
    useState<FinderSituation>("");
  const [finderName, setFinderName] = useState("");
  const [callbackNumber, setCallbackNumber] =
    useState("");
  const [foundLocation, setFoundLocation] =
    useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPet() {
      setLoading(true);
      setPageError("");

      const { data, error } = await supabase.rpc(
        "get_guardian_pet_public",
        {
          requested_public_id: petId,
        },
      );

      if (!active) return;

      if (error) {
        setPageError(error.message);
        setLoading(false);
        return;
      }

      const loadedPet = asPet(data);

      if (!loadedPet) {
        setPageError(
          "This Pet Tag page could not be found.",
        );
        setLoading(false);
        return;
      }

      setPet(loadedPet);
      setLoading(false);
    }

    void loadPet();

    return () => {
      active = false;
    };
  }, [petId]);

  const description = useMemo(() => {
    if (!pet) return "";

    return [
      pet.type,
      pet.breed,
      pet.age,
      pet.color,
    ]
      .filter(Boolean)
      .join(" Â· ");
  }, [pet]);

  async function submitFoundUpdate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!pet || !situation || !foundLocation.trim()) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const { error } = await supabase.rpc(
      "submit_guardian_pet_found_report",
      {
        requested_public_id: pet.publicId,
        requested_situation: situation,
        requested_finder_name:
          finderName.trim() || null,
        requested_callback_number:
          callbackNumber.trim() || null,
        requested_found_location:
          foundLocation.trim(),
        requested_message: message.trim() || null,
      },
    );

    if (error) {
      setSubmitError(error.message);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          Loading Pet Tag...
        </div>
      </main>
    );
  }

  if (!pet || pageError) {
    return (
      <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-[28px] border border-rose-300/20 bg-rose-300/[0.06] p-6">
          <h1 className="text-2xl font-bold">
            Pet Tag unavailable
          </h1>
          <p className="mt-3 text-white/65">
            {pageError ||
              "This Pet Tag page could not be found."}
          </p>
        </div>
      </main>
    );
  }

  const missing = pet.status === "missing";

  const callLink = telHref(pet.callNumber);
  const textLink = smsHref(
    pet.textNumber,
    `Hi ${pet.ownerName}, I found ${pet.name}. I scanned ${pet.name}'s HomePlanet Pet Tag.`,
  );

  if (finderMode) {
    return (
      <main className="min-h-screen bg-[#07111f] px-4 py-7 text-white">
        <div className="mx-auto max-w-xl space-y-4">
          <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5">
            <div className="flex items-center gap-4">
              {pet.photoUrl ? (
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  className="h-20 w-20 rounded-[20px] object-cover"
                />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-[20px] bg-white/[0.08] text-3xl">
                  ðŸ¾
                </div>
              )}

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                  Found pet update
                </div>
                <h1 className="mt-1 text-3xl font-bold">
                  You found {pet.name}?
                </h1>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-white/68">
              Tell {pet.ownerName} what is happening and
              where {pet.name} is.
            </p>
          </section>

          {submitted ? (
            <section className="rounded-[30px] border border-emerald-300/20 bg-emerald-400/[0.07] p-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-300 text-2xl font-black text-[#07111f]">
                âœ“
              </div>

              <h2 className="mt-5 text-3xl font-bold">
                Thank you for helping {pet.name}.
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/68">
                Your update was saved. Contact the owner
                directly for the fastest response.
              </p>

              <div className="mt-6 grid gap-3">
                {callLink ? (
                  <a
                    href={callLink}
                    className="rounded-2xl bg-emerald-300 px-5 py-4 font-bold text-[#07111f]"
                  >
                    Call {pet.ownerName}
                  </a>
                ) : null}

                {textLink ? (
                  <a
                    href={textLink}
                    className="rounded-2xl bg-sky-300 px-5 py-4 font-bold text-[#07111f]"
                  >
                    Text {pet.ownerName}
                  </a>
                ) : null}

                <Link
                  to={`/planet/guardian-pet/pet/${pet.publicId}`}
                  className="rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-4 font-bold"
                >
                  Back to {pet.name}&apos;s Page
                </Link>
              </div>
            </section>
          ) : (
            <form
              onSubmit={submitFoundUpdate}
              className="space-y-4"
            >
              <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm font-bold">
                  What is happening right now?
                </div>

                <div className="mt-4 grid gap-2">
                  {[
                    [
                      "safe-with-me",
                      `${pet.name} is safe with me`,
                    ],
                    [
                      "seen-nearby",
                      `I saw ${pet.name} nearby`,
                    ],
                    [
                      "appears-hurt",
                      `${pet.name} may be hurt`,
                    ],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setSituation(
                          value as FinderSituation,
                        )
                      }
                      className={
                        situation === value
                          ? "rounded-2xl border border-cyan-300 bg-cyan-300 px-4 py-4 text-left font-bold text-[#07111f]"
                          : "rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-4 text-left font-bold"
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <label className="block text-sm font-bold">
                  Where is {pet.name}?
                  <input
                    required
                    value={foundLocation}
                    onChange={(event) =>
                      setFoundLocation(event.target.value)
                    }
                    placeholder="Street, neighborhood, or landmark"
                    className="mt-3 w-full rounded-2xl border border-white/12 bg-white px-4 py-4 text-base text-black"
                  />
                </label>
              </section>

              <section className="space-y-3 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm font-bold">
                  Optional details
                </div>

                <input
                  value={finderName}
                  onChange={(event) =>
                    setFinderName(event.target.value)
                  }
                  placeholder="Your first name"
                  className="w-full rounded-2xl bg-white px-4 py-4 text-base text-black"
                />

                <input
                  value={callbackNumber}
                  onChange={(event) =>
                    setCallbackNumber(event.target.value)
                  }
                  placeholder="Callback number"
                  inputMode="tel"
                  className="w-full rounded-2xl bg-white px-4 py-4 text-base text-black"
                />

                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder={`Anything ${pet.ownerName} should know?`}
                  rows={4}
                  className="w-full rounded-2xl bg-white px-4 py-4 text-base text-black"
                />
              </section>

              {submitError ? (
                <div className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.07] p-4 text-sm text-rose-100">
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={
                  submitting ||
                  !situation ||
                  !foundLocation.trim()
                }
                className="w-full rounded-2xl bg-cyan-300 px-5 py-4 text-base font-bold text-[#07111f] disabled:opacity-40"
              >
                {submitting
                  ? "Sending Update..."
                  : "Send Found Update"}
              </button>
            </form>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-7 text-white">
      <div className="mx-auto max-w-3xl space-y-4">
        <header className="border-b border-white/[0.07] pb-4">
          <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            HomePlanet Pet Tag
          </div>
        </header>

        <section className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04]">
          {pet.photoUrl ? (
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="grid aspect-[4/3] place-items-center bg-white/[0.05] text-7xl">
              ðŸ¾
            </div>
          )}

          <div className="p-5 sm:p-7">
            <div
              className={
                missing
                  ? "inline-flex rounded-full bg-rose-300 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[#281017]"
                  : "inline-flex rounded-full bg-emerald-300 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[#062018]"
              }
            >
              {missing ? "Missing" : "Safe"}
            </div>

            <h1 className="mt-4 text-4xl font-bold">
              {pet.name}
            </h1>

            {description ? (
              <p className="mt-2 text-white/65">
                {description}
              </p>
            ) : null}
          </div>
        </section>

        <section
          className={
            missing
              ? "rounded-[28px] border border-rose-300/20 bg-rose-300/[0.06] p-5 sm:p-7"
              : "rounded-[28px] border border-emerald-300/20 bg-emerald-300/[0.05] p-5 sm:p-7"
          }
        >
          <h2 className="text-2xl font-bold">
            {missing
              ? `${pet.name} is missing.`
              : `Thanks for checking ${pet.name}'s tag.`}
          </h2>

          <p className="mt-3 leading-7 text-white/70">
            Contact {pet.ownerName} if {pet.name} appears
            to be away from home.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {callLink ? (
              <a
                href={callLink}
                className="rounded-2xl bg-emerald-300 px-5 py-4 text-center font-bold text-[#07111f]"
              >
                Call Owner
              </a>
            ) : null}

            {textLink ? (
              <a
                href={textLink}
                className="rounded-2xl bg-sky-300 px-5 py-4 text-center font-bold text-[#07111f]"
              >
                Text Owner
              </a>
            ) : null}
          </div>

          <Link
            to={`/planet/guardian-pet/found/${pet.publicId}`}
            className="mt-3 block rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.07] px-5 py-4 text-center font-bold text-cyan-100"
          >
            Send a Found Pet Update
          </Link>
        </section>

        {pet.temperament ? (
          <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-7">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              A little about {pet.name}
            </div>
            <p className="mt-3 leading-7 text-white/80">
              {pet.temperament}
            </p>
          </section>
        ) : null}

        {missing &&
        (pet.lastSeen || pet.rewardText) ? (
          <section className="grid gap-3 sm:grid-cols-2">
            {pet.lastSeen ? (
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-xs font-bold uppercase tracking-[0.17em] text-white/50">
                  Last seen
                </div>
                <p className="mt-2 font-semibold">
                  {pet.lastSeen}
                </p>
              </div>
            ) : null}

            {pet.rewardText ? (
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                <div className="text-xs font-bold uppercase tracking-[0.17em] text-white/50">
                  Help bring {pet.name} home
                </div>
                <p className="mt-2 font-semibold">
                  {pet.rewardText}
                </p>
              </div>
            ) : null}
          </section>
        ) : null}

        <footer className="border-t border-white/[0.08] py-7 text-sm text-white/45">
          This page is connected directly to{" "}
          {pet.name}&apos;s Pet Tag. No app or account is
          needed to help.
        </footer>
      </div>
    </main>
  );
}
