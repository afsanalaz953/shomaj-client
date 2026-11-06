"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";

const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchTerm(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Sync input with URL query param on mount & URL changes
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";

    if (currentSearch !== searchTerm) {
      setSearchTerm(currentSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="w-100 m-10 relative flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:ring-4 focus-within:ring-blue-600/10 focus-within:border-blue-600 transition-all overflow-hidden">
      <div className="pl-5 text-slate-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        value={searchTerm}
        onChange={handleSearch}
        type="text"
        placeholder="Search for events"
        className="flex-1 h-14 px-4 outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
      />
      {/* <button
        onClick={handleSearch}
        className="h-10 px-6 mr-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        Search
      </button> */}
    </div>
  );
};

export default SearchBar;