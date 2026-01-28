export type HPProject = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
};

const PROJECTS_KEY = "hp.projects.v1";
const ACTIVE_KEY = "hp.activeProjectId.v1";

/** small internal bus so tabs + components stay in sync */
type Listener = () => void;
const listeners = new Set<Listener>();
function emit() { listeners.forEach((fn) => fn()); }

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function writeProjects(next: HPProject[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
  emit();
}

export function listProjects(): HPProject[] {
  return safeParse<HPProject[]>(localStorage.getItem(PROJECTS_KEY), []);
}

export function getActiveProjectId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveProjectId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
  emit();
}

export function clearActiveProjectIfMatches(id: string) {
  const cur = getActiveProjectId();
  if (cur === id) {
    localStorage.removeItem(ACTIVE_KEY);
    emit();
  }
}

export function getActiveProject(): HPProject | null {
  const id = getActiveProjectId();
  if (!id) return null;
  return listProjects().find((p) => p.id === id) ?? null;
}

function makeId(prefix = "proj") {
  const c: any = typeof globalThis !== "undefined" ? (globalThis as any).crypto : undefined;
  return c?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function createProject(name: string): HPProject {
  const now = Date.now();
  const p: HPProject = { id: makeId(), name: name.trim() || "Untitled Project", createdAt: now, updatedAt: now };
  const next = [p, ...listProjects()];
  writeProjects(next);
  setActiveProjectId(p.id);
  return p;
}

export function renameProject(id: string, name: string) {
  const now = Date.now();
  const next = listProjects().map((p) => (p.id === id ? { ...p, name: name.trim() || p.name, updatedAt: now } : p));
  writeProjects(next);
}

export function deleteProject(id: string) {
  const next = listProjects().filter((p) => p.id !== id);
  writeProjects(next);
  clearActiveProjectIfMatches(id);
}

/** Subscribe to changes (same tab + other tabs) */
export function subscribeProjects(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function onStorage(e: StorageEvent) {
  if (!e.key) return;
  if (e.key === PROJECTS_KEY || e.key === ACTIVE_KEY) emit();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", onStorage);
}
