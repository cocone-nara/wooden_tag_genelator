// src/components/LoadingModal.tsx
interface Props {
  message: string; // 「読み込み中...」や「送信中...」など
}

export const LoadingModal = ({ message }: Props) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        {/* シンプルな回転アニメーション */}
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};