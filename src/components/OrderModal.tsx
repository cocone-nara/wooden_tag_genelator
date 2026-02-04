// src/components/OrderModal.tsx
import { useTagStore } from "../store/useTagStore";

const LoadingStep = ({ message }: { message: string }) => (
  <div className="modal-step">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

const ConfirmStep = ({
  screenshot,
  onCancel,
  onConfirm,
}: {
  screenshot: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <div className="modal-step">
    <h2>注文内容の確認</h2>
    <p>この内容で制作データを送信します。よろしいですか？</p>
    {screenshot && (
      <img src={screenshot} alt="Preview" className="modal-preview" />
    )}
    <div className="modal-actions">
      <button className="btn-secondary" onClick={onCancel}>
        キャンセル
      </button>
      <button className="btn-primary" onClick={onConfirm}>
        送信する
      </button>
    </div>
  </div>
);

const SuccessStep = ({
  orderId,
  screenshot,
  onReset,
}: {
  orderId: string | null;
  screenshot: string | null;
  onReset: () => void;
}) => (
  <div className="modal-step">
    <h2 className="success-title">送信完了</h2>
    <div className="order-number-box">
      <span className="label">受付番号</span>
      <span className="number">{orderId}</span>
    </div>
    {screenshot && (
      <div className="download-area">
        <img
          src={screenshot}
          alt="Final Preview"
          className="modal-preview small"
        />
        <a
          href={screenshot}
          download={`Order_${orderId|| "kifuda"}.png`}
          className="btn-download"
        >
          画像を保存する
        </a>
      </div>
    )}
    <button className="btn-primary" onClick={onReset}>
      閉じる
    </button>
  </div>
);

const ErrorStep = ({onReset}:{onReset: () => void}) => (
  <div className="modal-step">
    <h2>エラーが発生しました</h2>
    <p>通信環境を確認して、もう一度お試しください。</p>
    <button className="btn-primary" onClick={onReset}>
      戻る
    </button>
  </div>
);

export const OrderModal = () => {
  const step = useTagStore((state) => state.submitStep);
  const screenshot = useTagStore((state) => state.screenshot.dataUrl);
  const orderId = useTagStore((state) => state.screenshot.orderId);

  const submitOrder = useTagStore((state) => state.submitOrder);
  const resetOrder = useTagStore((state) => state.resetOrder);

  if (step === "IDLE") return null;

  return (
    <div className="order-modal-overlay" onClick={resetOrder}>
      <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
        {(() => {
          switch (step) {
            case "PENDING_SCREENSHOT":
              return <LoadingStep message="プレビュー画像を生成中..." />;
            case "CONFIRM":
              return (
                <ConfirmStep
                  screenshot={screenshot}
                  onCancel={resetOrder}
                  onConfirm={submitOrder}
                />
              );
            case "SENDING":
              return <LoadingStep message="データを送信しています..." />;
            case "SUCCESS":
              return (
                <SuccessStep
                  orderId={orderId}
                  screenshot={screenshot}
                  onReset={resetOrder}
                />
              );
            case "ERROR":
              return <ErrorStep onReset={resetOrder} />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};
