import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./CowTownTags.css";

type ManagedAnimal = {
  id: string;
  cow_town_id: string;
  visible_tag_number: string;
  name: string | null;
  breed: string | null;
  sex: string | null;
  color: string | null;
  birth_year: number | null;
  pasture_name: string | null;
  herd_group: string | null;
  notes: string | null;
  animal_status: string;
  activation_status: string;
  updated_at: string;
};

type ManageAnimalData = {
  found: boolean;
  ranch?: {
    id: string;
    ranch_name: string;
  };
  animal?: ManagedAnimal;
};

const fieldStyle = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.16)",
  background: "rgba(255,255,255,.04)",
  color: "inherit",
  padding: "12px 14px",
  font: "inherit",
} as const;

const labelStyle = {
  display: "grid",
  gap: 7,
  fontWeight: 700,
} as const;

export default function CowTownManageAnimalPage() {
  const {
    managementToken = "",
    cowTownId = "",
  } = useParams();

  const [data, setData] = useState<ManageAnimalData | null>(null);
  const [loading, setLoading] = useState(true);
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
  const [animalStatus, setAnimalStatus] = useState("active");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  const loadAnimal = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    const { data: result, error } = await supabase.rpc(
      "get_cow_town_managed_animal",
      {
        requested_management_token: managementToken,
        requested_cow_town_id: cowTownId,
      },
    );

    if (error || !result?.found || !result?.animal) {
      setLoadError("This animal could not be opened with this ranch link.");
      setLoading(false);
      return;
    }

    const next = result as ManageAnimalData;
    const animal = next.animal!;

    setData(next);
    setVisibleTagNumber(animal.visible_tag_number || "");
    setName(animal.name || "");
    setBreed(animal.breed || "");
    setSex(animal.sex || "");
    setColor(animal.color || "");
    setBirthYear(animal.birth_year ? String(animal.birth_year) : "");
    setPastureName(animal.pasture_name || "");
    setHerdGroup(animal.herd_group || "");
    setNotes(animal.notes || "");
    setAnimalStatus(animal.animal_status || "active");
    setLoading(false);
  }, [managementToken, cowTownId]);

  useEffect(() => {
    void loadAnimal();
  }, [loadAnimal]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!visibleTagNumber.trim()) {
      setSaveError("Animal number is required.");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaved(false);

    const parsedBirthYear = birthYear.trim()
      ? Number.parseInt(birthYear.trim(), 10)
      : null;

    const { data: result, error } = await supabase.rpc(
      "update_cow_town_managed_animal",
      {
        requested_management_token: managementToken,
        requested_cow_town_id: cowTownId,
        requested_visible_tag_number: visibleTagNumber.trim(),
        requested_name: name.trim() || null,
        requested_breed: breed.trim() || null,
        requested_sex: sex.trim() || null,
        requested_color: color.trim() || null,
        requested_birth_year: parsedBirthYear,
        requested_pasture_name: pastureName.trim() || null,
        requested_herd_group: herdGroup.trim() || null,
        requested_notes: notes.trim() || null,
        requested_animal_status: animalStatus,
      },
    );

    if (error || !result?.success) {
      setSaveError(error?.message || "Animal information could not be saved.");
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
    await loadAnimal();
  }

  if (loading) {
    return (
      <div className="cowtown-page">
        <main
          className="cowtown-shell"
          style={{ paddingTop: 48, paddingBottom: 80 }}
        >
          <div className="cowtown-kicker">Private animal management</div>
          <h1>Loading animal...</h1>
        </main>
      </div>
    );
  }

  if (loadError || !data?.animal) {
    return (
      <div className="cowtown-page">
        <main
          className="cowtown-shell"
          style={{ paddingTop: 48, paddingBottom: 80 }}
        >
          <div className="cowtown-kicker">Private animal management</div>
          <h1>Animal unavailable.</h1>
          <p>{loadError}</p>

          <Link
            className="cowtown-button cowtown-button-secondary"
            to={`/planet/cow-town-tags/ranch/${managementToken}`}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back to Ranch Board
          </Link>
        </main>
      </div>
    );
  }

  const animal = data.animal;

  return (
    <div className="cowtown-page">
      <header className="cowtown-header">
        <div className="cowtown-shell cowtown-header-inner">
          <Link
            className="cowtown-brand"
            to={`/planet/cow-town-tags/ranch/${managementToken}`}
          >
            <span className="cowtown-brand-mark">CT</span>
            <span className="cowtown-brand-copy">
              <strong>Cow Town Tags</strong>
              <small>Manage Animal</small>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={17} aria-hidden="true" />
            <span>Private Access</span>
          </div>
        </div>
      </header>

      <main
        className="cowtown-shell"
        style={{ paddingTop: 36, paddingBottom: 80, maxWidth: 820 }}
      >
        <Link
          to={`/planet/cow-town-tags/ranch/${managementToken}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            color: "inherit",
            marginBottom: 26,
          }}
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Ranch Board
        </Link>

        <section style={{ marginBottom: 28 }}>
          <div className="cowtown-kicker">
            {data.ranch?.ranch_name || "Private Ranch"}
          </div>

          <h1 style={{ marginBottom: 8 }}>
            Manage {name.trim() || `Animal ${visibleTagNumber}`}
          </h1>

          <p style={{ marginTop: 0, opacity: 0.76 }}>
            Update the animal record connected to this Cow Town tag.
          </p>
        </section>

        <div
          style={{
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 18,
            padding: 20,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              opacity: 0.65,
              marginBottom: 5,
            }}
          >
            Permanent Cow Town ID
          </div>

          <strong style={{ fontSize: 24 }}>
            {animal.cow_town_id}
          </strong>

          <div style={{ marginTop: 7, opacity: 0.68, fontSize: 14 }}>
            This ID stays with the tag and cannot be edited.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 18,
            }}
          >
            <label style={labelStyle}>
              Animal / Tag Number
              <input
                style={fieldStyle}
                value={visibleTagNumber}
                onChange={(event) => setVisibleTagNumber(event.target.value)}
                required
              />
            </label>

            <label style={labelStyle}>
              Animal Name
              <input
                style={fieldStyle}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label style={labelStyle}>
              Breed
              <input
                style={fieldStyle}
                value={breed}
                onChange={(event) => setBreed(event.target.value)}
              />
            </label>

            <label style={labelStyle}>
              Sex
              <input
                style={fieldStyle}
                value={sex}
                onChange={(event) => setSex(event.target.value)}
              />
            </label>

            <label style={labelStyle}>
              Color
              <input
                style={fieldStyle}
                value={color}
                onChange={(event) => setColor(event.target.value)}
              />
            </label>

            <label style={labelStyle}>
              Birth Year
              <input
                style={fieldStyle}
                inputMode="numeric"
                value={birthYear}
                onChange={(event) => setBirthYear(event.target.value)}
              />
            </label>

            <label style={labelStyle}>
              Pasture
              <input
                style={fieldStyle}
                value={pastureName}
                onChange={(event) => setPastureName(event.target.value)}
              />
            </label>

            <label style={labelStyle}>
              Herd / Group
              <input
                style={fieldStyle}
                value={herdGroup}
                onChange={(event) => setHerdGroup(event.target.value)}
              />
            </label>

            <label style={labelStyle}>
              Animal Status
              <select
                style={fieldStyle}
                value={animalStatus}
                onChange={(event) => setAnimalStatus(event.target.value)}
              >
                <option value="active">Active</option>
                <option value="missing">Missing</option>
                <option value="found">Found</option>
                <option value="sold">Sold</option>
                <option value="deceased">Deceased</option>
              </select>
            </label>
          </div>

          <label
            style={{
              ...labelStyle,
              marginTop: 18,
            }}
          >
            Private Ranch Notes
            <textarea
              style={{
                ...fieldStyle,
                minHeight: 130,
                resize: "vertical",
              }}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Private notes for this animal..."
            />
          </label>

          {saveError && (
            <div
              role="alert"
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 12,
                border: "1px solid rgba(255,100,100,.35)",
              }}
            >
              {saveError}
            </div>
          )}

          {saved && (
            <div
              role="status"
              aria-live="polite"
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 12,
                border: "1px solid rgba(100,255,160,.3)",
              }}
            >
              Animal information saved.
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 24,
            }}
          >
            <button
              className="cowtown-button cowtown-button-primary"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <Loader2 size={18} aria-hidden="true" className="cowtown-spin" />
              ) : (
                <Save size={18} aria-hidden="true" />
              )}
              {saving ? "Saving..." : "Save Animal"}
            </button>

            <Link
              className="cowtown-button cowtown-button-secondary"
              to={`/planet/cow-town-tags/tag/${animal.cow_town_id}`}
              target="_blank"
              rel="noreferrer"
            >
              View Public Page
              <ExternalLink size={17} aria-hidden="true" />
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}


