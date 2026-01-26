// src/components/CreditModal.tsx
import React from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreditModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // 閉じている時は何も出さない

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src="/texture/ness_logo.png" alt="Company Logo" className="modal-logo" />
        <h2>ness彫刻工房</h2>
        <p>よさこいチームを中心に、木札を制作しています✨️</p>
        
        <div className="modal-links">
          <a href="https://linktr.ee/ness_engraving" target="_blank">linktr.ee</a>
          <a href="https://x.com/ness_oneness" target="_blank">公式X</a>
        </div>
        
        <button onClick={onClose} className="close-button">閉じる</button>
      </div>
    </div>
  );
};