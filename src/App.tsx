import { useState } from "react";
import { ControlPanel } from "./components/ControlPanel.tsx";
import { SceneView } from "./features/SceneView.tsx";
import { OrderModal } from "./components/OrderModal.tsx";
import { useTagStore } from "./store/useTagStore.ts";
import "./App.scss";

function App() {
  // パネルの開閉状態を管理
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const submitStep = useTagStore((state) => state.submitStep);
  const isModelReady = useTagStore((state) => state.isModelReady);

  return (
    <div className="app-container">
      <header id="app-header">
        <h1>木札見本ジェネレーター</h1>
      </header>

      <ControlPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />

      <div
        id="x3d-container"
        onClick={() => {
          if (isPanelOpen) {
            setIsPanelOpen(false);
          }
        }}
      >
        {!isModelReady && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="spinner"></div>
              <p>モデルを読み込み中...</p>
            </div>
          </div>
        )}
        <SceneView />
        <button
          id="mobile-toggle-btn"
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
