import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!alive) return;

      setHasRecoverySession(Boolean(data.session));
      setCheckingSession(false);
    }

    void checkSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!alive) return;

        if (event === "PASSWORD_RECOVERY" || session) {
          setHasRecoverySession(Boolean(session));
          setCheckingSession(false);
        }
      },
    );

    return () => {
      alive = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function sendResetEmail(event: React.FormEvent) {
    event.preventDefault();

    setBusy(true);
    setMessage("");
    setErrorMessage("");

    try {
      const redirectTo = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo },
      );

      if (error) throw error;

      setMessage(
        "Password reset email sent. Open the email and click the secure recovery link.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not send password reset email.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function updatePassword(event: React.FormEvent) {
    event.preventDefault();

    setBusy(true);
    setMessage("");
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      await supabase.auth.signOut();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not update password.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (checkingSession) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>HomePlanet Access</p>
          <h1 style={headingStyle}>Checking recovery session...</h1>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>HomePlanet Access</p>

        {hasRecoverySession ? (
          <>
            <h1 style={headingStyle}>Set a new password</h1>

            <p style={bodyStyle}>
              Enter the new password you want to use for your HomePlanet account.
            </p>

            <form onSubmit={updatePassword} style={formStyle}>
              <label style={labelStyle}>
                New password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
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
              Enter your account email and we will send you a secure password
              recovery link.
            </p>

            <form onSubmit={sendResetEmail} style={formStyle}>
              <label style={labelStyle}>
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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

        {message ? <div style={successStyle}>{message}</div> : null}

        {errorMessage ? (
          <div style={errorStyle}>{errorMessage}</div>
        ) : null}

        <div style={footerStyle}>
          <Link to="/login" style={linkStyle}>
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
  padding: 24,
  background:
    "radial-gradient(circle at 20% 0%, rgba(22,151,223,0.12), transparent 32%), #07090a",
  color: "#f8f7f2",
};

const cardStyle: React.CSSProperties = {
  width: "min(100%, 460px)",
  padding: 30,
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 18,
  background: "#0c1114",
  boxShadow: "0 28px 80px rgba(0,0,0,0.4)",
};

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: "#79c8f4",
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const headingStyle: React.CSSProperties = {
  margin: "10px 0",
  fontSize: 32,
  lineHeight: 1.05,
  color: "#ffffff",
};

const bodyStyle: React.CSSProperties = {
  margin: "0 0 22px",
  color: "#aeb8bf",
  lineHeight: 1.6,
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 7,
  color: "#f4f2ea",
  fontSize: 14,
  fontWeight: 800,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 50,
  padding: "11px 13px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "#121920",
  color: "#ffffff",
  font: "inherit",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  minHeight: 52,
  borderRadius: 12,
  border: "1px solid rgba(21,151,223,0.75)",
  background: "#1597df",
  color: "#061016",
  font: "inherit",
  fontWeight: 900,
  cursor: "pointer",
};

const successStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(59,201,124,0.35)",
  background: "rgba(59,201,124,0.10)",
  color: "#baf3d2",
  lineHeight: 1.5,
};

const errorStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(255,92,92,0.35)",
  background: "rgba(255,92,92,0.08)",
  color: "#ffb6b6",
};

const footerStyle: React.CSSProperties = {
  marginTop: 20,
  fontSize: 14,
};

const linkStyle: React.CSSProperties = {
  color: "#79c8f4",
  fontWeight: 800,
};