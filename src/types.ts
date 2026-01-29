// src/type.ts
import { type tagState } from "./store/useTagStore";

//送信状態の型
export type SubmitStep = 'IDLE' | 'CONFIRM' | 'SENDING' | 'SUCCESS' | 'ERROR';

//送信データ型
export interface OrderPayload {
    orderId: string;
    inputs: tagState["Inputs"];
    image: string | null;
    timestamp: string;
}