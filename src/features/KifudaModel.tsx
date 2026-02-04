import { memo } from "react";
import { CONFIG } from "../constants";
import { useInitTexture } from "./useInitTexture";
import { useTextureAssets } from "./useTextureAssets";
import { useTextureUpdate } from "./useTextureUpdate";

// 3Dモデル
export const KifudaModel = memo(() => {
  // ベーステクスチャ定義、ロード
  const assets = useTextureAssets();
  // Canvasを保持（useMemoで一度だけ生成）
  const { textures, canvasesCtx } = useInitTexture();
  // テクスチャ動的更新処理
  const isReady = useTextureUpdate(canvasesCtx, assets, textures);

  //ロード完了まで非表示
  if (!isReady) return null;

  return (
    <mesh>
      <planeGeometry
        args={[CONFIG.plane.planeWidth, CONFIG.plane.planeHeight]}
      />
      <meshStandardMaterial
        map={textures.albedo}
        bumpMap={textures.bump}
        bumpScale={CONFIG.textures.bumpScale}
        roughnessMap={textures.roughness}
        metalness={0.1}
        roughness={1.0}
      />
    </mesh>
  );
});
