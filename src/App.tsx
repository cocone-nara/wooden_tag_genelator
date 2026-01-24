import { useRef, useState } from "react";
//import { CONFIG } from "./constants.ts";
import type { Inputs } from "./types";
import { ControlPanel } from "./components/ControlPanel.tsx";
import { SceneView, type SceneViewHandle } from "./SceneView.tsx";
import { LoadingModal } from "./components/LoadingModal";
import "./App.scss";

//ランダムナンバー生成
const generateOrderNumber = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = Array.from(
    { length: 5 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `WD-${random}`;
};

function App() {
  const [inputs, setInputs] = useState<Inputs>({
    fontSize: 120,
    fontFamily: "ta-fuga-fude",
    text: "見本",
    frameType: "1",
  });
  // パネルの開閉状態を管理
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const sceneViewRef = useRef<SceneViewHandle>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  // 入力遅延
  const [debouncedInputs, setDebouncedInputs] = useState<Inputs>(inputs); // 3D反映用
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleUpdate = (newInputs: Inputs) => {
    // 1. まずは入力中の文字を即座に反映（ControlPanel用）
    setInputs(newInputs);
    // 2. 既存のタイマーがあればキャンセル
    if (timerRef.current) clearTimeout(timerRef.current);
    // 3. 0.5秒後に 3D側のStateだけを更新する
    timerRef.current = setTimeout(() => {
      setDebouncedInputs(newInputs);
    }, 500);
  };

  //制作用データ送信
  const handleSave = async () => {
    setLoadingMessage("データを送信しています...");
    if (!sceneViewRef.current) return;
    // 窓口を通じて、SceneViewの中にある takeScreenshot を実行
    const dataURL = sceneViewRef.current?.takeScreenshot();
    if (!dataURL) return;

    //送信データ整理
    const orderId = generateOrderNumber();
    const payload = {
      orderId: orderId,
      inputs: inputs, // Appが管理している最新の入力値
      image: dataURL, // 取得した画像
      timestamp: new Date().toLocaleString("ja-JP"),
    };

    try {
      // GASのURL（ここにコピーしたURLを貼り付け）
      const GAS_URL = import.meta.env.VITE_GAS_URL;
      const response = await fetch(GAS_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setLoadingMessage(null); 
        alert(
          `送信成功！\n受付番号: ${orderId}\nスプレッドシートを確認してください。`,
        );
      } else {
        throw new Error("送信に失敗しました");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("エラーが発生しました。");
    } finally {
      setLoadingMessage(null); // 終わったら消す（成功でも失敗でも）
    }

    /* if (dataURL) {
      // 古い main.js にあったダウンロードロジック
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `wood_sign_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }*/
  };

  return (
    <div className="app-container">
      <header id="app-header">
        <h1>木札見本ジェネレーター</h1>
      </header>

      {loadingMessage && <LoadingModal message={loadingMessage} />}

      <ControlPanel
        inputs={inputs}
        onUpdate={handleUpdate}
        onSave={handleSave}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />

      <div id="x3d-container">
        <SceneView
          ref={sceneViewRef}
          inputs={debouncedInputs}
          onLoading={(msg) => setLoadingMessage(msg)} />
        {/* モバイル用ボタンなどは必要に応じて後で追加 */}
        <button
          id="mobile-toggle-btn"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          +
        </button>
      </div>
    </div>
  );
}
export default App;
