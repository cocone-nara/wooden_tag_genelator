// src/components/LoadingOverlay.tsx
// ロード画面 まだ組み込んでない
import { useState, useEffect } from "react";
import { useTagStore } from "../store/useTagStore";

export const LoadingOverlay = () => {
  // Zustandから必要なフラグだけを拾う
  const isModelReady = useTagStore((state) => state.isModelReady);
  const isUpdating = useTagStore((state) => state.isUpdating);

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // 「モデルが未準備」または「テクスチャ更新中」がロード状態
    const isLoading = !isModelReady || isUpdating;

    let timer: number;

    if (isLoading) {
      // ロード状態になったら500msのカウントダウン開始
      timer = window.setTimeout(() => {
        setShouldRender(true);
      }, 100);
    } else {
      // ロードが終わったら（両方完了したら）即座に消す
      setShouldRender(false);
    }

    return () => clearTimeout(timer);
  }, [isModelReady, isUpdating]);

  // 500ms経っていない、またはロード中でなければ何も出さない
  if (!shouldRender) return null;

  return (
    <div className="modal-overlay absolute text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner"></div>
        <p>読み込み中...</p>
      </div>
    </div>
  );
};
