//LoadingView.tsx

import "./App.scss";

export const LoadingView = () => (
  <div className="loading-overlay">
    <div className="loading-content">
      <div className="spinner" />
      <p>木札を準備中...</p>
    </div>
  </div>
);