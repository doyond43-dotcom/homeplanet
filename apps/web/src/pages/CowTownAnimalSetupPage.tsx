import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./CowTownTags.css";

type CowTownReceipt = {
  order_id: string;
  order_number: string;
  status: string;
  full_tag_quantity: number;
  sticker_quantity: number;
  ranch: {
    id: string;
    name: string;
    contact_name: string;
    email: string;
  };
  batch: {
    id: string;
    batch_number: string;
    status: string;
    expected_assignment_count: number;
  };
};

type CreatedAnimal = {
  success: boolean;
  animal_id: string;
  cow_town_id: string;
  visible_tag_number: string;
  product_type: "full-tag" | "sticker-upgrade";
  live_url: string;
};

type PhotoAccess = {
  animal_id: string;
  photo_upload_token: string;
  photo_url: string | null;
};

function normalizeExtension(file: File) {
  const raw = file.name.split(".").pop()?.toLowerCase() || "";

  if (["jpg", "jpeg", "png", "webp", "heic", "heif"].includes(raw)) {
    return raw;
  }

  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/heic") return "heic";
  if (file.type === "image/heif") return "heif";

  return "jpg";
}

export default function CowTownAnimalSetupPage() {
  const { accessToken } = useParams();

  const [receipt, setReceipt] = useState<CowTownReceipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [visibleTagNumber, setVisibleTagNumber] = useState("");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [sex, setSex] = useState("");
  const [color, setColor] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [pastureName, setPastureName] = useState("");
  const [herdGroup, setHerdGroup] = useState("");
  const [notes, setNotes] = useState("");
  const [productType, setProductType] =
    useState<"full-tag" | "sticker-upgrade">("full-tag");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createdAnimal, setCreatedAnimal] =
    useState<CreatedAnimal | null>(null);
  const [savedPhotoUrl, setSavedPhotoUrl] = useState("");

  const loadReceipt = useCallback(async () => {
    if (!accessToken) {
      setLoadError("This Cow Town animal setup link is incomplete.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError("");

    const { data, error } = await supabase.rpc(
      "get_cow_town_order_receipt",
      {
        requested_access_token: accessToken,
      },
    );

    if (error) {
      setLoadError(error.message);
      setIsLoading(false);
      return;
    }

    if (!data) {
      setLoadError("We could not find the Cow Town order for this private setup link.");
      setIsLoading(false);
      return;
    }

    setReceipt(data as CowTownReceipt);
    setIsLoading(false);
  }, [accessToken]);

  useEffect(() => {
    void loadReceipt();
  }, [loadReceipt]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const canUseFullTag = (receipt?.full_tag_quantity || 0) > 0;
  const canUseSticker = (receipt?.sticker_quantity || 0) > 0;

  useEffect(() => {
    if (!receipt) return;

    if (!canUseFullTag && canUseSticker) {
      setProductType("sticker-upgrade");
    }
  }, [receipt, canUseFullTag, canUseSticker]);

  const orderReady = useMemo(
    () =>
      receipt?.status === "payment_verified" ||
      receipt?.status === "paid",
    [receipt],
  );

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    setPhotoFile(file);
    setSubmitError("");

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoPreview(file ? URL.createObjectURL(file) : "");
  }

  async function uploadAnimalPhoto(
    animal: CreatedAnimal,
    file: File,
  ) {
    if (!accessToken) {
      throw new Error("Cow Town order access token is missing.");
    }

    const { data: accessData, error: accessError } =
      await supabase.rpc("get_cow_town_animal_photo_upload", {
        requested_access_token: accessToken,
        requested_animal_id: animal.animal_id,
      });

    if (accessError) throw accessError;
    if (!accessData?.photo_upload_token) {
      throw new Error("Photo upload access could not be created.");
    }

    const photoAccess = accessData as PhotoAccess;
    const extension = normalizeExtension(file);

    const photoPath =
      `${animal.animal_id}/${photoAccess.photo_upload_token}/customer/${Date.now()}-animal.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("cow-town-animal-photos")
      .upload(photoPath, file, {
        cacheControl: "3600",
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const publicUrl = supabase.storage
      .from("cow-town-animal-photos")
      .getPublicUrl(photoPath).data.publicUrl;

    const { data: saveData, error: saveError } =
      await supabase.rpc("save_cow_town_animal_photo", {
        requested_animal_id: animal.animal_id,
        requested_photo_token: photoAccess.photo_upload_token,
        requested_photo_path: photoPath,
        requested_photo_url: publicUrl,
      });

    if (saveError) throw saveError;
    if (!saveData?.success) {
      throw new Error("Animal photo could not be saved.");
    }

    return publicUrl;
  }

  async function submitAnimal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      setSubmitError("This private Cow Town setup link is incomplete.");
      return;
    }

    if (!orderReady) {
      setSubmitError("This Cow Town order is not ready for animal setup yet.");
      return;
    }

    if (!visibleTagNumber.trim()) {
      setSubmitError("Enter the animal or visible tag number.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const parsedBirthYear = birthYear.trim()
        ? Number.parseInt(birthYear.trim(), 10)
        : null;

      const { data, error } = await supabase.rpc(
        "create_cow_town_animal_setup",
        {
          requested_access_token: accessToken,
          requested_visible_tag_number: visibleTagNumber.trim(),
          requested_name: name.trim() || null,
          requested_breed: breed.trim() || null,
          requested_sex: sex.trim() || null,
          requested_color: color.trim() || null,
          requested_birth_year:
            parsedBirthYear && Number.isFinite(parsedBirthYear)
              ? parsedBirthYear
              : null,
          requested_pasture_name: pastureName.trim() || null,
          requested_herd_group: herdGroup.trim() || null,
          requested_notes: notes.trim() || null,
          requested_product_type: productType,
        },
      );

      if (error) throw error;
      if (!data?.success) {
        throw new Error("Cow Town could not create this animal record.");
      }

      const animal = data as CreatedAnimal;

      let photoUrl = "";

      if (photoFile) {
        photoUrl = await uploadAnimalPhoto(animal, photoFile);
      }

      setCreatedAnimal(animal);
      setSavedPhotoUrl(photoUrl);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "Cow Town could not create this animal record.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="cowtown-page">
        <main className="cowtown-recovery-main">
          <div className="cowtown-shell">
            <div className="cowtown-card" style={{ padding: 28 }}>
              <Loader2
                size={24}
                className="cowtown-spin"
              />
              <p>Loading your Cow Town order...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loadError || !receipt) {
    return (
      <div className="cowtown-page">
        <main className="cowtown-recovery-main">
          <div className="cowtown-shell">
            <div className="cowtown-card" style={{ padding: 28 }}>
              <h1>Animal setup link unavailable</h1>
              <p>{loadError || "This setup link could not be loaded."}</p>

              <Link
                className="cowtown-header-action"
                to="/planet/cow-town-tags"
              >
                <ArrowLeft size={15} />
                Cow Town Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (createdAnimal) {
    return (
      <div className="cowtown-page">
        <header className="cowtown-header">
          <div className="cowtown-shell cowtown-header-inner">
            <Link className="cowtown-brand" to="/planet/cow-town-tags">
              <span className="cowtown-brand-mark">CT</span>
              <span className="cowtown-brand-copy">
                <strong>Cow Town Tags</strong>
                <span>Animal Setup</span>
              </span>
            </Link>
          </div>
        </header>

        <main className="cowtown-recovery-main">
          <div className="cowtown-shell">
            <div className="cowtown-card" style={{ padding: 28 }}>
              <span className="cowtown-status">
                <CheckCircle2 size={16} />
                Animal created
              </span>

              <h1 style={{ marginTop: 14 }}>
                {name.trim() || `Animal ${createdAnimal.visible_tag_number}`} is live.
              </h1>

              <p>
                Cow Town ID <strong>{createdAnimal.cow_town_id}</strong> has
                been connected to visible tag{" "}
                <strong>{createdAnimal.visible_tag_number}</strong>.
              </p>

              {savedPhotoUrl ? (
                <img
                  src={savedPhotoUrl}
                  alt={name.trim() || createdAnimal.cow_town_id}
                  style={{
                    width: "100%",
                    maxWidth: 460,
                    borderRadius: 18,
                    marginTop: 18,
                    display: "block",
                  }}
                />
              ) : null}

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 22,
                }}
              >
                <a
                  className="cowtown-header-action"
                  href={createdAnimal.live_url}
                >
                  View Live Animal Page
                </a>

                <button
                  type="button"
                  className="cowtown-header-action"
                  onClick={() => {
                    setCreatedAnimal(null);
                    setSavedPhotoUrl("");
                    setVisibleTagNumber("");
                    setName("");
                    setBreed("");
                    setSex("");
                    setColor("");
                    setBirthYear("");
                    setPastureName("");
                    setHerdGroup("");
                    setNotes("");
                    setPhotoFile(null);

                    if (photoPreview) {
                      URL.revokeObjectURL(photoPreview);
                    }

                    setPhotoPreview("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Add Another Animal
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cowtown-page">
      <header className="cowtown-header">
        <div className="cowtown-shell cowtown-header-inner">
          <Link className="cowtown-brand" to="/planet/cow-town-tags">
            <span className="cowtown-brand-mark">CT</span>

            <span className="cowtown-brand-copy">
              <strong>Cow Town Tags</strong>
              <span>Animal Setup</span>
            </span>
          </Link>

          <Link
            className="cowtown-header-action"
            to={`/planet/cow-town-tags/receipt/${accessToken}`}
          >
            <ArrowLeft size={15} />
            Order Receipt
          </Link>
        </div>
      </header>

      <main className="cowtown-recovery-main">
        <div className="cowtown-shell">
          <div className="cowtown-alert">
            <ShieldCheck size={20} />

            <div>
              <strong>Private setup link.</strong>{" "}
              Add the animal details and photo. Cow Town will create the
              animal record, Cow Town ID and live recovery page automatically.
            </div>
          </div>

          <div
            className="cowtown-recovery-grid"
            style={{ alignItems: "start" }}
          >
            <aside className="cowtown-card" style={{ padding: 24 }}>
              <span className="cowtown-status">
                <CheckCircle2 size={15} />
                {receipt.status === "payment_verified"
                  ? "Payment verified"
                  : receipt.status}
              </span>

              <h2 style={{ marginTop: 14 }}>
                {receipt.ranch.name}
              </h2>

              <div className="cowtown-detail-grid">
                <div className="cowtown-detail">
                  <span>Order</span>
                  <strong>{receipt.order_number}</strong>
                </div>

                <div className="cowtown-detail">
                  <span>Batch</span>
                  <strong>{receipt.batch.batch_number}</strong>
                </div>

                <div className="cowtown-detail">
                  <span>Full tags</span>
                  <strong>{receipt.full_tag_quantity}</strong>
                </div>

                <div className="cowtown-detail">
                  <span>Recovery overlays</span>
                  <strong>{receipt.sticker_quantity}</strong>
                </div>
              </div>
            </aside>

            <section className="cowtown-card" style={{ padding: 24 }}>
              <div style={{ marginBottom: 22 }}>
                <span className="cowtown-status">
                  Animal record
                </span>

                <h1 style={{ marginTop: 12 }}>
                  Add this animal
                </h1>

                <p>
                  Enter what you know. The visible animal/tag number is the
                  only required animal field.
                </p>
              </div>

              <form onSubmit={submitAnimal}>
                <div style={{ display: "grid", gap: 16 }}>
                  <label>
                    <span>Animal or visible tag number *</span>
                    <input
                      value={visibleTagNumber}
                      onChange={(event) =>
                        setVisibleTagNumber(event.target.value)
                      }
                      placeholder="Example: 57"
                      required
                    />
                  </label>

                  <label>
                    <span>Animal name</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Example: Brownie"
                    />
                  </label>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: 16,
                    }}
                  >
                    <label>
                      <span>Breed</span>
                      <input
                        value={breed}
                        onChange={(event) =>
                          setBreed(event.target.value)
                        }
                        placeholder="Example: Angus"
                      />
                    </label>

                    <label>
                      <span>Sex</span>
                      <select
                        value={sex}
                        onChange={(event) =>
                          setSex(event.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="Cow">Cow</option>
                        <option value="Bull">Bull</option>
                        <option value="Heifer">Heifer</option>
                        <option value="Steer">Steer</option>
                        <option value="Calf">Calf</option>
                      </select>
                    </label>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: 16,
                    }}
                  >
                    <label>
                      <span>Color / markings</span>
                      <input
                        value={color}
                        onChange={(event) =>
                          setColor(event.target.value)
                        }
                        placeholder="Example: Brown"
                      />
                    </label>

                    <label>
                      <span>Birth year</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="1990"
                        max={new Date().getFullYear()}
                        value={birthYear}
                        onChange={(event) =>
                          setBirthYear(event.target.value)
                        }
                        placeholder="2022"
                      />
                    </label>
                  </div>

                  <label>
                    <span>Pasture / location</span>
                    <input
                      value={pastureName}
                      onChange={(event) =>
                        setPastureName(event.target.value)
                      }
                      placeholder="Optional"
                    />
                  </label>

                  <label>
                    <span>Herd group</span>
                    <input
                      value={herdGroup}
                      onChange={(event) =>
                        setHerdGroup(event.target.value)
                      }
                      placeholder="Optional"
                    />
                  </label>

                  {(canUseFullTag && canUseSticker) ? (
                    <label>
                      <span>Tag type</span>
                      <select
                        value={productType}
                        onChange={(event) =>
                          setProductType(
                            event.target.value as
                              | "full-tag"
                              | "sticker-upgrade",
                          )
                        }
                      >
                        <option value="full-tag">
                          Full Cow Town Tag
                        </option>
                        <option value="sticker-upgrade">
                          Recovery Overlay
                        </option>
                      </select>
                    </label>
                  ) : null}

                  <label>
                    <span>Animal photo</span>

                    <div
                      style={{
                        border: "1px dashed rgba(255,255,255,.18)",
                        borderRadius: 18,
                        padding: 18,
                        marginTop: 8,
                      }}
                    >
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                        onChange={handlePhotoChange}
                      />

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 10,
                        }}
                      >
                        <Camera size={17} />
                        <span>
                          Take a clear side or head photo if possible.
                        </span>
                      </div>
                    </div>
                  </label>

                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Animal preview"
                      style={{
                        width: "100%",
                        maxHeight: 360,
                        objectFit: "cover",
                        borderRadius: 18,
                      }}
                    />
                  ) : null}

                  <label>
                    <span>Private ranch notes</span>
                    <textarea
                      value={notes}
                      onChange={(event) =>
                        setNotes(event.target.value)
                      }
                      rows={4}
                      placeholder="Anything useful for your own animal record."
                    />
                  </label>

                  {submitError ? (
                    <div className="cowtown-alert">
                      {submitError}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    className="cowtown-header-action"
                    disabled={isSubmitting || !orderReady}
                    style={{
                      justifyContent: "center",
                      minHeight: 52,
                      width: "100%",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} />
                        Creating Animal...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Create Animal Page
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
