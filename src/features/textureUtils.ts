// textureUtils.ts
import { CONFIG } from "../constants";
import { type tagState } from "../store/useTagStore";

// このファイルtextureUtilsのすべての関数を実行する関数
export const updateAllCanvases = (
  inputs: tagState["Inputs"],
  contexts: {
    bump: CanvasRenderingContext2D;
    roughness: CanvasRenderingContext2D;
    albedo: CanvasRenderingContext2D;
  },
  assets: {
    wood?: HTMLImageElement;
    frames?: HTMLImageElement;
  },
) => {
  // 既存の描画ロジックを順次実行
  drawBumpCanvas(contexts.bump, inputs, assets.frames);
  drawRoughnessCanvas(contexts.roughness, contexts.bump.canvas);
  drawAlbedoCanvas(contexts.albedo, contexts.bump.canvas, assets.wood);
};

export const drawBumpCanvas = (
  ctx: CanvasRenderingContext2D,
  inputs: tagState["Inputs"],
  frameImage?: HTMLImageElement,
): void => {
  const { width, height } = ctx.canvas;

  //現在の描画を消去
  ctx.save();
  ctx.clearRect(0, 0, width, height);
  //背景色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
  //枠用テクスチャのdraw
  if (frameImage) {
    ctx.drawImage(frameImage, 0, 0, width, height);
  }

  drawText(ctx, inputs);

  // ぼかしでC面を作る
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "blur(0.7px)"; // ← ここがC面の幅
  ctx.drawImage(ctx.canvas, 0, 0);
  ctx.filter = "none";

  ctx.restore();
};

/** テキスト描画用の関数 */
export const drawText = (
  ctx: CanvasRenderingContext2D,
  inputs: tagState["Inputs"],
): void => {
  const { width, height } = ctx.canvas;
  const characters = inputs.text.split("");
  const fontSize = inputs.fontSize;

  const selectedfont = CONFIG.fonts.find((f) => f.id === inputs.fontFamily);
  const spacingRate = selectedfont?.spacing || 0;
  const spacing = spacingRate * fontSize;

  const count = characters.length;
  const totalHeight = count > 0 ? count * fontSize + (count - 1) * spacing : 0;
  // 中央揃え
  // xは中央 yは枠に合わせて下に移動
  const centerX = width / 2;
  const startY = height / 2 - totalHeight / 2 + CONFIG.adjustValue;

  // 文字描画
  let y = startY + fontSize / 2;
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = `${fontSize}px ${inputs.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  characters.forEach((char) => {
    ctx.fillText(char, centerX, y);
    y += fontSize + spacing; //
  });
  ctx.restore();
};

/** ラフネスマップ作成
 * バンプマップを白黒反転
 */
export const drawRoughnessCanvas = (
  ctx: CanvasRenderingContext2D,
  bumpCanvas: HTMLCanvasElement,
): void => {
  const { width, height } = ctx.canvas;

  //現在の描画を消去
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#DDDDDDDD";
  ctx.fillRect(0, 0, width, height);

  // 「差分（difference）」モードでバンプを描画する
  ctx.globalCompositeOperation = "difference";
  ctx.drawImage(bumpCanvas, 0, 0);

  // 描画モードを元に戻す
  ctx.globalCompositeOperation = "source-over";
};

//** アルベドマップ作成 ベースの木目テクスチャにバンプマップを乗算して凹みを暗くする*/
export const drawAlbedoCanvas = (
  ctx: CanvasRenderingContext2D,
  bumpCanvas: HTMLCanvasElement,
  woodImage?: HTMLImageElement,
): void => {
  const { width, height } = ctx.canvas;

  //現在の描画を消去
  ctx.clearRect(0, 0, width, height);

  // 木目テクスチャの描画,テクスチャがないときの代替色
  if (woodImage) {
    ctx.drawImage(woodImage, 0, 0, width, height);
  } else {
    ctx.fillStyle = CONFIG.textures.fallbackColor;
    ctx.fillRect(0, 0, width, height);
  }
  //バンプマップを一時保存
  ctx.save();
  // バンプによる暗化効果（乗算）を強さ付きで適用
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = CONFIG.textures.multiplyStrength;
  ctx.drawImage(bumpCanvas, 0, 0, width, height);
  ctx.restore();
};

/** テクスチャロード関数
 * 指定したテクスチャを指定した形式でロードし、できなかったらエラーを返す
 */
export const loadTexture = (path: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
    img.src = path;
  });
};
