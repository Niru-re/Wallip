"use client";

import { useEffect } from "react";

export function Clarity() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CLARITY_ID) {
      (window as any).clarity =
        (window as any).clarity ||
        function () {
          ((window as any).clarity.q = (window as any).clarity.q || []).push(arguments);
        };
      const script = document.createElement("script");
      script.src = `https://www.clarity.ms/tag/${process.env.NEXT_PUBLIC_CLARITY_ID}`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
