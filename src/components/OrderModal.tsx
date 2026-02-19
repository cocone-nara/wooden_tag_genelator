// src/components/OrderModal.tsx
import { useTagStore } from "../store/useTagStore";

const LoadingStep = ({ message }: { message: string }) => (
  <div className="modal-step">
    <div className="spinner  border-accent border-t-white"></div>
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
    <h2　className="font-bold">注文内容の確認</h2>
    <p>この内容で制作データを送信します。よろしいですか？</p>
    {screenshot && (
      <img src={screenshot} alt="Preview" className="modal-preview" />
    )}
    <button className="action-button max-w-[50%]" onClick={onConfirm}>
      送信する
    </button>
    <button className="action-button max-w-[50%]" onClick={onCancel}>
      キャンセル
    </button>
  </div>
);

const SuccessStep = ({
  orderId,
  screenshot,
  onReset,
}: {
  orderId: string;
  screenshot: string | null;
  onReset: () => void;
}) => (
  <div className="modal-step">
    <h2 className="success-title font-bold">送信完了</h2>
    <p className="">受付番号をスタッフにお伝え下さい。</p>
    <div className="order-number-box">
      <span className="label">受付番号：</span>
      <span className="number">{orderId}</span>
    </div>
    {screenshot && (
      <>
        <img src={screenshot} alt="Final Preview" className="w-[90%]" />
        <a
          href={screenshot}
          download={`Order_${orderId || "kifuda"}.png`}
          className="action-button max-w-[50%]"
        >
          画像のみ保存
        </a>
      </>
    )}
    <button className="action-button max-w-[50%]" onClick={onReset}>
      閉じる
    </button>
  </div>
);

const ErrorStep = ({ onReset }: { onReset: () => void }) => (
  <div className="modal-step">
    <h2>エラーが発生しました</h2>
    <p>通信環境を確認して、もう一度お試しください。</p>
    <button className="action-button" onClick={onReset}>
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
  const isClosable = step !== "SENDING" && step !== "PENDING_SCREENSHOT";

  return (
    <div
      className="modal-overlay"
      onClick={isClosable ? resetOrder : undefined}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
