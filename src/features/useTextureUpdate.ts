import { useState, useEffect } from "react";
import * as THREE from "three";
import { useDebouncedCallback } from "use-debounce";
import { useTagStore } from "../store/useTagStore";
import { updateAllCanvases } from "./textureUtils";
declare const Typekit: any;

export function useTextureUpdate(
  canvasesCtx: {
    bump: CanvasRenderingContext2D;
    roughness: CanvasRenderingContext2D;
    albedo: CanvasRenderingContext2D;
  },
  assets: {
    wood: HTMLImageElement;
    frames: Record<string, HTMLImageElement>;
  },
  textures: {
    bump: THREE.CanvasTexture;
    roughness: THREE.CanvasTexture;
    albedo: THREE.CanvasTexture;
  },
) {
  const [isReady, setIsReady] = useState(false);

  const performUpdate = async () => {
    const state = useTagStore.getState();
    const inputs = state.Inputs;

    // 画像のデコードを待機
    const imagesToDecode = [assets.wood, ...Object.values(assets.frames)];
    await Promise.all(
      imagesToDecode
        .filter((img) => img instanceof HTMLImageElement)
        .map((img) => img.decode().catch(() => {})), // すでにデコード済みならすぐ解決される
    );

    // フォントロード
    if (typeof Typekit !== "undefined") {
      await new Promise((resolve) => Typekit.load({ active: resolve }));
      await document.fonts.ready;
    }

    //Canvas更新
    updateAllCanvases(inputs, canvasesCtx, {
      wood: assets.wood,
      frames: assets.frames[inputs.frameType],
    });

    // Three.js 側に更新通知
    textures.bump.needsUpdate = true;
    textures.roughness.needsUpdate = true;
    textures.albedo.needsUpdate = true;
  };
  const debouncedUpdate = useDebouncedCallback(performUpdate, 300);

  useEffect(() => {
    // 初回描画
    performUpdate().then(() => setIsReady(true));

    // 購読（debounceが必要な場合はここに仕込む）
    const unsubscribe = useTagStore.subscribe(
      (state) => state.Inputs,
      () => debouncedUpdate(),
    );

    return () => unsubscribe();
  }, [assets, textures, canvasesCtx]);

  return isReady;
}
