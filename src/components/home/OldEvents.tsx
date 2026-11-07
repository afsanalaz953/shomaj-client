import React from "react";
import Gallery from "./Gallery";
import type { Event } from "@/types/event";

const OldEvents = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/gallery`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch gallery: ${res.status}`);
  }

  const oldEvents: Event[] = await res.json();

  // ---- Only keep gallery items that have a visible image ----
  const galleryEvents = oldEvents.filter((event) => Boolean(event.imageUrl));

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
      {/* ---- Section heading ---- */}
      <div className="mb-5 flex flex-col items-start gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#EB7036]" />
            <p className="text-[0.7rem] font-semibold tracking-[0.35em] text-[#EB7036] uppercase">
              Moments from the past
            </p>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-[#1F3D2B] md:text-4xl">
            Event Gallery
          </h2>
          <p className=" leading-relaxed text-muted-foreground">
          A look back at the gatherings, people and places that made it
          happen.
        </p>
        </div>
        
      </div>

      {/* ---- Gallery grid ---- */}
      <Gallery events={galleryEvents} />
    </section>
  );
};

export default OldEvents;
