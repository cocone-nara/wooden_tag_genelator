import { useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { CONFIG } from "./constants.ts";
import type { Inputs, SubmitStep, OrderPayload } from "./types";
import { ControlPanel } from "./components/ControlPanel.tsx";
import { SceneView, type SceneViewHandle } from "./SceneView.tsx";
import { OrderModal } from "./components/OrderModal.tsx";
import "./App.scss";

//ランダムナンバー生成
const generateOrderNumber = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = Array.from(
    { length: 5 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `${CONFIG.api.orderPrefix}${random}`;
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

  //送信状態の管理
  const [submitStep, setSubmitStep] = useState<SubmitStep>("IDLE");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>(""); // 受付番号を保持

  // 入力遅延
  const [debouncedInputs] = useDebounce(inputs, 300); // 3D反映用
  const handleUpdate = (newInputs: Inputs) => setInputs(newInputs);

  //制作用データ送信
  const handleOpenConfirm = () => {
    if (!sceneViewRef.current) return;

    //スクショ撮影
    const dataURL = sceneViewRef.current?.takeScreenshot();
    if (!dataURL) {
      alert("画像の生成に失敗しました");
      return;
    }

    //受付番号発行
    const newId = generateOrderNumber();

    setScreenshotUrl(dataURL);
    setOrderId(newId);
    setSubmitStep("CONFIRM"); // 確認モーダルを表示
  };

  const handleFinalSubmit = async () => {
    if (submitStep === "SENDING") return; // 連投防止
    setSubmitStep("SENDING");
    if (!screenshotUrl) return; // 画像がない場合は中断

    const payload: OrderPayload = {
      orderId: orderId,
      inputs: inputs, // Appが管理している最新の入力値
      image: screenshotUrl, // 取得した画像
      timestamp: new Date().toLocaleString("ja-JP"),
    };

    try {
      // GASのURL（ここにコピーしたURLを貼り付け）
      const response = await fetch(CONFIG.api.gasUrl, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStep("SUCCESS"); // 送信成功画面へ
      } else {
        throw new Error("送信に失敗しました");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitStep("ERROR");
      alert("エラーが発生しました。");
    }
  };

  return (
    <div className="app-container">
      <header id="app-header">
        <h1>木札見本ジェネレーター</h1>
      </header>

      <ControlPanel
        inputs={inputs}
        onUpdate={handleUpdate}
        onSave={handleOpenConfirm}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />

      <div
        id="x3d-container"
        onClick={() => {
          // パネルが開いている場合のみ、閉じる
          if (isPanelOpen) {
            setIsPanelOpen(false);
          }
        }}
      >
        <SceneView ref={sceneViewRef} inputs={debouncedInputs} />
        {/* モバイル用ボタンなどは必要に応じて後で追加 */}
        <button
          id="mobile-toggle-btn"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          +
        </button>
      </div>

      {submitStep !== "IDLE" && (
        <OrderModal
          step={submitStep}
          screenshot={screenshotUrl}
          orderId={orderId}
          onConfirm={handleFinalSubmit}
          onClose={() => setSubmitStep("IDLE")}
        />
      )}
    </div>
  );
}
export default App;
