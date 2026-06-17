import { GlassPanel } from "@/components/GlassPanel";
import { cn } from "@/lib/cn";

export function PageShell({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 pt-28 pb-16", className)}>
      <GlassPanel className="mb-10 px-6 py-8 sm:px-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
        {description && <p className="mt-2 text-white/60">{description}</p>}
      </GlassPanel>
      {children}
    </div>
  );
}
