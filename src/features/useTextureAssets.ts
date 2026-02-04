import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { CONFIG } from "../constants";

export function useTextureAssets() {
  const loadedTextures = useTexture({
    wood: CONFIG.textures.wood,
    frame1: CONFIG.textures.frame_1,
    frame2: CONFIG.textures.frame_2,
  });
  const assets = useMemo(() => {
    Object.values(loadedTextures).forEach((t) => (t.flipY = false));
    return {
      wood: loadedTextures.wood.image as HTMLImageElement,
      frames: {
        "1": loadedTextures.frame1.image as HTMLImageElement,
        "2": loadedTextures.frame2.image as HTMLImageElement,
      },
    };
  }, [loadedTextures]);
  return assets;
}
