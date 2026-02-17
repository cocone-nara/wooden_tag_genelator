// src/components/ControlPanel.tsx
import { useState } from "react";
import { CreditModal } from "./CreditModal";
import { useTagStore } from "../store/useTagStore";
import { CONFIG } from "../constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlPanel = ({ isOpen, onClose }: Props) => {
  //storeから状態を呼ぶ
  //const inputs = useTagStore((state)=>state.Inputs);
  const fontSize = useTagStore((state) => state.Inputs.fontSize);
  const fontFamily = useTagStore((state) => state.Inputs.fontFamily);
  const text = useTagStore((state) => state.Inputs.text);
  const frameType = useTagStore((state) => state.Inputs.frameType);
  const updateInputs = useTagStore((state) => state.updateInputs);
  const prepareOrder = useTagStore((state) => state.PrepareOrder);
  const submitStep = useTagStore((state) => state.submitStep);

  const [isCreditOpen, setIsCreditOpen] = useState(false);

  return (
    <div className={`control-panel  ${isOpen ? "open" : ""}`}>
      <fieldset
        disabled={submitStep !== "IDLE"}
        style={{ display: "contents" }}
      >
        <div className="control-group">
          <p>表示したい文字を入力してください:</p>
          <textarea
            value={text}
            onChange={(e) => updateInputs({ text: e.target.value })}
            placeholder="例: 木彫り看板"
          />
        </div>

        <div className="control-group">
          <p>フォントを選択:</p>
          <select
            value={fontFamily}
            onChange={(e) => updateInputs({ fontFamily: e.target.value })}
          >
            {/* CONFIG.fontsにあるフォントをすべて並べる */}
            {CONFIG.fonts.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <p>
            文字サイズ (px): <span>{fontSize}</span>
          </p>
          <input
            type="range"
            min="50"
            max="150"
            step="10"
            value={fontSize}
            onChange={(e) => updateInputs({ fontSize: Number(e.target.value) })}
          />
        </div>

        <div className="control-group">
          <p>フレームを選択:</p>
          <select
            value={frameType} // ここが "frame_1" などのIDを保持するようになる
            onChange={(e) => updateInputs({ frameType: e.target.value })}
          >
            {CONFIG.textures.frame.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <button className="action-button md:hidden" onClick={onClose}>
            画像更新
          </button>
        </div>
        <div className="flex md:flex-col max-md:flex-row gap-4">

            <button className="action-button" onClick={prepareOrder}>
              データ送信
            </button>

            <button
              className="action-button"
              onClick={() => setIsCreditOpen(true)}
            >
              {/*<img src="texture/ness_logo.png" alt="Company Logo" />*/}
              <span>連絡先</span>
            </button>

        </div>
      </fieldset>

      <CreditModal
        isOpen={isCreditOpen}
        onClose={() => setIsCreditOpen(false)}
      />
    </div>
  );
};
