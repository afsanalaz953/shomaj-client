import React from "react";
import FeaturedEvents from "./FeaturedEvents";
import type { Event } from "@/types/event";

const Featured = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/featured`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch featured events: ${res.status}`);
  }

  const featuredUpcommingEvents: Event[] = await res.json();
  console.log("Featured Events", featuredUpcommingEvents);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 md:py-20">
      {/* ---- Section heading ---- */}
      <div className="mb-5 flex flex-col items-start gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#EB7036]" />
            <p className="text-[0.7rem] font-bold tracking-[0.35em] text-[#e7500a] uppercase">
              Handpicked for you
            </p>
          </div>
          <div>
            <h2 className="mt-4 text-3xl font-bold text-[#1F3D2B] md:text-4xl">
            Recent Upcoming Events
          </h2>
           <p className="  leading-relaxed text-muted-foreground">
          A few of the most meaningful ways to show up for your community this
          week.
        </p>
          </div>
          
        </div>
        {/* para akhane silo */}
      </div>

      {/* ---- Event cards ---- */}
      <FeaturedEvents events={featuredUpcommingEvents} />
    </section>
  );
};

export default Featured;
