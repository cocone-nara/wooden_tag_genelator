import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useDebouncedCallback } from "use-debounce";
import { useTagStore } from "./store/useTagStore";
import { updateAllCanvases } from "./utils/textureUtils";
declare const Typekit: any;

export function useTextureUpdate(
  canvasesCtx: {
    bump: CanvasRenderingContext2D;
    roughness: CanvasRenderingContext2D;
    albedo: CanvasRenderingContext2D;
  },
  assets: {
    wood: HTMLImageElement;
    frames: { "1": HTMLImageElement; "2": HTMLImageElement; };
  },
  textures: {
    bump: THREE.CanvasTexture;
    roughness: THREE.CanvasTexture;
    albedo: THREE.CanvasTexture;
  }) {
  const [isReady, setIsReady] = useState(false);
  const renderRef = useRef<(() => void) | null>(null);

  const debouncedrender = useDebouncedCallback(async () => {
    renderRef.current?.();
  }, 300);

  // アセットとフォントのロード
  useEffect(() => {
    const init = async () => {
      // フォントロード
      if (typeof Typekit !== "undefined") {
        await new Promise((resolve) => Typekit.load({ active: resolve }));
      }

      const render = () => {
        const state = useTagStore.getState();
        updateAllCanvases(canvasesCtx, {
          wood: assets.wood,
          frame: assets.frames[state.Inputs.frameType as keyof typeof assets.frames],
        });

        // Three.js 側に更新通知
        textures.bump.needsUpdate = true;
        textures.roughness.needsUpdate = true;
        textures.albedo.needsUpdate = true;
      };

      renderRef.current = render;
      render(); // 初回描画
      setIsReady(true);

      // 購読（debounceが必要な場合はここに仕込む）
      const unsubscribe = useTagStore.subscribe(
        (state) => state.Inputs,
        () => debouncedrender()
      );

      return unsubscribe;
    };

    const cleanupPromise = init();

    return () => {
      cleanupPromise.then((unsubscribe) => unsubscribe?.());
    };
  }, [assets, textures, canvasesCtx]);

  return isReady;
}
