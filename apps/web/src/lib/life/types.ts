export type LifeEventType = "movement" | "work" | "meeting" | "health" | "reflection";

export type LifeEvent = {
  id: string;
  user_id: string;
  type: LifeEventType;
  title: string;
  notes: string | null;
  location: string | null;
  created_at: string; // ISO
};

export const LIFE_TYPES: { value: LifeEventType; label: string }[] = [
  { value: "movement", label: "Movement" },
  { value: "work", label: "Work" },
  { value: "meeting", label: "Meeting" },
  { value: "health", label: "Health" },
  { value: "reflection", label: "Reflection" },
];
