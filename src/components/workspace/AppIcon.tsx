import type { App } from "@/lib/workspace";

/** Brand icon tile: soft orange with an orange glyph, so apps read as one product rather than a sticker sheet. */
export default function AppIcon({ app, size = 64 }: { app: App; size?: number }) {
  const Icon = app.icon;
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden bg-orange-soft text-orange"
      style={{ width: size, height: size, borderRadius: size * 0.28 }}
    >
      <Icon size={size * 0.44} strokeWidth={1.8} className="relative" />
    </span>
  );
}
