"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/types/event";

const gridContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const gridItem: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

function formatGalleryDate(date?: string) {
  if (!date) return "Date to be announced";
  const parsed = parseISO(date);
  return isValid(parsed) ? format(parsed, "MMM yyyy") : date;
}

function formatGalleryLocation(location?: Event["location"]) {
  const parts = [location?.venue, location?.area, location?.city].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length > 0 ? parts.join(", ") : "Location to be announced";
}

interface GalleryProps {
  events: Event[];
}

const Gallery = ({ events }: GalleryProps) => {
  const reduceMotion = useReducedMotion();

  const container: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : gridContainer;
  const item: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : gridItem;

  if (events.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No gallery moments to show yet—check back soon.
      </p>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {events.map((event) => (
        <motion.div
          key={event._id}
          variants={item}
          whileHover={reduceMotion ? undefined : { y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="group relative aspect-3/4 w-full overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-xl"
        >
          <Link
            href={`/events/${event._id}`}
            className="absolute inset-0 z-10"
            aria-label={`View ${event.title}`}
          />

          {/* ---- Image ---- */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.imageUrl ?? "/assets/banner.avif"}
            alt={event.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          

          {/* ---- Gradient scrim so text stays readable on the image ---- */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent"
          />

          {/* ---- Category badge on the image ---- */}
          {event.category && (
            <Badge className="absolute top-4 right-4 z-20 bg-[#D9F265] px-3 py-4 text-xs font-semibold text-[#1F3D2B]">
              {event.category}
            </Badge>
          )}

          {/* ---- Title, date & location overlaid on the image ---- */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 p-4">
            <Badge className="w-fit bg-[#D9F265] px-2.5 py-4 text-[0.65rem] font-semibold text-[#1F3D2B]">
              <CalendarDays className="size-3" />
              {formatGalleryDate(event.date)}
            </Badge>

            <h3 className="text-lg leading-snug font-bold text-white drop-shadow">
              {event.title}
            </h3>

            <div className="flex items-start gap-1.5 text-white/85">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              <span className="text-xs leading-snug">
                {formatGalleryLocation(event.location)}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Gallery;
