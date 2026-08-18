import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function OkeechobeeHelperJoinPage() {
  const { slug } = useParams();

  const [state, setState] = useState<
    "joining" | "success" | "error"
  >("joining");

  const [message, setMessage] = useState(
    "Adding you to this project..."
  );

  useEffect(() => {
    const token = window.location.hash
      .replace(/^#/, "")
      .trim();

    if (!slug || !token) {
      setState("error");
      setMessage("This helper invitation is incomplete.");
      return;
    }

    async function join() {
      try {
        const response = await fetch(
          "/api/okeechobee-helper-join",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slug,
              token,
            }),
          }
        );

        const result = await response
          .json()
          .catch(() => null);

        if (!response.ok || result?.ok !== true) {
          throw new Error(
            result?.error ||
            "You could not be added to the project."
          );
        }

        window.localStorage.setItem(
          `okeechobee-helper-joined:${slug}`,
          "true"
        );

        setState("success");
        setMessage(
          `Thank you${result.helperName ? `, ${result.helperName}` : ""}. You're officially helping this project. No need to join again.`
        );
      } catch (error) {
        setState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "You could not be added to the project."
        );
      }
    }

    join();
  }, [slug]);

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>
          Okeechobee Together
        </p>

        <h1 style={styles.title}>
          {state === "joining"
            ? "Joining project..."
            : state === "success"
              ? "You're helping."
              : "Invitation unavailable"}
        </h1>

        <p style={styles.text}>
          {message}
        </p>

        {state === "success" && (
          <Link
            to={`/planet/okeechobee/event/${slug}`}
            style={styles.primaryButton}
          >
            View Project
          </Link>
        )}

        {state === "error" && (
          <Link
            to="/planet/okeechobee"
            style={styles.primaryButton}
          >
            Back to Okeechobee Together
          </Link>
        )}
      </section>
    </main>
  );
}

const styles: Record<string, any> = {
  page: {
    minHeight: "100vh",
    background: "#070707",
    color: "#fff",
    padding: "36px 18px",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  card: {
    maxWidth: 680,
    margin: "0 auto",
  },

  kicker: {
    color: "#72f56d",
    fontWeight: 900,
  },

  title: {
    fontSize: "clamp(38px, 9vw, 60px)",
    lineHeight: 1,
    margin: "12px 0 18px",
  },

  text: {
    color: "#bbb",
    fontSize: 18,
    lineHeight: 1.6,
    marginBottom: 24,
  },

  primaryButton: {
    display: "inline-flex",
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    padding: "0 18px",
    borderRadius: 12,
    background: "#39ff14",
    color: "#071006",
    fontWeight: 900,
    textDecoration: "none",
  },
};

