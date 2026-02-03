// src/SceneView.tsx

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Loader,
} from "@react-three/drei";
import {
  useRef,
  forwardRef,
  useImperativeHandle,
  Suspense,
} from "react";
import * as THREE from "three";
import { KifudaModel } from "./KifudaModel";

export interface SceneViewHandle {
  takeScreenshot: () => string | null;
}



export const SceneView = forwardRef<SceneViewHandle, {}>(({}, ref) => {
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  // 外部公開用のスクショ機能
  useImperativeHandle(ref, () => ({
    takeScreenshot: () => {
      // R3Fではgl.domElementから簡単に取得できます（後述）
      return glRef.current?.domElement.toDataURL("image/png") || null;
    },
  }));

  return (
    <div style={{ width: "100%", height: "100%", background: "#d0d0d0" }}>
      <Canvas
        flat
        gl={{ preserveDrawingBuffer: true }} // スクショに必要
        onCreated={({ gl }) => {
          glRef.current = gl;
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#d0d0d0"]} />
          {/* カメラ設定 */}
          <PerspectiveCamera makeDefault position={[0, 0, 11]} fov={45} />

          {/* 照明 */}
          <ambientLight intensity={1.5} color={0xffcc77} />
          <pointLight position={[2, 4, 5]} color={0xffddaa} intensity={50} />

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


