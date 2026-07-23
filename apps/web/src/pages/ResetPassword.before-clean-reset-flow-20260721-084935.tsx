import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const nav = useNavigate();

  const [email, setEmail] = useState("doyond43@gmail.com");
  const [password, setPassword] = useState("");
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!alive) return;

      setHasRecoverySession(!!data.session);
      setCheckingSession(false);
    }

    void checkSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!alive) return;

        if (event === "PASSWORD_RECOVERY" || session) {
          setHasRecoverySession(!!session);
        }
      },
    );

    return () => {
      alive = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function sendResetEmail(e: React.FormEvent) {
    e.preventDefault();

    setErr("");
    setMessage("");
    setBusy(true);

    try {
      const redirectTo =
        `${window.location.origin}/reset-password`;

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo },
        );

      if (error) throw error;

      setMessage(
        `Password reset email sent to ${email.trim()}. Open that email on this computer and click the recovery link.`,
      );
    } catch (error: any) {
      setErr(error?.message ?? "Could not send password reset email.");
    } finally {
      setBusy(false);
    }
  }

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();

    setErr("");
    setMessage("");
    setBusy(true);

    try {
      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) throw error;

      await supabase.auth.signOut();

      nav("/login", {
        replace: true,
      });
    } catch (error: any) {
      setErr(error?.message ?? "Failed to update password.");
    } finally {
      setBusy(false);
    }
  }

  if (checkingSession) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <div style={eyebrowStyle}>HomePlanet Access</div>
          <h1 style={headingStyle}>Checking recovery session...</h1>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={eyebrowStyle}>HomePlanet Access</div>

        {hasRecoverySession ? (
          <>
            <h1 style={headingStyle}>Set a new password</h1>

            <p style={bodyStyle}>
              Enter the new password you want to use for this HomePlanet account.
            </p>

            <form
              onSubmit={updatePassword}
              style={formStyle}
            >
              <label style={labelStyle}>
                New password
                <input
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  style={inputStyle}
                />
              </label>

              <button
                type="submit"
                disabled={busy || password.length < 6}
                style={buttonStyle}
              >
                {busy ? "Updating..." : "Update password"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 style={headingStyle}>Reset your password</h1>

            <p style={bodyStyle}>
              We’ll send a secure recovery link to your account email.
            </p>

            <form
              onSubmit={sendResetEmail}
              style={formStyle}
            >
              <label style={labelStyle}>
                Email address
                <input
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  type="email"
                  autoComplete="email"
                  required
                  style={inputStyle}
                />
              </label>

              <button
                type="submit"
                disabled={busy || email.trim().length < 4}
                style={buttonStyle}
              >
                {busy ? "Sending..." : "Send reset email"}
              </button>
            </form>
          </>
        )}

        {message ? (
          <div style={successStyle}>
            {message}
          </div>
        ) : null}

        {err ? (
          <div style={errorStyle}>
            {err}
          </div>
        ) : null}

        <div style={footerStyle}>
          <Link
            to="/login"
            style={linkStyle}
          >
            Back to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "24px",
  background:
    "radial-gradient(circle at 20% 0%, rgba(22,151,223,0.12), transparent 32%), #07090a",
  color: "#f8f7f2",
};

const cardStyle: React.CSSProperties = {
  width: "min(100%, 460px)",
  padding: "30px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "#0c1114",
  boxShadow: "0 28px 80px rgba(0,0,0,0.4)",
};

const eyebrowStyle: React.CSSProperties = {
  color: "#1597df",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const headingStyle: React.CSSProperties = {
  margin: "10px 0 10px",
  fontSize: "32px",
  lineHeight: 1.05,
};

const bodyStyle: React.CSSProperties = {
  margin: "0 0 22px",
  color: "#aeb8bf",
  lineHeight: 1.6,
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: "16px",
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: "7px",
  color: "#f4f2ea",
  fontSize: "14px",
  fontWeight: 800,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "50px",
  padding: "11px 13px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "#121920",
  color: "#ffffff",
  font: "inherit",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  minHeight: "52px",
  border: "1px solid rgba(21,151,223,0.75)",
  background: "#1597df",
  color: "#061016",
  font: "inherit",
  fontWeight: 950,
  cursor: "pointer",
};

const successStyle: React.CSSProperties = {
  marginTop: "18px",
  padding: "14px",
  border: "1px solid rgba(59,201,124,0.35)",
  background: "rgba(59,201,124,0.10)",
  color: "#baf3d2",
  lineHeight: 1.5,
};

const errorStyle: React.CSSProperties = {
  marginTop: "18px",
  padding: "14px",
  border: "1px solid rgba(255,92,92,0.35)",
  background: "rgba(255,92,92,0.08)",
  color: "#ffb6b6",
};

const footerStyle: React.CSSProperties = {
  marginTop: "20px",
  fontSize: "14px",
};

const linkStyle: React.CSSProperties = {
  color: "#79c8f4",
  fontWeight: 800,
};