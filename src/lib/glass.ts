/** Shared Liquid Glass surface classes — not just blur on a flat card */
export const glass = {
  panel:
    "rounded-3xl border border-white/[0.15] bg-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-3xl",
  panelSm:
    "rounded-2xl border border-white/[0.15] bg-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-2xl",
  nav:
    "rounded-full border border-white/20 bg-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-3xl",
  button:
    "rounded-full border border-white/20 bg-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl transition-all hover:bg-white/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)]",
  input:
    "rounded-full border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl",
  chip:
    "rounded-full border border-white/15 bg-white/10 backdrop-blur-xl transition-all hover:bg-white/20",
  tag: "rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs backdrop-blur-xl transition-colors hover:bg-white/20",
} as const;
