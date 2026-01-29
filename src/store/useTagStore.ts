// src/store/useTagStore.ts

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface tagState {
  Inputs: {
    fontSize: number;
    fontFamily: string;
    text: string;
    frameType: string;
  };
  updateInputs: (newInputs: Partial<tagState["Inputs"]>) => void;
  resetInputs: () => void;
}

export const useTagStore = create<tagState>()(subscribeWithSelector((set) => ({
  // 初期状態
  Inputs: {
    fontSize: 120,
    fontFamily: "ta-fuga-fude",
    text: "見本",
    frameType: "1",
  },

  // 更新関数
  updateInputs: (newInputs) =>
    set((state) => ({
      Inputs: { ...state.Inputs, ...newInputs },
    })),

  resetInputs: () =>
    set({
      /* 初期値 */
    }),
  
}))
);
