// 3dView.tsx
// 旧init3D
// 旧updateTexture
// 旧onUpdate
// 旧savecurrentdesign

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useEffect, useRef, useState } from "react";
import { CONFIG } from "./constants";
import type { Inputs } from "./types";
import {
  drawBumpCanvas,
  drawRoughnessCanvas,
  drawAlbedoCanvas,
  loadTexture,
} from "./utils/textureUtils";
import { useResizeObserver } from "./hooks/useResizeObserver";
import { useImperativeHandle, forwardRef } from "react";

declare const Typekit: any;

export interface SceneViewHandle {
  takeScreenshot: () => string | null;
}

interface SceneViewProps {
  inputs: Inputs;
}

export const SceneView = forwardRef<SceneViewHandle, SceneViewProps>(
  (props, ref) => {
    const { inputs } = props;
    const [isLoading, setIsLoading] = useState(false); // 内部で管理
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const planeMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const planeMeshRef = useRef<THREE.Mesh | null>(null);

    //サイズ変更用
    const size = useResizeObserver(containerRef as React.RefObject<HTMLElement>);

    //カメラ、レンダラ
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

    //テクスチャ定義
    const woodImageRef = useRef<HTMLImageElement | null>(null);
    const frameImagesRef = useRef<{ [key: string]: HTMLImageElement }>({});

    //CONFIGから
    const width = CONFIG.canvasSize;
    const height = CONFIG.canvasSize;
    const planeWidth = CONFIG.plane.planeWidth;
    const planeHeight = CONFIG.plane.planeHeight;

    // canvas用定義
    const bumpCanvasRef = useRef<HTMLCanvasElement>(
      document.createElement("canvas"),
    );
    const roughnessCanvasRef = useRef<HTMLCanvasElement>(
      document.createElement("canvas"),
    );
    const albedoCanvasRef = useRef<HTMLCanvasElement>(
      document.createElement("canvas"),
    );

    const bumpTextureRef = useRef<THREE.CanvasTexture | null>(null);
    const roughnessTextureRef = useRef<THREE.CanvasTexture | null>(null);
    const albedoTextureRef = useRef<THREE.CanvasTexture | null>(null);

    //初期化フラグ
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      if (!containerRef.current) return;

      setIsLoading(true);

      // --- 追加：前回の残骸があれば消す ---
      containerRef.current.innerHTML = "";
      let isAlive = true; // --- 追加：生存フラグ ---
      //テクスチャサイズ設定
      [bumpCanvasRef, roughnessCanvasRef, albedoCanvasRef].forEach((ref) => {
        ref.current.width = CONFIG.canvasSize;
        ref.current.height = CONFIG.canvasSize;
      });

      // --- three初期化 ---
      // シーン、カメラ、レンダラのセットアップ
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // テクスチャの生成と設定
      bumpTextureRef.current = new THREE.CanvasTexture(bumpCanvasRef.current);
      roughnessTextureRef.current = new THREE.CanvasTexture(
        roughnessCanvasRef.current,
      );
      albedoTextureRef.current = new THREE.CanvasTexture(
        albedoCanvasRef.current,
      );

      [
        bumpTextureRef.current,
        roughnessTextureRef.current,
        albedoTextureRef.current,
      ].forEach((tex) => {
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        // CONFIGの比率を適用
        tex.repeat.set(CONFIG.plane.aspect, 1);
        tex.offset.set(CONFIG.plane.offsetX, 0);
      });

      //カメラ、レンダラ
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
      });
      cameraRef.current = camera;
      rendererRef.current = renderer;
      renderer.setSize(width, height);
      renderer.setClearColor(0xd0d0d0);

      // planeジオメトリ、メッシュ作成
      const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: albedoTextureRef.current,
        bumpMap: bumpTextureRef.current,
        bumpScale: CONFIG.textures.bumpScale,
        roughnessMap: roughnessTextureRef.current,
        metalness: 0.1,
        roughness: 1.0,
        transparent: true, // 透明度を有効にする
        opacity: 0, // 最初は透明
      });
      planeMaterialRef.current = planeMaterial;

      //ジオメトリからメッシュを作成
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      planeMeshRef.current = plane;
      scene.add(plane);

      // --- 4. Reactが管理しているdivの中に、3Dの画面を合体させる ---
      containerRef.current.appendChild(renderer.domElement);

      //カメラ位置
      camera.position.set(0, 0, 10);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      //ライティング
      const ambientLight = new THREE.AmbientLight(0xffcc77, 1.5);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffddaa, 50);
      pointLight.position.set(2, 4, 5);
      scene.add(pointLight);

      // --- 5. 描画ループ ---
      const animate = () => {
        if (!isAlive) return;
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // テクスチャロード 木目 枠1,2
      const loadAssets = async () => {
        const [wood, frameA, frameB] = await Promise.all([
          loadTexture(CONFIG.textures.wood),
          loadTexture(CONFIG.textures.frame_1),
          loadTexture(CONFIG.textures.frame_2),
        ]);

        woodImageRef.current = wood;
        frameImagesRef.current = {
          1: frameA,
          2: frameB,
        };
        //ロード完了フラグ
        setIsReady(true);
      };
      loadAssets();

      // お片付け（部品が消えるときにキャンバスも消す）
      return () => {
        isAlive = false;
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      };
    }, []);

    //テクスチャ更新関数
    useEffect(() => {
      if (!isReady) return;

      const updateTextures = async () => {

        setIsLoading(true);

        // 1. 各キャンバスの「ペン(ctx)」を取得
        const bumpCtx = bumpCanvasRef.current.getContext("2d");
        const roughnessCtx = roughnessCanvasRef.current.getContext("2d");
        const albedoCtx = albedoCanvasRef.current.getContext("2d");

        if (!bumpCtx || !roughnessCtx || !albedoCtx) return;

        // 2. フォントの準備ができるまで待つ（旧.jsの Typekit.load に相当）
        // 縦書き描画を正確にするために必要です
        if (typeof Typekit !== "undefined") {
          try {
            await new Promise((resolve) => Typekit.load({ active: resolve }));
          } catch (e) {
            console.warn("Typekit load timeout or error");
          }
        }

        // 3. 職人（textureUtils）を呼んで描画
        // inputs.frameType に合わせて画像を渡す
        const selectedFrame = frameImagesRef.current[inputs.frameType];

        drawBumpCanvas(bumpCtx, inputs, selectedFrame);
        drawRoughnessCanvas(roughnessCtx, bumpCanvasRef.current);
        drawAlbedoCanvas(
          albedoCtx,
          bumpCanvasRef.current,
          woodImageRef.current || undefined,
        );

        // 4. Three.jsに更新を通知
        if (bumpTextureRef.current) bumpTextureRef.current.needsUpdate = true;
        if (roughnessTextureRef.current)
          roughnessTextureRef.current.needsUpdate = true;
        if (albedoTextureRef.current)
          albedoTextureRef.current.needsUpdate = true;

        setIsLoading(false);
      };

      // テクスチャ更新 実行
      updateTextures();

      //モデルが表示されていなかったら表示する
      if (planeMaterialRef.current && planeMaterialRef.current.opacity === 0) {
        planeMaterialRef.current.opacity = 1;
      }
    }, [inputs, isReady]);

    //サイズに応じて画面サイズを変更
    useEffect(() => {
      const renderer = rendererRef.current;
      const camera = cameraRef.current;

      // サイズが確定し、レンダラーたちが準備できていれば実行
      if (renderer && camera && size.width > 0 && size.height > 0) {
        renderer.setSize(size.width, size.height);
        // 解像度（Retina対応）も考慮するなら
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
      }
    }, [size]);

    // スクショ用関数 app.tsxに送る用
    useImperativeHandle(ref, () => ({
      takeScreenshot: () => {
        const scene = sceneRef.current;
        if (!scene) return null;

        // 1. スクショ専用のオフスクリーン・レンダラーを作成
        const tempRenderer = new THREE.WebGLRenderer({
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: false, // 背景を透過させたい場合はtrue
        });
        tempRenderer.setSize(512, 512);
        tempRenderer.setClearColor(0xd0d0d0);
        tempRenderer.setPixelRatio(1); // 512px固定にするため1を指定

        // 2. スクショ専用の固定カメラを作成
        const tempCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
        // 旧main.jsの initialCamera.position (0, 0, 8) に合わせる
        tempCamera.position.set(0, 0, 11);
        tempCamera.lookAt(0, 0, 0);
        tempCamera.updateProjectionMatrix();

        // 3. 一時的なレンダラーで1回だけ描画
        tempRenderer.render(scene, tempCamera);

        // 4. DataURLを取得
        const dataURL = tempRenderer.domElement.toDataURL("image/png");

        // 5. メモリ解放（重要！）
        tempRenderer.dispose();

        return dataURL;
      },
    }));

return (
  <div ref={containerRef} id="x3d-container" style={{ 
      width: '100%', 
      height: '100%', 
      display: 'block', 
      position: 'relative',
      overflow: 'hidden' 
    }}>
    {isLoading && (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    )}
  </div>
);
  },
);
