"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isValid) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="relative isolate overflow-hidden rounded-3xl bg-[#D9EF78] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        {/* ---- Decorative concentric circles (top-right) ---- */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-44 -right-40 size-[44rem] rounded-full bg-white/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-28 size-[32rem] rounded-full bg-white/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-16 size-[20rem] rounded-full bg-white/15"
        />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          {/* ---- Copy ---- */}
          <div className="max-w-md">
            <p className="text-[0.7rem] font-bold tracking-[0.28em] text-[#1F3D2B] uppercase">
              Stay in the loop
            </p>

            <h2
              className={`${playfair.className} mt-5 text-4xl leading-[1.05] font-semibold text-[#123A22] sm:text-5xl`}
            >
              Good news,
              <br />
              delivered locally.
            </h2>

            <p className="mt-5 max-w-sm text-[1.0625rem] leading-relaxed text-[#2E5B43]">
              Get a thoughtful roundup of upcoming events and community
              stories&mdash;no noise, just ways to help.
            </p>
            <h2 className="text-2xl text-[#2E5B43] font-bold">Subscribe to our Newsletter</h2>
          </div>

          {/* ---- Subscribe form ---- */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full lg:justify-self-end"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Label htmlFor="newsletter-email" className="sr-only">
                Your email address
              </Label>
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Your email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                aria-invalid={status === "error"}
                className="h-14 w-full rounded-xl border-transparent bg-[#F7F9EF] px-6 text-base text-[#1F3D2B] shadow-none placeholder:text-[#93A387] focus-visible:border-[#1F3D2B]/30 focus-visible:ring-[#1F3D2B]/20 sm:w-72"
              />
              <Button
                type="submit"
                className="group h-14 gap-2 rounded-xl bg-[#EB7036] px-7 text-base font-semibold text-white hover:bg-[#d95f27]"
              >
                {status === "success" ? (
                  <>
                    You&apos;re subscribed
                    <Check className="size-4" />
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>

            {/* ---- Feedback ---- */}
            <div aria-live="polite" className="mt-3 min-h-5 sm:text-right">
              {status === "error" && (
                <p className="text-sm font-medium text-[#B4471F]">
                  Please enter a valid email address.
                </p>
              )}
              {status === "success" && (
                <p className="text-sm font-medium text-[#1F3D2B]">
                  You&apos;re on the list&mdash;see you in your inbox.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
