import Link from "next/link";

export function SectionHeading({
  title,
  href,
  linkLabel = "View all",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm text-white/50 transition-colors hover:text-white"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
