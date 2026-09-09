import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  ChevronRight,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./CowTownTags.css";

type RanchAnimal = {
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
  animal_status: string;
  activation_status: string;
  created_at: string;
};

type RanchSighting = {
  id: number;
  animal_id: string | null;
  activity_type: string;
  title: string;
  detail: string | null;
  cow_town_id: string | null;
  visible_tag_number: string | null;
  location: string | null;
  condition: string | null;
  notes: string | null;
  finder_phone: string | null;
  source: string | null;
  created_at: string;
};

type RanchBoardData = {
  found: boolean;
  ranch?: {
    id: string;
    ranch_name: string;
    primary_contact_name: string;
    primary_phone: string;
    primary_email: string;
    recovery_phone: string | null;
    status: string;
  };
  summary?: {
    animal_count: number;
    sighting_count: number;
  };
  animals?: RanchAnimal[];
  sightings?: RanchSighting[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function CowTownRanchBoardPage() {
  const { managementToken = "" } = useParams();
  const [board, setBoard] = useState<RanchBoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBoard() {
      setLoading(true);
      setLoadError("");

      const { data, error } = await supabase.rpc(
        "get_cow_town_ranch_board",
        {
          requested_management_token: managementToken,
        }
      );

      if (cancelled) {
        return;
      }

      if (error) {
        setLoadError("We could not load this ranch board.");
        setLoading(false);
        return;
      }

      setBoard(data as RanchBoardData);
      setLoading(false);
    }

    void loadBoard();

    return () => {
      cancelled = true;
    };
  }, [managementToken]);

  const ranch = board?.ranch;
  const animals = board?.animals || [];
  const sightings = board?.sightings || [];

  if (loading) {
    return (
      <div className="cowtown-page">
        <main className="cowtown-shell" style={{ paddingTop: 48, paddingBottom: 80 }}>
          <div className="cowtown-kicker">Private ranch access</div>
          <h1>Loading your Cow Town Ranch Board...</h1>
        </main>
      </div>
    );
  }

  if (loadError || !board?.found || !ranch) {
    return (
      <div className="cowtown-page">
        <main className="cowtown-shell" style={{ paddingTop: 48, paddingBottom: 80 }}>
          <div className="cowtown-kicker">Private ranch access</div>
          <h1>Ranch board unavailable.</h1>
          <p>
            This private Cow Town link is not valid or the ranch is no longer
            available.
          </p>
          <Link
            className="cowtown-button cowtown-button-secondary"
            to="/planet/cow-town-tags"
          >
            Return to Cow Town Tags
          </Link>
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
              <small>Private Ranch Board</small>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={17} />
            <span>Private Access</span>
          </div>
        </div>
      </header>

      <main className="cowtown-shell" style={{ paddingTop: 36, paddingBottom: 80 }}>
        <section style={{ marginBottom: 32 }}>
          <div className="cowtown-kicker">Ranch recovery command center</div>
          <h1 style={{ marginBottom: 8 }}>{ranch.ranch_name}</h1>
          <p style={{ marginTop: 0 }}>
            {ranch.primary_contact_name} ? {ranch.primary_phone}
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 18,
              padding: 20,
            }}
          >
            <Users size={22} />
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 12 }}>
              {board.summary?.animal_count || 0}
            </div>
            <div>Animals</div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 18,
              padding: 20,
            }}
          >
            <AlertTriangle size={22} />
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 12 }}>
              {board.summary?.sighting_count || 0}
            </div>
            <div>Recovery reports</div>
          </div>
        </section>

        <section style={{ marginBottom: 44 }}>
          <div className="cowtown-kicker">Recovery inbox</div>
          <h2>Incoming Sightings</h2>

          {sightings.length === 0 ? (
            <div
              style={{
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 18,
                padding: 22,
              }}
            >
              No sighting reports yet.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {sightings.map((sighting) => (
                <article
                  key={sighting.id}
                  style={{
                    border: "1px solid rgba(255,255,255,.14)",
                    borderRadius: 20,
                    padding: 22,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div className="cowtown-kicker">New recovery signal</div>
                      <h3 style={{ marginTop: 6, marginBottom: 6 }}>
                        {sighting.cow_town_id || "Cow Town animal"}
                        {sighting.visible_tag_number
                          ? ` \u00b7 Tag ${sighting.visible_tag_number}`
                          : ""}
                      </h3>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        fontSize: 14,
                        opacity: 0.8,
                      }}
                    >
                      <Clock3 size={16} />
                      {formatDate(sighting.created_at)}
                    </div>
                  </div>

                  {sighting.location && (
                    <p style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <MapPin size={18} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>
                        <strong>Location:</strong> {sighting.location}
                      </span>
                    </p>
                  )}

                  {sighting.condition && (
                    <p>
                      <strong>Condition:</strong> {sighting.condition}
                    </p>
                  )}

                  {sighting.notes && (
                    <p>
                      <strong>Finder notes:</strong> {sighting.notes}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      marginTop: 18,
                    }}
                  >
                    {sighting.finder_phone && (
                      <a
                        className="cowtown-button cowtown-button-primary"
                        href={`tel:${sighting.finder_phone}`}
                      >
                        <Phone size={17} />
                        Call Finder
                      </a>
                    )}

                    {sighting.cow_town_id && (
                      <Link
                        className="cowtown-button cowtown-button-secondary"
                        to={`/planet/cow-town-tags/tag/${sighting.cow_town_id}`}
                      >
                        Open Animal
                        <ArrowRight size={17} />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="cowtown-kicker">Your herd</div>
          <h2>Animals</h2>

          <div style={{ display: "grid", gap: 14 }}>
            {animals.map((animal) => (
              <Link
                key={animal.id}
                to={`/planet/cow-town-tags/tag/${animal.cow_town_id}`}
                style={{
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 18,
                  padding: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div>
                  <strong style={{ fontSize: 20 }}>
                    {animal.name || animal.cow_town_id}
                  </strong>
                  <div style={{ marginTop: 4, opacity: 0.8 }}>
                    {animal.cow_town_id}{" \u00b7 "}Tag {animal.visible_tag_number}
                  </div>
                  <div style={{ marginTop: 4, opacity: 0.7 }}>
                    {[animal.breed, animal.sex, animal.color]
                      .filter(Boolean)
                      .join(" \u00b7 ")}
                  </div>
                </div>

                <ChevronRight size={20} style={{ opacity: 0.72, flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
