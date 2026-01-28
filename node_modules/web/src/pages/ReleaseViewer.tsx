import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Artifact = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

type Release = {
  id: string;
  projectId: string;
  title: string;
  statement: string;
  artifactIds: string[];
  createdAt: number;
};

function fmt(ms: number) {
  return new Date(ms).toLocaleString();
}

export default function ReleaseViewer() {
  const { releaseId } = useParams<{ releaseId: string }>();
  const [release, setRelease] = useState<Release | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  useEffect(() => {
    if (!releaseId) return;

    // Load release
    const releases = JSON.parse(
      localStorage.getItem("hp.creator.build.releases.v1") || "[]"
    ) as Release[];

    const r = releases.find((x) => x.id === releaseId) || null;
    setRelease(r);

    if (!r) return;

    // Load frozen artifacts from project store
    const key = `hp.creator.build.artifacts.v1.${r.projectId}`;
    const allArtifacts = JSON.parse(
      localStorage.getItem(key) || "[]"
    ) as Artifact[];

    const frozen = allArtifacts.filter((a) =>
      r.artifactIds.includes(a.id)
    );

    setArtifacts(
      frozen.sort((a, b) => a.createdAt - b.createdAt)
    );
  }, [releaseId]);

  if (!release) {
    return (
      <div>
        <h1>ðŸ“œ Release Viewer</h1>
        <p>This release does not exist or was removed.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 980 }}>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>
        ðŸ“œ {release.title}
      </h1>

      <div style={{ color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>
        Released: {fmt(release.createdAt)} â€¢ Release ID: {release.id}
      </div>

      <div
        style={{
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.04)",
          padding: 16,
          marginBottom: 20,
          fontSize: 16,
          lineHeight: 1.6,
        }}
      >
        {release.statement}
      </div>

      <h2 style={{ fontSize: 20, marginBottom: 10 }}>
        Frozen Artifacts ({artifacts.length})
      </h2>

      {artifacts.map((a) => (
        <div
          key={a.id}
          style={{
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(0,0,0,0.20)",
            padding: 14,
            marginBottom: 12,
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 15 }}>
            {a.title}
          </div>

          <div
            style={{
              marginTop: 8,
              whiteSpace: "pre-wrap",
              lineHeight: 1.5,
              fontSize: 14,
            }}
          >
            {a.body}
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Presence Anchor: {fmt(a.createdAt)} â€¢ Artifact ID: {a.id}
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: 24,
          fontSize: 13,
          color: "rgba(255,255,255,0.55)",
        }}
      >
        This release is immutable. Artifacts were anchored at creation and
        frozen at release. This record exists to establish public trust.
      </div>
    </div>
  );
}

