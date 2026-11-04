"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import JoinedEventCard from "./JoinedEventCard";
import type { JoinedEvent } from "@/types/event";

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

const stillVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

interface JoinedEventGridProps {
  events: JoinedEvent[];
}

const JoinedEventGrid = ({ events }: JoinedEventGridProps) => {
  const reduceMotion = useReducedMotion();

  const container: Variants = reduceMotion ? stillVariants : gridContainer;
  const item: Variants = reduceMotion ? stillVariants : gridItem;

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed bg-white/60 p-12 text-center shadow-sm">
        <CalendarOff className="size-10 text-[#EB7036]" />
        <div>
          <p className="text-lg font-semibold">No joined events yet</p>
          <p className="text-sm text-muted-foreground">
            Events you join will show up here with the date you joined them.
          </p>
        </div>
        <Button
          render={<Link href="/upcoming" />}
          className="h-11 gap-2 rounded-xl bg-[#EB7036] px-8 text-sm font-semibold text-white hover:bg-[#d95f27]"
        >
          Browse Upcoming Events
        </Button>
      </div>
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
      {events.map((event, index) => (
        <motion.div
          key={`${event._id}-${index}`}
          variants={item}
          whileHover={reduceMotion ? undefined : { y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="h-full"
        >
          <JoinedEventCard event={event} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default JoinedEventGrid;
