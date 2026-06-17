import { cn } from "@/lib/cn";
import { glass } from "@/lib/glass";

type GlassPanelProps = {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
};

export function GlassPanel({ children, className, size = "md" }: GlassPanelProps) {
  return (
    <div className={cn(size === "sm" ? glass.panelSm : glass.panel, className)}>
      {children}
    </div>
  );
}
