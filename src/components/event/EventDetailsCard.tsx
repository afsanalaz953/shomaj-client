"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { CalendarDays, Check, Clock, MapPin, Tag } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Event } from "@/types/event";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stillVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

function formatEventDate(date?: string) {
  if (!date) return "Date to be announced";
  const parsed = parseISO(date);
  return isValid(parsed) ? format(parsed, "EEEE, MMMM d, yyyy") : date;
}

function formatEventLocation(location?: Event["location"]) {
  const parts = [location?.venue, location?.area, location?.city].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length > 0 ? parts.join(", ") : "Location to be announced";
}

interface EventDetailsCardProps {
  event: Event;
}

// MongoDB doc-এ _id থাকবেই; type-এ না থাকলে এই cast দিয়ে কাজ চলে
type EventWithId = Event & { _id?: string; id?: string };
type JoinedRecord = { eventId?: string };

const EventDetailsCard = ({ event }: EventDetailsCardProps) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const redirectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const container = reduceMotion ? stillVariants : cardVariants;
  const item = reduceMotion ? stillVariants : itemVariants;

  const registered = event.registeredCount ?? 0;
  const capacity = event.capacity ?? 0;
  const seatsLeft = Math.max(capacity - registered, 0);
  const isFull = event.status === "full" || (capacity > 0 && seatsLeft === 0);

  const eventId = (event as EventWithId)._id ?? (event as EventWithId).id;

  useEffect(() => {
    return () => {
      if (redirectRef.current) clearTimeout(redirectRef.current);
    };
  }, []);

  // ✅ Page load-এই চেক করি — এই user আগে join করেছে কি না
  useEffect(() => {
    if (!user?.id || !eventId) return;
    let cancelled = false;

    const checkAlreadyJoined = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/joined/${user.id}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const list: JoinedRecord[] = await res.json();
        if (!cancelled && list.some((row) => row.eventId === eventId)) {
          setJoined(true);
        }
      } catch (err) {
        console.error("Failed to check joined status", err);
      }
    };

    void checkAlreadyJoined();
    return () => {
      cancelled = true;
    };
  }, [user?.id, eventId]);

  const details: { icon: ReactNode; label: string; value: string }[] = [
    {
      icon: <CalendarDays className="size-5 shrink-0 text-[#EB7036]" />,
      label: "Date",
      value: formatEventDate(event.date),
    },
    {
      icon: <Clock className="size-5 shrink-0 text-[#EB7036]" />,
      label: "Time",
      value:
        event.startTime || event.endTime
          ? `${event.startTime ?? "--:--"} - ${event.endTime ?? "--:--"}`
          : "Time to be announced",
    },
    {
      icon: <MapPin className="size-5 shrink-0 text-[#EB7036]" />,
      label: "Location",
      value: formatEventLocation(event.location),
    },
  ];

  const handleJoin = async () => {
    if (isFull || joining) return;

    // ✅ Already joined হলে সরাসরি toast
    if (joined) {
      toast.info("You have already joined this event");
      return;
    }

    if (!user?.id) {
      toast.error("Please login to join this event");
      return;
    }

    // ✅ event-এর _id সরিয়ে দিলাম, নাহলে MongoDB সেই _id দিয়ে
    //     joined doc insert করতে গিয়ে একই event-এ 2nd user-এর জন্য
    //     duplicate key error হবে (backend 409 ভুল করে দেবে)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...eventFields } = event as EventWithId;

    const payload = {
      ...eventFields,
      userName: user.name,
      userId: user.id,
      userEmail: user.email,
      userImage: user.image,
      joinedAt: new Date().toISOString(),
      eventId, // ✅ backend এটাই চায়
    };

    try {
      setJoining(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/joined`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json().catch(() => ({}));

      // ✅ Backend already joined (unique index / findOne) → toast
      if (res.status === 409 || data?.alreadyJoined) {
        setJoined(true);
        toast.info("You have already joined this event");
        return;
      }

      if (!res.ok) {
        throw new Error(
          data?.message ?? `Request failed with status ${res.status}`,
        );
      }

      // ✅ শুধু সফল হলে redirect
      setJoined(true);
      toast.success("Joined successfully");
      redirectRef.current = setTimeout(() => router.push("/joined"), 700);
    } catch (err) {
      console.error("handleJoin error", err);
      toast.error("Failed to join event. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <motion.article
      variants={container}
      initial="hidden"
      animate="show"
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="mx-auto w-full max-w-4xl"
    >
      <Card className="gap-0 overflow-hidden py-0 shadow-sm">
        {/* ---- Image + category ---- */}
        <motion.div
          variants={item}
          className="relative aspect-video w-full overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.imageUrl ?? "/assets/banner.avif"}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          {event.category ? (
            <Badge className="absolute top-4 right-4 bg-[#D9F265] px-3 py-4 font-semibold text-[#1F3D2B]">
              {event.category}
            </Badge>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-6 pt-14">
            <motion.h1
              variants={item}
              className="text-2xl leading-tight font-bold text-white sm:text-3xl"
            >
              {event.title}
            </motion.h1>
          </div>
        </motion.div>

        {/* ---- Description + details ---- */}
        <motion.div variants={item} className="flex flex-col gap-5 py-6">
          <CardHeader className="gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={isFull ? "destructive" : "secondary"}
                className="bg-[#D9F265] p-3 font-semibold"
              >
                {isFull
                  ? "Full"
                  : (event.status ?? "upcoming").toUpperCase()}
              </Badge>
              {event.organizer?.name ? (
                <span className="text-muted-foreground">
                  Organized by {event.organizer.name}
                  {event.organizer.verified ? " · Verified" : ""}
                </span>
              ) : null}
            </div>

            <CardTitle className="text-xl font-bold sm:text-2xl">
              {event.title}
            </CardTitle>

            {event.description ? (
              <CardDescription className="leading-relaxed">
                {event.description}
              </CardDescription>
            ) : null}
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            {details.map((detail) => (
              <motion.div
                key={detail.label}
                variants={item}
                className="flex items-start gap-3 rounded-xl bg-muted/40 p-3"
              >
                {detail.icon}
                <div className="flex min-w-0 flex-col">
                  <span className="font-medium text-muted-foreground">
                    {detail.label}
                  </span>
                  <span className="font-semibold break-words">
                    {detail.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </CardContent>

          {event.tags?.length ? (
            <div className="flex flex-wrap items-center gap-2 px-(--card-spacing)">
              <Tag className="size-4 text-muted-foreground" />
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="px-3 py-1">
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </motion.div>

        {/* ---- Join / Joined button ---- */}
        <motion.div variants={item}>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {capacity > 0
                  ? `${seatsLeft} seat${seatsLeft === 1 ? "" : "s"} left`
                  : "Everyone is welcome"}
              </span>
              <AnimatePresence>
                {joined ? (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[#087C7E]"
                  >
                    You already joined this event
                  </motion.span>
                ) : (
                  <motion.span
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-muted-foreground"
                  >
                    Join to save this event to your list
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Button
                render={<Link href="/joined" />}
                onClick={(e) => {
                  if (
                    e.metaKey ||
                    e.ctrlKey ||
                    e.shiftKey ||
                    e.altKey ||
                    e.button !== 0
                  ) {
                    return;
                  }
                  e.preventDefault();
                  void handleJoin();
                }}
                // ✅ joined হলেও disable করছি না → 2nd click-এ toast দেখাবে
                disabled={isFull || joining}
                className={`h-11 gap-2 rounded-xl px-8 text-sm font-semibold text-white transition-colors ${
                  joined
                    ? "bg-[#087C7E] hover:bg-[#066567]"
                    : "bg-[#EB7036] hover:bg-[#d95f27]"
                }`}
              >
                {joined ? (
                  <>
                    <Check className="size-4" />
                    Joined
                  </>
                ) : isFull ? (
                  "Registration Full"
                ) : joining ? (
                  "Joining…"
                ) : (
                  "Join Event"
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </motion.div>
      </Card>
    </motion.article>
  );
};

export default EventDetailsCard;





// "use client";

// import { useEffect, useRef, useState, type ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   AnimatePresence,
//   motion,
//   useReducedMotion,
//   type Variants,
// } from "framer-motion";
// import {
//   CalendarDays,
//   Check,
//   Clock,
//   MapPin,
//   Tag,
//   Users,
// } from "lucide-react";
// import { format, isValid, parseISO } from "date-fns";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import type { Event } from "@/types/event";
// import { authClient } from "@/lib/auth-client";
// import { toast } from "react-toastify";

// const cardVariants: Variants = {
//   hidden: { opacity: 0, y: 28 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.5,
//       ease: "easeOut",
//       staggerChildren: 0.1,
//       delayChildren: 0.1,
//     },
//   },
// };

// const itemVariants: Variants = {
//   hidden: { opacity: 0, y: 18 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.4, ease: "easeOut" },
//   },
// };

// const stillVariants: Variants = {
//   hidden: { opacity: 1, y: 0 },
//   show: { opacity: 1, y: 0 },
// };

// function formatEventDate(date?: string) {
//   if (!date) return "Date to be announced";
//   const parsed = parseISO(date);
//   return isValid(parsed) ? format(parsed, "EEEE, MMMM d, yyyy") : date;
// }

// function formatEventLocation(location?: Event["location"]) {
//   const parts = [location?.venue, location?.area, location?.city].filter(
//     (part): part is string => Boolean(part),
//   );
//   return parts.length > 0 ? parts.join(", ") : "Location to be announced";
// }

// interface EventDetailsCardProps {
//   event: Event;
// }

// const EventDetailsCard =({ event }: EventDetailsCardProps) => {

//   const { data: session } = authClient.useSession();
//     const user = session?.user;
//     console.log(user, 'user for joined')

//   const router = useRouter();
//   const reduceMotion = useReducedMotion();
//   const [joined, setJoined] = useState(false);
//   const redirectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const container = reduceMotion ? stillVariants : cardVariants;
//   const item = reduceMotion ? stillVariants : itemVariants;

//   const registered = event.registeredCount ?? 0;
//   const capacity = event.capacity ?? 0;
//   const seatsLeft = Math.max(capacity - registered, 0);
//   const isFull = event.status === "full" || (capacity > 0 && seatsLeft === 0);

//   useEffect(() => {
//     return () => {
//       if (redirectRef.current) clearTimeout(redirectRef.current);
//     };
//   }, []);

//    const details: { icon: ReactNode; label: string; value: string }[] = [
//     {
//       icon: <CalendarDays className="size-5 shrink-0 text-[#EB7036]" />,
//       label: "Date",
//       value: formatEventDate(event.date),
//     },
//     {
//       icon: <Clock className="size-5 shrink-0 text-[#EB7036]" />,
//       label: "Time",
//       value:
//         event.startTime || event.endTime
//           ? `${event.startTime ?? "--:--"} - ${event.endTime ?? "--:--"}`
//           : "Time to be announced",
//     },
//     {
//       icon: <MapPin className="size-5 shrink-0 text-[#EB7036]" />,
//       label: "Location",
//       value: formatEventLocation(event.location),
//     },
//     // {
//     //   icon: <Users className="size-5 shrink-0 text-[#EB7036]" />,
//     //   label: "Attendance",
//     //   value: capacity > 0 ? `${registered}/${capacity} joined` : `${registered} joined`,
//     // },
//   ];

//   const handleJoin = async() => {
//     if (joined || isFull) return;
//     setJoined(true);
//     redirectRef.current = setTimeout(() => router.push("/joined"), 700);
 

 
// const data ={
//    userName: user?.name,
//         userId : user?.id,
//         userEmail: user?.email,
//         userImage: user?.image,
//         joinedAt: new Date().toISOString(),
//         ...event
      

// }
// console.log(data, 'joined data')
//  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/joined`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(data),
//         }
//       );


// const joinedData = await res.json();
//  console.log( 'data after post', joinedData);

//       if (!res.ok) {
//         throw new Error(`Request failed with status ${res.status}`);
//       }

//       // toast.add({
//       //   type: "success",
//       //   title: "Event created",
//       //   description: `"${joinedData.title}" is now listed as an upcoming event.`,
//       // });

//  };
//   return (
//     <motion.article
//       variants={container}
//       initial="hidden"
//       animate="show"
//       whileHover={reduceMotion ? undefined : { y: -6 }}
//       transition={{ type: "spring", stiffness: 260, damping: 24 }}
//       className="mx-auto w-full max-w-4xl"
//     >
//       <Card className="gap-0 overflow-hidden py-0 shadow-sm">
//         {/* ---- Image + category ---- */}
//         <motion.div
//           variants={item}
//           className="relative aspect-video w-full overflow-hidden"
//         >
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img
//             src={event.imageUrl ?? "/assets/banner.avif"}
//             alt={event.title}
//             className="h-full w-full object-cover"
//           />
//           {event.category ? (
//             <Badge className="absolute top-4 right-4 bg-[#D9F265] px-3 py-4  font-semibold text-[#1F3D2B]">
//               {event.category}
//             </Badge>
//           ) : null}
//           <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-6 pt-14">
//             <motion.h1
//               variants={item}
//               className="text-2xl leading-tight font-bold text-white sm:text-3xl"
//             >
//               {event.title}
//             </motion.h1>
//           </div>
//         </motion.div>

//         {/* ---- Description + details ---- */}
//         <motion.div variants={item} className="flex flex-col gap-5 py-6">
//           <CardHeader className="gap-2">
//             <div className="flex flex-wrap items-center gap-2">
//               <Badge
//                 variant={isFull ? "destructive" : "secondary"}
//                 className="p-3  font-semibold  bg-[#D9F265]"
//               >
//                 {isFull
//                   ? "Full"
//                   : (event.status ?? "upcoming").toUpperCase()}
//               </Badge>
//               {event.organizer?.name ? (
//                 <span className=" text-muted-foreground">
//                   Organized by {event.organizer.name}
//                   {event.organizer.verified ? " · Verified" : ""}
//                 </span>
//               ) : null}
//             </div>

//             <CardTitle className="text-xl font-bold sm:text-2xl">
//               {event.title}
//             </CardTitle>

//             {event.description ? (
//               <CardDescription className=" leading-relaxed">
//                 {event.description}
//               </CardDescription>
//             ) : null}
//           </CardHeader>

//           <CardContent className="grid gap-4 sm:grid-cols-2">
//             {details.map((detail) => (
//               <motion.div
//                 key={detail.label}
//                 variants={item}
//                 className="flex items-start gap-3 rounded-xl bg-muted/40 p-3"
//               >
//                 {detail.icon}
//                 <div className="flex min-w-0 flex-col">
//                   <span className=" font-medium text-muted-foreground">
//                     {detail.label}
//                   </span>
//                   <span className=" font-semibold break-words">
//                     {detail.value}
//                   </span>
//                 </div>
//               </motion.div>
//             ))}
//           </CardContent>

//           {event.tags?.length ? (
//             <div className="flex flex-wrap items-center gap-2 px-(--card-spacing)">
//               <Tag className="size-4 text-muted-foreground" />
//               {event.tags.map((tag) => (
//                 <Badge key={tag} variant="outline" className="px-3 py-1">
//                   #{tag}
//                 </Badge>
//               ))}
//             </div>
//           ) : null}
//         </motion.div>

//         {/* ---- Join / Joined button ---- */}
//         <motion.div variants={item}>
//           <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex flex-col">
//               <span className=" font-medium text-foreground">
//                 {capacity > 0
//                   ? `${seatsLeft} seat${seatsLeft === 1 ? "" : "s"} left`
//                   : "Everyone is welcome"}
//               </span>
//               <AnimatePresence>
//                 {joined ? (
//                   <motion.span
//                     initial={{ opacity: 0, y: -4 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                     className=" text-[#087C7E]"
//                   >
//                     Taking you to your joined events…
//                   </motion.span>
//                 ) : (
//                   <motion.span
//                     key="hint"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="text-muted-foreground"
//                   >
//                     Join to save this event to your list
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </div>

//             <motion.div
//               whileHover={reduceMotion ? undefined : { scale: 1.03 }}
//               whileTap={reduceMotion ? undefined : { scale: 0.97 }}
//               transition={{ type: "spring", stiffness: 400, damping: 22 }}
//             >
//               <Button
//                 render={<Link href="/joined" />}
//                 onClick={(event) => {
//                   // A normal click keeps the "Joined ✓" feedback + redirect;
//                   // modified clicks (new tab, new window…) follow the href.
//                   if (
//                     event.metaKey ||
//                     event.ctrlKey ||
//                     event.shiftKey ||
//                     event.altKey ||
//                     event.button !== 0
//                   ) {
//                     return;
//                   }
//                   event.preventDefault();
//                   void handleJoin();
//                 }}
//                 disabled={isFull || joined}
//                 className={`h-11 gap-2 rounded-xl px-8 text-sm font-semibold text-white transition-colors ${
//                   joined
//                     ? "bg-[#087C7E] hover:bg-[#066567]"
//                     : "bg-[#EB7036] hover:bg-[#d95f27]"
//                 }`}
//               >
//                 {joined ? (
//                   <>
//                     <Check className="size-4" />
//                     Joined
//                   </>
//                 ) : isFull ? (
//                   "Registration Full"
//                 ) : (
//                   "Join Event"
//                 )}
//               </Button>
//             </motion.div>
//           </CardFooter>
//         </motion.div>
//       </Card>
//     </motion.article>
//   );
// };

// export default EventDetailsCard;
