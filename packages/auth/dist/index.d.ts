export type HumanId = string;
/**
 * HomePlanet Auth Kernel (v0)
 * - No Supabase, no OAuth, no vendors yet.
 * - This is the canonical interface we own.
 */
export type SessionId = string;
export type AuthLevel = "Guest" | "Human" | "VerifiedHuman" | "Guardian" | "System";
export type Session = {
    sessionId: SessionId;
    humanId?: HumanId;
    level: AuthLevel;
    issuedAt: number;
    expiresAt: number;
};
export type LoginRequest = {
    handle: string;
    secret: string;
};
export type LoginResult = {
    ok: true;
    session: Session;
} | {
    ok: false;
    reason: "INVALID_CREDENTIALS" | "LOCKED" | "RATE_LIMITED";
};
export type AuthPort = {
    login(req: LoginRequest): Promise<LoginResult>;
    logout(sessionId: SessionId): Promise<{
        ok: true;
    }>;
    getSession(sessionId: SessionId): Promise<Session | null>;
};
/**
 * In-memory reference implementation (for local dev / demos).
 * Replace with DB-backed adapter later.
 */
export declare function createInMemoryAuthPort(): AuthPort;
//# sourceMappingURL=index.d.ts.map