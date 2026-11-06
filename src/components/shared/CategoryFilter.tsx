"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const CATEGORIES = ["all", "donation", "cleanup", "workshop", "food", "plantation"] as const;
type Category = (typeof CATEGORIES)[number];

const LABELS: Record<Category, string> = {
  all: "All",
  donation: "Donation",
  cleanup: "Cleanup",
  workshop: "Workshop",
  food: "Food Drive",
  plantation: "Plantation",
};

export default function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = (searchParams.get("category") || "all") as Category;

  const handleClick = (cat: Category) => {
    const params = new URLSearchParams(searchParams.toString());
    // "all" ক্লিক করলে category param remove, নাহলে set
    if (cat === "all") params.delete("category");
    else params.set("category", cat);

    // push নয় replace — history তে প্রতিটা ক্লিক জমা হবে না
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => handleClick(cat)}
            aria-pressed={isActive}
            className={`h-10 w-25 rounded-full border text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#EB7036] text-white border-[#EB7036]"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {LABELS[cat]}
          </button>
        );
      })}
    </div>
  );
}