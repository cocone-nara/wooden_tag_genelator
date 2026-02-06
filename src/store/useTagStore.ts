// src/store/useTagStore.ts

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { CONFIG } from "../constants";

export type SubmitStep =
  | "IDLE"
  | "PENDING_SCREENSHOT"
  | "CONFIRM"
  | "SENDING"
  | "SUCCESS"
  | "ERROR";

export interface tagState {
  Inputs: {
    fontSize: number;
    fontFamily: string;
    text: string;
    frameType: string;
  };
  screenshot: {
    requestCount: number;
    dataUrl: string | null;
    orderId: string;
  };
  submitStep: SubmitStep;
  isModelReady: boolean;

  updateInputs: (newInputs: Partial<tagState["Inputs"]>) => void;
  resetInputs: () => void;
  getSelectedFont: () => void;
  getSelectedFrame: () => void;
  PrepareOrder: () => void;
  setScreenshotData: (url: string) => void;
  submitOrder: () => void;
  resetOrder: () => void;
  setIsModelReady: (ready: boolean) => void;
}

export const useTagStore = create<tagState>()(
  subscribeWithSelector((set, get) => ({
    // 初期状態
    Inputs: {
      fontSize: 120,
      fontFamily: CONFIG.fonts[0].id,
      text: "見本",
      frameType: CONFIG.textures.frame[0].id,
    },
    screenshot: {
      requestCount: 0,
      dataUrl: null,
      orderId: "",
    },
    submitStep: "IDLE",
    isModelReady: false,

    // 更新関数
    updateInputs: (newInputs) =>
      set((state) => ({
        Inputs: { ...state.Inputs, ...newInputs },
      })),

    resetInputs: () =>
      set({
        /* 初期値 */
      }),

    // 💡 現在選択されているフォントの「詳細データ」をまるごと返す
    getSelectedFont: () => {
      const currentId = get().Inputs.fontFamily;
      // 配列からIDで検索
      return CONFIG.fonts.find((f) => f.id === currentId) || CONFIG.fonts[0];
    },

    // 💡 現在選択されているフレームの「詳細データ」をまるごと返す
    getSelectedFrame: () => {
      const currentId = get().Inputs.frameType;
      return (
        CONFIG.textures.frame.find((f) => f.id === currentId) ||
        CONFIG.textures.frame[0]
      );
    },

    PrepareOrder: () => {
      set((state) => ({
        screenshot: {
          ...state.screenshot,
          requestCount: state.screenshot.requestCount + 1,
        },
        submitStep: "PENDING_SCREENSHOT",
      }));
    },

    setScreenshotData: (url) =>
      set((state) => ({
        screenshot: {
          ...state.screenshot,
          dataUrl: url,
        },
        submitStep: "CONFIRM",
      })),

    submitOrder: async () => {
      const { screenshot, Inputs } = get();
      set({ submitStep: "SENDING" });
      try {
        const payload = {
          inputs: Inputs,
          image: screenshot.dataUrl,
        };
        const res = await fetch(CONFIG.api.gasUrl, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Network response was not ok");

        const result = await res.json();
        console.log("GASからの返答:", result);

        set((state) => ({
          submitStep: "SUCCESS",
          screenshot: {
            ...state.screenshot,
            orderId: result.orderId, // GASから発行されたIDを保存
          },
        }));
      } catch (error) {
        console.error("Submit Error:", error);
        set({ submitStep: "ERROR" });
      }
    },

    resetOrder: () =>
      set({
        submitStep: "IDLE",
        screenshot: { requestCount: 0, dataUrl: null, orderId: "" },
      }),
    setIsModelReady: ((ready) => set({ isModelReady: ready })),
  })),
);
