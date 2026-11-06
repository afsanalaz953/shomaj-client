import React, { Suspense } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Eye, MapPin } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/types/event";
import SearchBar from "@/components/shared/SearchBar";
import CategoryFilter from "@/components/shared/CategoryFilter";

// ============ Helpers ============
const formatDate = (date?: string) => {
  if (!date) return "TBA";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ============ Event Card ============
const EventCard = ({ event }: { event: Event }) => {
  const registered = event.registeredCount ?? 0;
  const capacity = event.capacity ?? 0;
  const seatsLeft = Math.max(capacity - registered, 0);
  const isFull = event.status === "full" || (capacity > 0 && seatsLeft === 0);

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-48 w-full object-cover rounded"
            loading="lazy"
          />
        ) : null}
        {event.category ? (
          <Badge
            variant="outline"
            className="absolute top-4 right-4 p-4 bg-[#b9d82f]"
          >
            {event.category}
          </Badge>
        ) : null}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-2xl">{event.title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-lg text-orange-700 shrink-0" />
            <span className="text-orange-700 font-bold">
              {formatDate(event.date)}
            </span>
          </div>

          {event.startTime || event.endTime ? (
            <div className="flex items-center gap-2">
              <Clock className="size-4 shrink-0" />
              <span>
                {event.startTime ?? "--:--"} - {event.endTime ?? "--:--"}
              </span>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">
              {[
                event.location?.venue,
                event.location?.area,
                event.location?.city,
              ]
                .filter(Boolean)
                .join(", ") || "TBA"}
            </span>
          </div>
        </div>

        {event.organizer?.name ? (
          <p className="text-xs text-muted-foreground">
            Organized by {event.organizer.name}
            {event.organizer.verified ? " · Verified" : ""}
          </p>
        ) : null}
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full bg-[#EB7036] rounded"
          render={<Link href={`/upcoming/${event._id}`} />}
        >
          <Eye className="size-4" />
          View Event
        </Button>
      </CardFooter>
    </Card>
  );
};

// ============ Page ============
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const UpComingPage = async ({ searchParams }: Props) => {
  // Next 15 এ searchParams Promise — await দরকার। Next 14 এ plain object হলেও await ঠিকই কাজ করে।
  const params = await searchParams;

  const search =
    typeof params?.search === "string" ? params.search.trim() : "";
  const category =
    typeof params?.category === "string" ? params.category.trim() : "";

  // 🔑 search + category দুটোই backend URL এ forward করো
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (category && category !== "all") qs.set("category", category);

  const backendUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/upcoming${
    qs.toString() ? `?${qs.toString()}` : ""
  }`;

  let allEvents: Event[] = [];
  try {
    const res = await fetch(backendUrl, { cache: "no-store" });
    const data = await res.json();
    allEvents = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load upcoming events", error);
  }

  // heading text — search/category অনুযায়ী
  const count = allEvents.length;
  const heading =
    search && category
      ? `${count} result${count === 1 ? "" : "s"} for "${search}" in ${category}`
      : search
      ? `${count} result${count === 1 ? "" : "s"} for "${search}"`
      : category
      ? `${count} ${category} event${count === 1 ? "" : "s"}`
      : `${count} events are waiting for you`;

  const emptyText =
    search || category
      ? `No events found${search ? ` for "${search}"` : ""}${
          category ? ` in ${category}` : ""
        }.`
      : "No upcoming events found.";

  return (
    <section className="container mx-auto flex flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <p className="text-muted-foreground">{heading}</p>
      </div>

      {/* Search bar — useSearchParams এর জন্য Suspense mandatory */}
      <div className="flex justify-between">
        
         <Suspense fallback={<div className="h-5 w-5" />}>
        <CategoryFilter />
      </Suspense>

      <Suspense fallback={<div className="h-14 w-full" />}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Category buttons */}
     

      {allEvents.length === 0 ? (
        <p className="text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
};

export default UpComingPage;




// import React, { Suspense } from "react";

// import CategoryFilter from "@/components/shared/CategoryFilter";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { CalendarDays, Clock, Eye, MapPin } from "lucide-react";
// import Link from "next/link";
// import type { Event } from "@/types/event";
// import SearchBar from "@/components/shared/SearchBar";

// const formatDate = (date?: string) => {
//   if (!date) return "TBA";
//   const parsed = new Date(date);
//   if (Number.isNaN(parsed.getTime())) return date;
//   return parsed.toLocaleDateString("en-US", {
//     weekday: "short",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// const EventCard = ({ event }: { event: Event }) => {
//   const registered = event.registeredCount ?? 0;
//   const capacity = event.capacity ?? 0;
//   const seatsLeft = Math.max(capacity - registered, 0);
//   const isFull = event.status === "full" || (capacity > 0 && seatsLeft === 0);

//   return (
//     <Card className="overflow-hidden">
//       <div className="relative">
//         {event.imageUrl ? (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img
//             src={event.imageUrl}
//             alt={event.title}
//             className="h-48 w-full object-cover rounded"
//             loading="lazy"
//           />
//         ) : null}
//         {event.category ? (
//           <Badge
//             variant="outline"
//             className="absolute top-4 right-4 p-4 bg-[#b9d82f]"
//           >
//             {event.category}
//           </Badge>
//         ) : null}
//       </div>

//       <CardHeader>
//         <div className="flex items-start justify-between gap-2">
//           <CardTitle className="text-2xl">{event.title}</CardTitle>
//         </div>
//       </CardHeader>

//       <CardContent className="flex flex-col gap-3">
//         <div className="flex flex-col gap-2 text-sm text-muted-foreground">
//           <div className="flex items-center gap-2">
//             <CalendarDays className="text-lg text-orange-700 shrink-0" />
//             <span className="text-orange-700 font-bold">
//               {formatDate(event.date)}
//             </span>
//           </div>

//           {event.startTime || event.endTime ? (
//             <div className="flex items-center gap-2">
//               <Clock className="size-4 shrink-0" />
//               <span>
//                 {event.startTime ?? "--:--"} - {event.endTime ?? "--:--"}
//               </span>
//             </div>
//           ) : null}

//           <div className="flex items-center gap-2">
//             <MapPin className="size-4 shrink-0" />
//             <span className="truncate">
//               {[
//                 event.location?.venue,
//                 event.location?.area,
//                 event.location?.city,
//               ]
//                 .filter(Boolean)
//                 .join(", ") || "TBA"}
//             </span>
//           </div>
//         </div>

//         {event.organizer?.name ? (
//           <p className="text-xs text-muted-foreground">
//             Organized by {event.organizer.name}
//             {event.organizer.verified ? " · Verified" : ""}
//           </p>
//         ) : null}
//       </CardContent>

//       <CardFooter>
//         <Button
//           variant="outline"
//           className="w-full bg-[#EB7036] rounded"
//           render={<Link href={`/upcoming/${event._id}`} />}
//         >
//           <Eye className="size-4" />
//           View Event
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// type Props = {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };

// const UpComingPage = async ({ searchParams }: Props) => {
//   // 🔑 Next 15 এ searchParams Promise; Next 14 এ plain object — await দুটোতেই কাজ করে
//   const params = await searchParams;
//   const search = typeof params?.search === "string" ? params.search : "";

//   let allEvents: Event[] = [];

//   try {
//     // ✅ search থাকলে backend URL এ forward করো
//     const url = search
//       ? `${process.env.NEXT_PUBLIC_SERVER_URL}/upcoming?search=${encodeURIComponent(search)}`
//       : `${process.env.NEXT_PUBLIC_SERVER_URL}/upcoming`;

//     const res = await fetch(url, { cache: "no-store" });
//     const data = await res.json();
//     allEvents = Array.isArray(data) ? data : [];
//   } catch (error) {
//     console.error("Failed to load upcoming events", error);
//   }

//   return (
//     <section className="container mx-auto flex flex-col gap-6 px-4 py-10">
//       <div className="flex flex-col gap-1">
//         <h1 className="text-3xl font-bold">Upcoming Events</h1>
//         <p className="text-muted-foreground">
//           {search
//             ? `${allEvents.length} result${allEvents.length === 1 ? "" : "s"} for "${search}"`
//             : `${allEvents.length} events are waiting for you`}
//         </p>
//       </div>

//       {/* ✅ Suspense wrapper — SearchBar এ useSearchParams থাকায় Next 13+ এ mandatory */}
//       <div>
//         <Suspense fallback={<div className="h-14 w-full" />}>
//           <SearchBar />
//         </Suspense>
//       </div>

//       {allEvents.length === 0 ? (
//         <p className="text-muted-foreground">
//           {search
//             ? `No events found for "${search}".`
//             : "No upcoming events found."}
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {allEvents.map((event) => (
//             <EventCard key={event._id} event={event} />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default UpComingPage;




