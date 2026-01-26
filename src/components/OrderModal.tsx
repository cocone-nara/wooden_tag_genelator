// src/components/OrderModal.tsx
import { type SubmitStep } from '../types';

type Props = {
  step: SubmitStep;
  screenshot: string | null;
  orderId: string;
  onConfirm: () => void;
  onClose: () => void;
};

export const OrderModal = ({ step, screenshot, orderId, onConfirm, onClose }: Props) => {
  if (step === 'IDLE') return null;

  // 各ステップのUI定義をまとめる
  const StepContent = {
    CONFIRM: (
      <div className="modal-step">
        <h2>注文内容の確認</h2>
        <p>この内容で制作データを送信します。よろしいですか？</p>
        <p>※画像はイメージです。実際の制作物とは異なります。</p>
        {screenshot && <img src={screenshot} alt="Preview" className="modal-preview" />}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn-primary" onClick={onConfirm}>送信する</button>
        </div>
      </div>
    ),
    SENDING: (
      <div className="modal-step">
        <div className="spinner"></div>
        <p>データを送信しています...</p>
      </div>
    ),
    SUCCESS: (
      <div className="modal-step">
        <h2 className="success-title">送信完了</h2>
        <div className="order-number-box">
          <span className="label">受付番号</span>
          <span className="number">{orderId}</span>
        </div>
        {screenshot && (
          <div className="download-area">
            <img src={screenshot} alt="Final Preview" className="modal-preview small" />
            <a href={screenshot} download={`Order_${orderId}.png`} className="btn-download">画像を保存する</a>
          </div>
        )}
        <button className="btn-primary" onClick={onClose}>閉じる</button>
      </div>
    ),
    ERROR: (
      <div className="modal-step">
        <h2>エラーが発生しました</h2>
        <p>通信環境を確認して、もう一度お試しください。</p>
        <button className="btn-primary" onClick={onClose}>戻る</button>
      </div>
    )
  };

  return (
    <div className="order-modal-overlay">
      {/* クリックイベントの伝播を防ぎつつ、現在のステップに応じた内容を表示 */}
      <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* step が IDLE 以外なら、該当する UI を表示。なければ ERROR を出すなどの安全策 */}
        {StepContent[step as keyof typeof StepContent] || StepContent.ERROR}
      </div>
    </div>
  );
};