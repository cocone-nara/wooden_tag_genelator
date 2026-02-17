// src/constants.ts

const GAS_URL = import.meta.env.VITE_GAS_URL || "";

export interface AppConfig {
  readonly canvasSize: number;
  readonly plane: {
    readonly planeWidth: number;
    readonly planeHeight: number;
    readonly aspect: number;
    readonly offsetX: number;
  };
  readonly textures: {
    readonly wood: string;
    readonly fallbackColor: string;
    readonly multiplyStrength: number;
    readonly bumpScale: number;
    readonly frame: { readonly id: string; readonly name: string; readonly path: string }[];
  };
  readonly api: {
    //GAS送信用の固定値 送信用URLと受付番号の接頭詞
    readonly gasUrl: string;
    readonly orderPrefix: string;
  };
  readonly fonts: {readonly id: string, readonly name: string, readonly spacing: number}[];
  readonly adjustValue: number;
}

export const CONFIG: AppConfig = {
  // canvas用
  canvasSize: 512,

  plane: {
    planeWidth: 2.5,
    planeHeight: 6,
    get aspect() {
      return this.planeWidth / this.planeHeight;
    },
    get offsetX() {
      return (1 - this.aspect) / 2;
    }, //中央寄せのための計算
  },

  textures: {
    wood: "texture/wood.png",
    fallbackColor: "#8B4513",
    multiplyStrength: 0.6,
    bumpScale: 1.5,
    frame: [
      { id: "frame_1", name: "四角隅", path: "texture/rect_1_2.png" },
      { id: "frame_2", name: "角丸", path: "texture/rect_2_2.png" },
    ],
  },

  // フォントごとの設定値
  fonts: [
    {id:"ta-fuga-fude", name:"風雅筆", spacing: 0,},
    {id:"kokuryu", name:"黒龍爽", spacing: -0.1,},
    {id:"ab-ootori", name:"鳳", spacing: 0},
    {id:"ab-togetsukanteiryu", name:"渡月勘亭流", spacing: 0,},
    {id:"ta-engeifude", name:"演芸筆", spacing: 0,},
  ],

  api: {
    gasUrl: GAS_URL,
    orderPrefix: "WD-",
  },
  //文字高さ調整値
  adjustValue: 23,
};
