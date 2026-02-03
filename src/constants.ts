// src/constants.ts

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
    readonly frame_1: string;
    readonly frame_2: string;
    readonly fallbackColor: string;
    readonly multiplyStrength: number;
    readonly bumpScale: number;
  };
  readonly api: {//GAS送信用の固定値 送信用URLと受付番号の接頭詞
    readonly gasUrl: string;
    readonly orderPrefix: string;
  };
  readonly fontSpacing: Record<string, number>; // キーが文字列、値が数値の辞書
  readonly adjustValue: number;
  
}

export const CONFIG: AppConfig = {
    // canvas用
    canvasSize: 512,

    plane:{
        planeWidth: 2.5,
        planeHeight: 6,
        get aspect() {return  this.planeWidth / this.planeHeight;},
        get offsetX() {return (1 - this.aspect) / 2;},//中央寄せのための計算
    },

    textures:{
        wood: 'texture/wood.png',
        frame_1:'texture/rect_1_2.png',
        frame_2:'texture/rect_2_2.png',
        fallbackColor: '#8B4513',
        multiplyStrength: 0.6,
        bumpScale: 1.5,
    },

    // フォントごとの文字間隔調整値
    fontSpacing: {
        'ta-fuga-fude': 0, 
        'kokuryu': -0.1,
        'ab-ootori': 0, 
        'ab-togetsukanteiryu': 0,
        'ta-engeifude': 0
    },

    api:{
      gasUrl:"https://script.google.com/macros/s/AKfycbzahmju75rRGe1Q2w0Njb2l7LyjWVF4G95zeOTyhGwUn4_ea2QG1z5pWOq6MQiY6Z1d9g/exec",
      orderPrefix:"WD-",
    },
    //文字高さ調整値
    adjustValue: 23,
} as const;