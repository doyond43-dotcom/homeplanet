/**
 * HomePlanet text normalization — SAFE MODE
 * Browser + Supabase already provide valid UTF-8.
 * We NEVER reinterpret characters on the client.
 * Only trims invisible BOM characters.
 */

export function normalizeStringsDeep<T>(value: T): T {
  const stripBom = (v: any): any => {
    if (typeof v === "string") return v.replace(/^\uFEFF/, "");
    if (Array.isArray(v)) return v.map(stripBom);
    if (v && typeof v === "object") {
      const out: any = {};
      for (const k in v) out[k] = stripBom(v[k]);
      return out;
    }
    return v;
  };

  return stripBom(value);
}

/* legacy stubs kept so imports don't break */
export const fixMojibakeDeep = <T extends string>(s: T) => s;
export const fixMojibakeOnce = <T extends string>(s: T) => s;
export const looksMojibake = (_: string) => false;
