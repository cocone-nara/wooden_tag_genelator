import { useState } from "react";
import { ControlPanel } from "./components/ControlPanel.tsx";
import { SceneView } from "./features/SceneView.tsx";
import { OrderModal } from "./components/OrderModal.tsx";
import { useTagStore } from "./store/useTagStore.ts";
import "./App.css";

function App() {
  // パネルの開閉状態を管理
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const submitStep = useTagStore((state) => state.submitStep);
  const isModelReady = useTagStore((state) => state.isModelReady);

  return (
    <div className="app-container">
      <header className="app-header items-baseline-last pb-2">
        <h1 className="font-extrabold text-xl max-md:text-[5vw]">
          木札ジェネレーター
        </h1>
        <p className="ml-auto text-xs max-md:text-[2vw]">presented by ness彫刻工房</p>
      </header>

      <ControlPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />

      <div
        className="x3d-container"
        id="x3d-container"
        onClick={() => {
          if (isPanelOpen) {
            setIsPanelOpen(false);
          }
        }}
      >
        {!isModelReady && (
          <div className="modal-overlay absolute text-white">
            <div className="flex flex-col items-center gap-4">
              <div className="spinner"></div>
              <p>モデルを読み込み中...</p>
            </div>
          </div>
        )}
        <SceneView />
        <button
          id="mobile-toggle-btn"
          className="z-[--z-action-btn]"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          +
        </button>
      </div>

      {submitStep !== "IDLE" && <OrderModal />}
    </div>
  );
}
export default App;
