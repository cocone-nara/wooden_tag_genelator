// src/type.ts

export interface Inputs{
    fontSize: number;
    fontFamily: string; 
    text: string;
    frameType: string;
};

//送信状態の型
export type SubmitStep = 'IDLE' | 'CONFIRM' | 'SENDING' | 'SUCCESS' | 'ERROR';

//送信データ型
export interface OrderPayload {
    orderId: string;
    inputs: Inputs;
    image: string | null;
    timestamp: string;
}