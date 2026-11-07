"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  CalendarHeart,
  GraduationCap,
  HandHeart,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

interface WorkItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const workItems: WorkItem[] = [
  {
    icon: CalendarHeart,
    title: "Community Events",
    description:
      "We bring people together with gatherings that celebrate culture, connection and the spirit of the neighborhood.",
  },
  {
    icon: HandHeart,
    title: "Volunteer Drives",
    description:
      "From food drives to clean-ups, we coordinate hands-on volunteering that turns goodwill into real impact.",
  },
  {
    icon: GraduationCap,
    title: "Workshops & Learning",
    description:
      "Free skill-sharing sessions, talks and mentorships that help members grow and learn from one another.",
  },
  {
    icon: UsersRound,
    title: "Youth & Outreach",
    description:
      "Programs built with schools and local partners to support young people and reach under-served groups.",
  },
];

const OurWork = () => {
  const reduceMotion = useReducedMotion();

  const container: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : gridContainer;
  const item: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : gridItem;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
      {/* ---- Section heading ---- */}
      <div className="mb-5 flex flex-col items-start gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#EB7036]" />
            <p className="text-[0.7rem] font-bold tracking-[0.35em] text-[#e7500a] uppercase">
              What we do
            </p>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-[#1F3D2B] md:text-4xl">
            Our Work
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Four ways we show up for the community, all year round.
          </p>
        </div>
      </div>

      {/* ---- Work cards ---- */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {workItems.map(({ icon: Icon, title, description }) => (
          <motion.div
            key={title}
            variants={item}
            whileHover={reduceMotion ? undefined : { y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="h-full"
          >
            <Card className="group h-full gap-0 overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-xl">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                {/* ---- Icon ---- */}
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#EB7036]/10 transition-colors group-hover:bg-[#EB7036]">
                  <Icon
                    className="size-7 text-[#EB7036] transition-colors group-hover:text-white"
                    aria-hidden
                  />
                </div>

                <h3 className="text-xl leading-snug font-bold text-foreground">
                  {title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default OurWork;
