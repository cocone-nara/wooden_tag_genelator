import { useMemo } from "react";
import * as THREE from "three";
import { CONFIG } from "./constants";

export function useInitTexture() {
  const canvases = useMemo(() => {
    const c = {
      bump: document.createElement("canvas"),
      roughness: document.createElement("canvas"),
      albedo: document.createElement("canvas"),
    };
    // 生成時にサイズを確定させる
    Object.values(c).forEach((canvas) => {
      canvas.width = CONFIG.canvasSize;
      canvas.height = CONFIG.canvasSize;
    });
    return c;
  }, []);

  const canvasesCtx = useMemo(
    () => ({
      bump: canvases.bump.getContext("2d")!,
      roughness: canvases.roughness.getContext("2d")!,
      albedo: canvases.albedo.getContext("2d")!,
    }),
    [canvases]
  );

  // CanvasTextureを保持
  const textures = useMemo(() => {
    const texs = {
      bump: new THREE.CanvasTexture(canvases.bump),
      roughness: new THREE.CanvasTexture(canvases.roughness),
      albedo: new THREE.CanvasTexture(canvases.albedo),
    };
    // 共通設定
    Object.values(texs).forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.repeat.set(CONFIG.plane.aspect, 1);
      tex.offset.set(CONFIG.plane.offsetX, 0);
    });

    texs.albedo.colorSpace = THREE.SRGBColorSpace;
    // bumpやroughnessはデータ（数値）としてのテクスチャなので Linear のままにします
    texs.bump.colorSpace = THREE.NoColorSpace;
    texs.roughness.colorSpace = THREE.NoColorSpace;

    return texs;
  }, [canvases]);
  return { textures, canvases, canvasesCtx };
}
