import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { glass } from "@/lib/glass";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className={`${glass.panelSm} p-4 transition-all hover:bg-white/[0.12] hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)]`}
        >
          <p className="font-medium text-white">{category.label}</p>
          <p className="mt-1 line-clamp-2 text-xs text-white/50">{category.description}</p>
        </Link>
      ))}
    </div>
  );
}
