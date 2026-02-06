import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { CONFIG } from "../constants";

export function useTextureAssets() {
  const textureMap = useMemo(() => {
    const frames = Object.fromEntries(
      CONFIG.textures.frame.map((f) => [f.id, f.path]),
    );
    return {
      wood: CONFIG.textures.wood,
      ...frames,
    };
  }, []);

  const loadedTextures = useTexture(textureMap) as Record<string, any>;

  const assets = useMemo(() => {
    Object.values(loadedTextures).forEach((t) => (t.flipY = false));

    const frameImages: Record<string, HTMLImageElement> = {};
    // CONFIG に基づいて安全にマッピング
    CONFIG.textures.frame.forEach((f) => {
        frameImages[f.id] = loadedTextures[f.id].image as HTMLImageElement;
    });

    return {
      wood: loadedTextures.wood?.image as HTMLImageElement,
      frames: frameImages,
    };
  }, [loadedTextures]);
  return assets;
}
