// src/components/ControlPanel.tsx
import type { Inputs } from '..//types';


interface Props {
  inputs: Inputs;                      // 今の文字
  onUpdate: (newInputs: Inputs) => void; // 文字が変わった時に呼ぶ関数
  onSave: () => void;//親からの関数
  isOpen: boolean;
  onClose: () => void;
}

export const ControlPanel = ({inputs, onUpdate, onSave,isOpen, onClose}: Props) =>{
    // 共通の変更ハンドラー：特定のキーだけ書き換えて親に渡す
  const handleChange = (key: keyof Inputs, value: string | number) => {
    onUpdate({
      ...inputs,
      [key]: value
    });
  };

    return(
        <div id="control-panel" className={isOpen ? 'open' : ''}>

            <div className="control-group">
                <p>表示したい文字を入力してください:</p>
                <textarea 
                    value={inputs.text}
                    onChange={(e) => handleChange('text', e.target.value)}
                    placeholder="例: 木彫り看板"
                />
            </div>

            <div className="control-group">
                <p>フォントを選択:</p>
                <select 
                  value={inputs.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
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
              <p>文字サイズ (px): <span>{inputs.fontSize}</span></p>
              <input 
                type="range" 
                min="50" max="150" step="10" 
                value={inputs.fontSize}
                onChange={(e) => handleChange('fontSize', Number(e.target.value))}
              />
            </div>

            {/* 4. 背景テクスチャ（ラジオボタン） */}
            <div className="control-group">
              <p>背景テクスチャを選択:</p>
              <label>
                <input 
                  type="radio" 
                  name="bg-texture" 
                  checked={inputs.frameType === '1'}
                  onChange={() => handleChange('frameType', '1')}
                /> 四角隅
              </label><br />
              <label>
                <input 
                  type="radio" 
                  name="bg-texture" 
                  checked={inputs.frameType === '2'}
                  onChange={() => handleChange('frameType', '2')}
                /> 角丸
              </label>
            </div>

            <div className="control-group">
        <button className="action-button" onClick={onClose}>更新</button>
        <button className="action-button secondary" onClick={onSave}>
          デザインを保存（プレビュー＋制作）
        </button>
        </div>

        </div>
    );
}