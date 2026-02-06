// src/hooks/orderUtils.ts
import { CONFIG } from "../constants";

//ランダムナンバー生成
export const generateOrderNumber = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = Array.from(
    { length: 5 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `${CONFIG.api.orderPrefix}${random}`;
};