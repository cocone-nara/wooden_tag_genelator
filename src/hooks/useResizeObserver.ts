// src/hooks/useResizeObserver.ts
import { useState, useEffect, type RefObject } from 'react';

export const useResizeObserver = (elementRef: RefObject<HTMLElement>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // サイズ変化を検知するオブザーバーを作成
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(el);

    return () => observer.disconnect(); // お片付け
  }, [elementRef]);

  return size;
};