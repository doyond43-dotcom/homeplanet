/**
 * HomePlanet text normalization — SINGLE SOURCE OF TRUTH
 * Fixes UTF-8 mojibake caused by wrong decoding (cp1252/latin1) AND double-encoded variants.
 */

export function looksMojibake(s: string): boolean {
  if (!s) return false;
  return /(Ã.|Ãƒ|Â |Â$|â€|â€™|â€œ|â€|â€“|â€”|â€¦|ï»¿)/u.test(s);
}

function latin1BytesToUtf8Decode(input: string): string {
  const bytes = Uint8Array.from(input, (c) => c.charCodeAt(0) & 0xff);
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

export function fixMojibakeOnce(input: string): string {
  if (!input) return input;
  if (!looksMojibake(input)) return input;

  try {
    const decoded = latin1BytesToUtf8Decode(input);
    return decoded || input;
  } catch {
    return input;
  }
}

/**
 * Multi-pass fix: handles double-encoded junk like ÃƒÆ’Ã‚Â...
 * Runs up to 4 passes until it stabilizes.
 */
export function fixMojibakeDeep(input: string): string {
  if (!input) return input;

  let cur = input;
  for (let i = 0; i < 4; i++) {
    if (!looksMojibake(cur)) break;
    const next = fixMojibakeOnce(cur);
    if (!next || next === cur) break;
    cur = next;
  }
  return cur;
}

export function normalizeStringsDeep<T>(value: T): T {
  const seen = new WeakMap<object, any>();

  const walk = (v: any): any => {
    if (typeof v === "string") return fixMojibakeDeep(v);
    if (v === null || v === undefined) return v;
    if (typeof v !== "object") return v;

    if (seen.has(v)) return seen.get(v);

    if (Array.isArray(v)) {
      const arr: any[] = [];
      seen.set(v, arr);
      for (const item of v) arr.push(walk(item));
      return arr;
    }

    const obj: Record<string, any> = {};
    seen.set(v, obj);
    for (const [k, val] of Object.entries(v)) obj[k] = walk(val);
    return obj;
  };

  return walk(value);
}