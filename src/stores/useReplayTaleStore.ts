import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TaleContent } from "../types/tale";

interface userTaleContent {
  storyId: string[];
  userId: number;
  tale: TaleContent;
}

interface ReplayTaleState {
  replayTale: userTaleContent | null;
  setReplayTale: (data: userTaleContent) => void;
  clearReplayTale: () => void;
}

export const useReplayTaleStore = create<ReplayTaleState>()(
  persist(
    (set) => ({
      replayTale: null,
      setReplayTale: (data) => set({ replayTale: data }),
      clearReplayTale: () => set({ replayTale: null }),
    }),
    {
      name: "replayTale-storage",
    }
  )
);
