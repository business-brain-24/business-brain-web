import type { App } from "@/lib/workspace";

/** Brand icon tile: ink with an orange glyph, so apps read as one product rather than a sticker sheet. */
export default function AppIcon({ app, size = 64 }: { app: App; size?: number }) {
  const Icon = app.icon;
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden bg-[linear-gradient(150deg,#22262F,#0B0D12)] text-orange shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
      style={{ width: size, height: size, borderRadius: size * 0.28 }}
    >
      <span className="absolute -right-1/4 -top-1/4 h-3/4 w-3/4 rounded-full bg-orange/25 blur-md" />
      <Icon size={size * 0.44} strokeWidth={1.8} className="relative" />
    </span>
  );
}
