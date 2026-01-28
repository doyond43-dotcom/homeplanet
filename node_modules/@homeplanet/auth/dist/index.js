/**
 * In-memory reference implementation (for local dev / demos).
 * Replace with DB-backed adapter later.
 */
export function createInMemoryAuthPort() {
    const sessions = new Map();
    function newId(prefix) {
        return `${prefix}:${Math.random().toString(16).slice(2)}:${Date.now()}`;
    }
    async function login(req) {
        // v0 demo rule: secret must equal "planet"
        if (req.secret !== "planet" && req.secret !== "planet-verified" && req.secret !== "planet-system") {
            return { ok: false, reason: "INVALID_CREDENTIALS" };
        }
        const now = Date.now();
        const session = {
            sessionId: newId("session"),
            humanId: `human:${req.handle}`,
            level: req.secret === "planet-system" ? "System" :
                req.secret === "planet-verified" ? "VerifiedHuman" :
                    "Human",
            issuedAt: now,
            expiresAt: now + 1000 * 60 * 60 * 12 // 12 hours
        };
        sessions.set(session.sessionId, session);
        return { ok: true, session };
    }
    async function logout(sessionId) {
        sessions.delete(sessionId);
        return { ok: true };
    }
    async function getSession(sessionId) {
        const s = sessions.get(sessionId) || null;
        if (!s)
            return null;
        if (Date.now() > s.expiresAt) {
            sessions.delete(sessionId);
            return null;
        }
        return s;
    }
    return { login, logout, getSession };
}
//# sourceMappingURL=index.js.map