import { create } from "zustand";

export const useGameStore = create((set, get) => ({
  scene: "intro",
  score: 0,
  alertSeen: false,
  monkWarn: false,
  visitedNpcs: [],
  audienceChoice: null,
  examIndex: 0,
  examRetries: {},
  examPassed: false,
  endingTier: "polite",
  playerInscription: "",
  visitCount: Number(localStorage.getItem("wzt_visit") || 0) + 1,

  setScene: (scene) => set({ scene }),
  addScore: (n) => {
    const score = get().score + n;
    const patch = { score };
    if (n >= 3) patch.alertSeen = true;
    set(patch);
  },
  setMonkWarn: () => set({ monkWarn: true }),
  markVisited: (id) =>
    set((s) => ({
      visitedNpcs: s.visitedNpcs.includes(id) ? s.visitedNpcs : [...s.visitedNpcs, id],
    })),
  setAudienceChoice: (c) => set({ audienceChoice: c }),
  answerExam: (correct) => {
    const { examIndex, examRetries } = get();
    if (correct) {
      if (examIndex >= 2) set({ examPassed: true, scene: "ending" });
      else set({ examIndex: examIndex + 1 });
      return { ok: true };
    }
    const retries = examRetries[examIndex] || 0;
    if (retries >= 1) {
      set({ examPassed: false, scene: "fail" });
      return { ok: false, failed: true };
    }
    set({ examRetries: { ...examRetries, [examIndex]: retries + 1 } });
    return { ok: false, retry: true };
  },
  finalizeStreet: () => {
    const { score, alertSeen } = get();
    let endingTier = "normal";
    if (score <= 1 && !alertSeen) endingTier = "polite";
    else if (alertSeen || score >= 3) endingTier = "severe";
    set({ endingTier, scene: "settle" });
  },
  setInscription: (text) => set({ playerInscription: text.slice(0, 6) }),
  persistVisit: () => {
    localStorage.setItem("wzt_visit", String(get().visitCount));
  },
  resetGame: () =>
    set({
      scene: "intro",
      score: 0,
      alertSeen: false,
      monkWarn: false,
      visitedNpcs: [],
      audienceChoice: null,
      examIndex: 0,
      examRetries: {},
      examPassed: false,
      endingTier: "polite",
      playerInscription: "",
    }),
}));
