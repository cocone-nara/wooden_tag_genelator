import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { CONFIG } from "../constants";

export function useInitTexture() {
  const result = useMemo(() => {
    const canvases = {
      bump: document.createElement("canvas"),
      roughness: document.createElement("canvas"),
      albedo: document.createElement("canvas"),
    };
    // 生成時にサイズを確定させる
    Object.values(canvases).forEach((canvas) => {
      canvas.width = CONFIG.canvasSize;
      canvas.height = CONFIG.canvasSize;
    });

    // ctx作成
    const canvasesCtx = {
      bump: canvases.bump.getContext("2d")!,
      roughness: canvases.roughness.getContext("2d")!,
      albedo: canvases.albedo.getContext("2d")!,
    };
    // three.texture作成
    const textures = {
      bump: new THREE.CanvasTexture(canvases.bump),
      roughness: new THREE.CanvasTexture(canvases.roughness),
      albedo: new THREE.CanvasTexture(canvases.albedo),
    };

    // texture共通設定
    Object.values(textures).forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.repeat.set(CONFIG.plane.aspect, 1);
      tex.offset.set(CONFIG.plane.offsetX, 0);
    });
    textures.albedo.colorSpace = THREE.SRGBColorSpace;
    textures.bump.colorSpace = THREE.NoColorSpace;
    textures.roughness.colorSpace = THREE.NoColorSpace;

    return {
      canvases,
      canvasesCtx,
      textures,
    };
  }, []);

  // dispose処理
  useEffect(() => {
    return () => {
      Object.values(result.textures).forEach((tex) => {
        tex.dispose();
      });
    };
  }, [result.textures]);

  return result;
}
