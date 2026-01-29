import { useRef, useState } from "react";
import { ControlPanel } from "./components/ControlPanel.tsx";
import { SceneView, type SceneViewHandle } from "./SceneView.tsx";
import { OrderModal } from "./components/OrderModal.tsx";
import { useOrderSubmit } from "./hooks/useOrderSubmit.ts";
import "./App.scss";

function App() {
  const {
    submitStep,
    screenshotUrl,
    orderId,
    prepareOrder,
    submitOrder,
    resetOrder,
  } = useOrderSubmit();

  // パネルの開閉状態を管理
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const sceneViewRef = useRef<SceneViewHandle>(null);

  return (
    <div className="app-container">
      <header id="app-header">
        <h1>木札見本ジェネレーター</h1>
      </header>

      <ControlPanel
        onSave={() => prepareOrder(sceneViewRef)}
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
        <SceneView 
          ref={sceneViewRef}
          />
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
          onConfirm={submitOrder}
          onClose={resetOrder}
        />
      )}
    </div>
  );
}
export default App;
