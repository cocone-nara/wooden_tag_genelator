// src/SceneView.tsx

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Loader } from "@react-three/drei";
import { Suspense, useEffect, memo } from "react";
import { useTagStore } from "../store/useTagStore";
import * as THREE from "three";
import { KifudaModel } from "./KifudaModel";

// 外部公開用のスクショ機能
const ScreenshotHandler = () => {
  const { gl, scene } = useThree(); // R3Fの内部インスタンスを取得
  const request = useTagStore((state) => state.screenshot);
  const submitStep = useTagStore((state) => state.submitStep);

  useEffect(() => {
    if (submitStep !== "PENDING_SCREENSHOT" || request.requestCount === 0)
      return;

    const originalSize = new THREE.Vector2();
    gl.getSize(originalSize);
    const originalPixelRatio = gl.getPixelRatio();

    gl.setPixelRatio(1);
    gl.setSize(512, 512, false);
    gl.setClearColor(0x000000, 0);
    const tempCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    tempCamera.position.set(0, 0, 11); // 正面固定位置
    tempCamera.lookAt(0, 0, 0);

    //撮影
    gl.render(scene, tempCamera);

    const dataUrl = gl.domElement.toDataURL("image/png");

    useTagStore.getState().setScreenshotData(dataUrl);

    gl.setPixelRatio(originalPixelRatio);
    gl.setSize(originalSize.x, originalSize.y, false);
  }, [request.requestCount, gl, scene]);

  return null;
};

export const SceneView = memo(() => {
  return (
    <div style={{ width: "100%", height: "100%", background: "#d0d0d0" }}>
      <Canvas
        flat
        gl={{ preserveDrawingBuffer: true }} // スクショに必要
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#d0d0d0"]} />
          {/* カメラ設定 */}
          <PerspectiveCamera makeDefault position={[0, 0, 11]} fov={45} />

          {/* 照明 */}
          <ambientLight intensity={1.5} color={0xffcc77} />
          <pointLight position={[2, 4, 5]} color={0xffddaa} intensity={50} />

          {/*スクショハンドラ*/}
          <ScreenshotHandler />

          {/* 実際のモデル */}
          <KifudaModel />

          {/* カメラ操作 */}
          <OrbitControls makeDefault enableDamping />
        </Suspense>
      </Canvas>

      <Loader />
    </div>
  );
});
