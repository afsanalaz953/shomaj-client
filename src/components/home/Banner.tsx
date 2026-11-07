import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const highlights = [
  "Stronger neighborhoods",
  "Shared responsibility",
  "Real local impact",
];

const neighbors = [
  { src: "/assets/avatar-1.jpg", name: "Ayesha R." },
  { src: "/assets/avatar-2.jpg", name: "Tanvir H." },
  { src: "/assets/avatar-3.jpg", name: "Nusrat J." },
];

const Banner = () => {
  return (
    <section className="container mx-auto min-h-screen rounded-2xl ">
      {/* ================= HERO ================= */}
      <div className="relative isolate overflow-hidden">
        {/* Background photo */}
        <Image
          src="/assets/banner.avif"
          alt="Neighbors volunteering together at a local park cleanup"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[70%_center]"
        />

        {/* Dark green overlays for text legibility */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-r from-[#12291B]/95 via-[#12291B]/70 to-[#12291B]/10"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-t from-[#12291B]/60 via-transparent to-transparent"
        />

        <div className="relative mx-auto flex `min-h-136` max-w-6xl flex-col justify-center px-6 py-20 md:py-28">
          {/* ---- Eyebrow ---- */}
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-white/80" />
            <p className="text-[0.7rem] font-semibold tracking-[0.35em] text-white uppercase">
              Local action. Lasting change.
            </p>
          </div>

          {/* ---- Heading ---- */}
          <h1
            className={`${playfair.className} mt-6 max-w-2xl text-5xl leading-[0.95] font-semibold text-white sm:text-6xl lg:text-7xl`}
          >
            Your
            <br />
            neighborhood
            <br />
            needs{" "}
            <span className="italic font-normal text-[#D9F265]">you</span>
            <span className="text-[#D9F265]">.</span>
          </h1>

          {/* ---- Sub copy ---- */}
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/85">
            Find meaningful ways to give back, meet people who care, and make
            Dhaka stronger&mdash;one event at a time.
          </p>

          {/* ---- CTAs ---- */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              render={<Link href="/upcoming" />}
              className="group h-11 gap-2 rounded-full bg-[#EB7036] px-7 text-sm font-semibold text-white hover:bg-[#d95f27]"
            >
              Explore events
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              render={<Link href="/create" />}
              variant="outline"
              className="h-11 rounded-full border-white/70 bg-transparent px-7 text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              Start an event
            </Button>
          </div>

          {/* ---- Social proof card ---- */}
          <div className="relative mt-12 flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-[#1C3B2A]/85 px-5 py-4 backdrop-blur-md md:absolute md:right-6 md:bottom-10 md:mt-0">
            <AvatarGroup className="-space-x-3 [&_[data-slot=avatar]]:ring-2 [&_[data-slot=avatar]]:ring-[#1C3B2A]">
              {neighbors.map((neighbor) => (
                <Avatar key={neighbor.name} size="sm">
                  <AvatarImage
                    src={neighbor.src}
                    alt={neighbor.name}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {neighbor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <div className="leading-tight">
              <p className="text-xl font-bold text-white">2,400+</p>
              <p className="text-xs text-white/70">neighbors taking action</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BELIEF STRIP ================= */}
      <div className="w-full bg-[#DFEE92]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-4">
          <p
            className={`${playfair.className} text-lg font-medium text-[#1F3D2B] italic`}
          >
            Built for people who believe in
          </p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {highlights.map((item, index) => (
              <li key={item} className="flex items-center gap-8">
                <span className="text-[0.7rem] font-bold tracking-[0.2em] text-[#1F3D2B] uppercase">
                  {item}
                </span>
                {index < highlights.length - 1 && (
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-[#EB7036]"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Banner;
