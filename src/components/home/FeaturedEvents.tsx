"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CalendarDays, Eye, MapPin } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Event } from "@/types/event";

const gridContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const gridItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function formatEventDate(date?: string) {
  if (!date) return "Date to be announced";
  const parsed = parseISO(date);
  return isValid(parsed) ? format(parsed, "EEE, MMM d, yyyy") : date;
}

function formatEventLocation(location?: Event["location"]) {
  const parts = [location?.venue, location?.area, location?.city].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length > 0 ? parts.join(", ") : "Location to be announced";
}

interface FeaturedEventsProps {
  events: Event[];
}

const FeaturedEvents = ({ events }: FeaturedEventsProps) => {
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
        No featured events right now—check back soon.
      </p>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {events.map((event) => (
        <motion.div
          key={event._id}
          variants={item}
          whileHover={reduceMotion ? undefined : { y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="h-full"
        >
          <Card className="group h-full gap-0 overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-xl">
            {/* ---- Image + category ---- */}
            <div className="relative aspect-4/3 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.imageUrl ?? "/assets/banner.avif"}
                alt={event.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {event.category && (
                <Badge className="absolute top-4 right-4 bg-[#D9F265] px-3 py-4 text-xs font-semibold text-[#1F3D2B]">
                  {event.category}
                </Badge>
              )}
            </div>

            {/* ---- Title, date, location ---- */}
            <CardContent className="flex flex-1 flex-col gap-4 pt-5 pb-5">
              <h3 className="text-xl leading-snug font-bold text-foreground">
                {event.title}
              </h3>

              <div className="flex items-center gap-3">
                <CalendarDays className="size-5 shrink-0 text-[#EB7036]" />
                <span className="text-sm font-semibold text-[#EB7036]">
                  {formatEventDate(event.date)}
                </span>
              </div>

              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 size-5 shrink-0" />
                <span className="text-sm">{formatEventLocation(event.location)}</span>
              </div>
            </CardContent>

            {/* ---- View button ---- */}
            <CardFooter className="border-t bg-transparent p-4">
              <Button
                render={<Link href={`/events/${event._id}`} />}
                className="h-11 w-full gap-2 rounded-xl bg-[#EB7036] text-sm font-semibold text-white hover:bg-[#d95f27]"
              >
                <Eye className="size-4" />
                View Event
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturedEvents;
