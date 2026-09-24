import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type StaffOption = {
  staff_id: string;
  display_name: string;
  company: string | null;
  roles: string[];
};

type LoginResult = {
  ok: boolean;
  staffId?: string;
  displayName?: string;
  company?: string | null;
  roles?: string[];
  accessToken?: string;
  expiresAt?: string;
  error?: string;
};

const STORAGE_KEY = "premier_staff_session";

function destinationForRoles(roles: string[]) {
  if (roles.includes("office")) {
    return "/planet/premier-window-door/board";
  }

  if (roles.includes("sales")) {
    return "/planet/premier-window-door/sales";
  }

  if (roles.includes("field")) {
    return "/planet/premier-window-door/field";
  }

  return "/planet/premier-window-door/tech";
}

export default function PremierStaffLoginPage() {
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [staffId, setStaffId] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [errorText, setErrorText] = useState("");

  const selectedStaff = useMemo(
    () => staff.find((item) => item.staff_id === staffId) ?? null,
    [staff, staffId]
  );

  useEffect(() => {
    const loadStaff = async () => {
      setLoadingStaff(true);

      const { data, error } = await supabase.rpc(
        "get_premier_staff_login_options"
      );

      if (error) {
        console.error("Premier staff list failed:", error);
        setErrorText("Could not load Premier staff.");
        setLoadingStaff(false);
        return;
      }

      setStaff((data ?? []) as StaffOption[]);
      setLoadingStaff(false);
    };

    void loadStaff();
  }, []);

  const signIn = async () => {
    setErrorText("");

    if (!staffId) {
      setErrorText("Choose your name.");
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setErrorText("Enter your 4-digit PIN.");
      return;
    }

    setSigningIn(true);

    const { data, error } = await supabase.functions.invoke(
      "premier-staff-login",
      {
        body: {
          staffId,
          pin,

        },
      }
    );

    setSigningIn(false);

    if (error) {
      console.error("Premier staff login failed:", error);
      setErrorText("Could not sign in. Check your name and PIN.");
      return;
    }

    const result = data as LoginResult;

    if (!result?.ok || !result.accessToken || !result.displayName) {
      setErrorText(
        result?.error === "rate_limited"
          ? "Too many attempts. Try again in a little while."
          : "Name or PIN did not match."
      );
      return;
    }

    const session = {
      staffId: result.staffId,
      displayName: result.displayName,
      company: result.company ?? null,
      roles: result.roles ?? [],
      accessToken: result.accessToken,
      expiresAt: result.expiresAt,
    };

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));

    const destination = destinationForRoles(session.roles);

    window.location.href =
      destination +
      "?access=" +
      encodeURIComponent(session.accessToken);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#101419",
        color: "#f3f6f8",
        padding: "28px 16px",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "50px auto 0",
        }}
      >
        <div
          style={{
            color: "#8fa9bc",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Premier Window & Door
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.05,
          }}
        >
          Staff Sign In
        </h1>

        <p
          style={{
            color: "#9ca8b2",
            fontSize: 14,
            lineHeight: 1.5,
            margin: "10px 0 22px",
          }}
        >
          Choose your name and enter your 4-digit PIN.
          Your sign-in stays active for your work session.
        </p>

        <div
          style={{
            border: "1px solid #31495a",
            borderRadius: 18,
            background: "#111820",
            padding: 16,
            display: "grid",
            gap: 14,
          }}
        >
          <label style={{ display: "grid", gap: 6 }}>
            <span
              style={{
                color: "#9ca8b2",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              YOUR NAME
            </span>

            <select
              value={staffId}
              disabled={loadingStaff || signingIn}
              onChange={(event) => {
                setStaffId(event.target.value);
                setErrorText("");
              }}
              style={{
                minHeight: 48,
                border: "1px solid #31495a",
                borderRadius: 10,
                background: "#0c1116",
                color: "#f3f6f8",
                padding: "0 12px",
                fontSize: 15,
              }}
            >
              <option value="">
                {loadingStaff ? "Loading staff..." : "Choose your name"}
              </option>

              {staff.map((person) => (
                <option key={person.staff_id} value={person.staff_id}>
                  {person.display_name}
                  {person.company &&
                  person.company !== "Premier Window & Door Design"
                    ? ` — ${person.company}`
                    : ""}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span
              style={{
                color: "#9ca8b2",
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              4-DIGIT PIN
            </span>

            <div style={{ position: "relative" }}>
            <input
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              value={pin}
              disabled={signingIn}
              onChange={(event) => {
                setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
                setErrorText("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void signIn();
                }
              }}
              placeholder="••••"
              style={{
                minHeight: 48,
                border: "1px solid #31495a",
                borderRadius: 10,
                background: "#0c1116",
                color: "#f3f6f8",
                padding: "0 12px",
                fontSize: 20,
                letterSpacing: 6,
                paddingRight: 54,
              }}
            />

            <button
              type="button"
              onClick={() => setShowPin((current) => !current)}
              aria-label={showPin ? "Hide PIN" : "Show PIN"}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 38,
                height: 38,
                border: 0,
                background: "transparent",
                color: "#ffffff",
                fontSize: 20,
                lineHeight: 1,
                cursor: "pointer",
              }}
            >
              {showPin ? "◉" : "👁"}
            </button>
            </div>
          </label>

          {selectedStaff ? (
            <div
              style={{
                color: "#8fa9bc",
                fontSize: 12,
              }}
            >
              Signing in as <strong>{selectedStaff.display_name}</strong>
            </div>
          ) : null}

          {errorText ? (
            <div
              style={{
                border: "1px solid #744b4b",
                borderRadius: 9,
                background: "#211516",
                color: "#efb5b5",
                padding: "10px 12px",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {errorText}
            </div>
          ) : null}

          <button
            type="button"
            disabled={signingIn || loadingStaff}
            onClick={() => void signIn()}
            style={{
              minHeight: 50,
              border: "1px solid #557c64",
              borderRadius: 10,
              background: "#16232d",
              color: "#d9e5ee",
              fontSize: 15,
              fontWeight: 900,
              cursor: signingIn ? "wait" : "pointer",
              opacity: signingIn ? 0.7 : 1,
            }}
          >
            {signingIn ? "Signing In..." : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}
