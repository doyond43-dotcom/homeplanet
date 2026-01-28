export type HumanId = string;

/**
 * HomePlanet Auth Kernel (v0)
 * - No Supabase, no OAuth, no vendors yet.
 * - This is the canonical interface we own.
 */

export type SessionId = string;

export type AuthLevel =
  | "Guest"
  | "Human"
  | "VerifiedHuman"
  | "Guardian"
  | "System";

export type Session = {
  sessionId: SessionId;
  humanId?: HumanId;
  level: AuthLevel;
  issuedAt: number;   // epoch ms
  expiresAt: number;  // epoch ms
};

export type LoginRequest = {
  handle: string;     // email/username/phone (we keep it generic)
  secret: string;     // password/passkey token/etc. (still generic)
};

export type LoginResult =
  | { ok: true; session: Session }
  | { ok: false; reason: "INVALID_CREDENTIALS" | "LOCKED" | "RATE_LIMITED" };

export type AuthPort = {
  login(req: LoginRequest): Promise<LoginResult>;
  logout(sessionId: SessionId): Promise<{ ok: true }>;
  getSession(sessionId: SessionId): Promise<Session | null>;
};

/**
 * In-memory reference implementation (for local dev / demos).
 * Replace with DB-backed adapter later.
 */
export function createInMemoryAuthPort(): AuthPort {
  const sessions = new Map<SessionId, Session>();

  function newId(prefix: string) {
    return `${prefix}:${Math.random().toString(16).slice(2)}:${Date.now()}`;
  }

  async function login(req: LoginRequest): Promise<LoginResult> {
    // v0 demo rule: secret must equal "planet"
    if (req.secret !== "planet" && req.secret !== "planet-verified" && req.secret !== "planet-system") {
  return { ok: false, reason: "INVALID_CREDENTIALS" };
}

    const now = Date.now();
    const session: Session = {
      sessionId: newId("session"),
      humanId: `human:${req.handle}`,
      level:
  req.secret === "planet-system" ? "System" :
  req.secret === "planet-verified" ? "VerifiedHuman" :
  "Human",
      issuedAt: now,
      expiresAt: now + 1000 * 60 * 60 * 12 // 12 hours
    };

    sessions.set(session.sessionId, session);
    return { ok: true, session };
  }

  async function logout(sessionId: SessionId) {
    sessions.delete(sessionId);
    return { ok: true as const };
  }

  async function getSession(sessionId: SessionId) {
    const s = sessions.get(sessionId) || null;
    if (!s) return null;
    if (Date.now() > s.expiresAt) {
      sessions.delete(sessionId);
      return null;
    }
    return s;
  }

  return { login, logout, getSession };
}


