// src/hooks/useOrderSubmit.ts

import React, { useState } from "react";
import type { SubmitStep, OrderPayload, Inputs } from "../types";
import { CONFIG } from "../constants";
import { generateOrderNumber } from "../utils/orderUtils";
import type { SceneViewHandle } from "../SceneView.tsx";

export const useOrderSubmit = (inputs: Inputs) => {
  const [submitStep, setSubmitStep] = useState<SubmitStep>("IDLE");
  const [orderId, setOrderId] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  const prepareOrder = (sceneViewRef: React.RefObject<SceneViewHandle | null>) => {
    if (!sceneViewRef.current) return;

    const dataURL = sceneViewRef.current.takeScreenshot();
    if (!dataURL) {
      alert("画像の生成に失敗しました");
      return;
    }

    const newId = generateOrderNumber();
    setScreenshotUrl(dataURL);
    setOrderId(newId);
    setSubmitStep("CONFIRM");
  };

  // 最終送信処理
  const submitOrder = async () => {
    if (submitStep === "SENDING" || !screenshotUrl) return;

    setSubmitStep("SENDING");

    const payload: OrderPayload = {
      orderId,
      inputs,
      image: screenshotUrl,
      timestamp: new Date().toLocaleString("ja-JP"),
    };

    try {
      const response = await fetch(CONFIG.api.gasUrl, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStep("SUCCESS");
      } else {
        throw new Error("送信失敗");
      }
    } catch (error) {
      console.error(error);
      setSubmitStep("ERROR");
      alert("エラーが発生しました。");
    }
  };

  const resetOrder = () => {
    setSubmitStep("IDLE");
    setOrderId("");
    setScreenshotUrl(null);
  };

  return {
    submitStep,
    screenshotUrl,
    orderId,
    prepareOrder,
    submitOrder,
    resetOrder,
  };
};
