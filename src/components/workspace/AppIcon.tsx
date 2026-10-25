import clsx from "clsx";
import type { App } from "@/lib/workspace";

export default function AppIcon({ app, size = 64 }: { app: App; size?: number }) {
  const Icon = app.icon;
  return (
    <span
      className={clsx("flex shrink-0 items-center justify-center text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.45)]")}
      style={{ width: size, height: size, borderRadius: size * 0.3, background: `linear-gradient(145deg, ${app.tint[0]}, ${app.tint[1]})` }}
    >
      <Icon size={size * 0.46} strokeWidth={1.9} />
    </span>
  );
}
