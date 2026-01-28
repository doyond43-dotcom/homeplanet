import { create } from "zustand";

type ProjectState = {
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  hydrateActiveFromStorage: () => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  activeProjectId: null,

  setActiveProjectId: (id) => {
    set({ activeProjectId: id });
    try {
      if (id) localStorage.setItem("hp_active_project_id", id);
      else localStorage.removeItem("hp_active_project_id");
    } catch {
      // ignore (SSR / privacy mode)
    }
  },

  hydrateActiveFromStorage: () => {
    try {
      const id = localStorage.getItem("hp_active_project_id");
      if (id) set({ activeProjectId: id });
    } catch {
      // ignore
    }
  },
}));
