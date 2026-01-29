// src/components/ControlPanel.tsx
import { useState } from "react";
import { CreditModal } from "./CreditModal";
import { useTagStore } from "../store/useTagStore";

interface Props {
  onSave: () => void; //親からの関数
  isOpen: boolean;
  onClose: () => void;
}

export const ControlPanel = ({
  onSave,
  isOpen,
  onClose,
}: Props) => {

//storeから状態を呼ぶ
//const inputs = useTagStore((state)=>state.Inputs);
const fontSize = useTagStore((state) => state.Inputs.fontSize);
const fontFamily = useTagStore((state) => state.Inputs.fontFamily);
const text = useTagStore((state) => state.Inputs.text);
const frameType = useTagStore((state) => state.Inputs.frameType);
const updateInputs = useTagStore((state)=> state.updateInputs);

  const [isCreditOpen, setIsCreditOpen] = useState(false);

  return (
    <div id="control-panel" className={isOpen ? "open" : ""}>
      <div className="control-group">
        <p>表示したい文字を入力してください:</p>
        <textarea
          value={text}
          onChange={(e) => updateInputs({text: e.target.value})}
          placeholder="例: 木彫り看板"
        />
      </div>

      <div className="control-group">
        <p>フォントを選択:</p>
        <select
          value={fontFamily}
          onChange={(e) => updateInputs({fontFamily: e.target.value})}
        >
          <option value="sans-serif">デフォルト</option>
          <option value="ta-fuga-fude">風雅筆</option>
          <option value="kokuryu">黒龍爽</option>
          <option value="ab-ootori">鳳</option>
          <option value="ab-togetsukanteiryu">渡月勘亭流</option>
          <option value="ta-engeifude">演芸筆</option>
        </select>
      </div>

      {/* 3. 文字サイズ */}
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
          onChange={(e) => updateInputs({fontSize: Number(e.target.value)})}
        />
      </div>

      {/* 4. 背景テクスチャ（ラジオボタン） */}
      <div className="control-group">
        <p>背景テクスチャを選択:</p>
        <label>
          <input
            type="radio"
            name="bg-texture"
            checked={frameType === "1"}
            onChange={() => updateInputs({frameType: "1"})}
          />{" "}
          四角隅
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="bg-texture"
            checked={frameType === "2"}
            onChange={() => updateInputs({frameType: "2"})}
          />{" "}
          角丸
        </label>
      </div>

      <div className="control-group">
        <button className="action-button" onClick={onClose}>
          画像更新
        </button>
      </div>
      <div className="control-group">
        <button className="action-button secondary" onClick={onSave}>
          データ送信
        </button>
      </div>
      {/* クレジットを開くためのボタン（ロゴ画像付き） */}
    <button className="credit-trigger-button" onClick={() => setIsCreditOpen(true)}>
      {/*<img src="texture/ness_logo.png" alt="Company Logo" />*/}
      <span>連絡先</span>
    </button>

    {/* モーダル本体（ここにあっても fixed なので画面全体に広がる） */}
    <CreditModal 
      isOpen={isCreditOpen} 
      onClose={() => setIsCreditOpen(false)} 
    />
    </div>
  );
};
