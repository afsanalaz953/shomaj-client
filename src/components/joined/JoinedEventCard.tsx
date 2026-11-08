// src/components/JoinedEventCard.tsx
import Link from "next/link";
import { CalendarCheck, Eye, MapPin } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import type { JoinedEvent } from "@/types/event";

function formatEventLocation(location?: JoinedEvent["location"]) {
  const parts = [location?.venue, location?.area, location?.city].filter(
    (part): part is string => Boolean(part)
  );
  return parts.length > 0 ? parts.join(", ") : "Location to be announced";
}

function formatJoinedDate(joinedAt?: string) {
  if (!joinedAt) return null;
  const parsed = parseISO(joinedAt);
  return isValid(parsed) ? format(parsed, "MMM d, yyyy") : joinedAt;
}

interface JoinedEventCardProps {
  event: JoinedEvent;
}

const JoinedEventCard = ({ event }: JoinedEventCardProps) => {
  const joinedDate = formatJoinedDate(event.joinedAt);

  return (
    <Card className="group h-full gap-0 overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-xl">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl || "/placeholder.svg"}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {event.category ? (
          <Badge className="absolute top-4 right-4 bg-[#D9F265] px-3 py-4 text-xs font-semibold text-[#1F3D2B]">
            {event.category}
          </Badge>
        ) : null}
      </div>

      <CardContent className="flex flex-1 flex-col gap-4 pt-5 pb-5">
        <CardTitle className="text-xl leading-snug font-bold">
          {event.title}
        </CardTitle>

        <div className="flex items-center gap-3">
          <CalendarCheck className="size-5 shrink-0 text-[#087C7E]" />
          <span className="text-sm font-semibold text-[#087C7E]">
            Joined {joinedDate ? `on ${joinedDate}` : "—"}
          </span>
        </div>

        <div className="flex items-start gap-3 text-muted-foreground">
          <MapPin className="mt-0.5 size-5 shrink-0" />
          <span className="text-sm">{formatEventLocation(event.location)}</span>
        </div>

        <CardDescription className="line-clamp-3 leading-relaxed">
          {event.description || "No description was provided for this event."}
        </CardDescription>
      </CardContent>

      <CardFooter className="border-t bg-transparent p-4">
        <Link
          href={`/joined/${event._id}`}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "h-11 w-full gap-2 rounded-xl bg-[#EB7036] text-sm font-semibold text-white hover:bg-[#d95f27]"
          )}
        >
          <Eye className="size-4" />
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JoinedEventCard;





// "use client";

// import Link from "next/link";
// import { CalendarCheck, Eye, MapPin } from "lucide-react";
// import { format, isValid, parseISO } from "date-fns";
// import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// import { buttonVariants } from "@/components/ui/button"; 
// import { cn } from "@/lib/utils"; 
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardTitle,
// } from "@/components/ui/card";
// import type { JoinedEvent } from "@/types/event";

// function formatEventLocation(location?: JoinedEvent["location"]) {
//   const parts = [location?.venue, location?.area, location?.city].filter(
//     (part): part is string => Boolean(part),
//   );
//   return parts.length > 0 ? parts.join(", ") : "Location to be announced";
// }

// /** Returns the joined date, or `null` when the API did not send one. */
// function formatJoinedDate(joinedAt?: string) {
//   if (!joinedAt) return null;
//   const parsed = parseISO(joinedAt);
//   return isValid(parsed) ? format(parsed, "MMM d, yyyy") : joinedAt;
// }

// interface JoinedEventCardProps {
//   event: JoinedEvent;
// }

// const JoinedEventCard = ({ event }: JoinedEventCardProps) => {
//   const joinedDate = formatJoinedDate(event.joinedAt);
// const joinedId = event._id;
// console.log('joined Id', joinedId)
//   return (
//     <Card className="group h-full gap-0 overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-xl">
//       {/* ---- Image + category ---- */}
//       <div className="relative aspect-4/3 w-full overflow-hidden">
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src={event.imageUrl ?? "/assets/banner.avif"}
//           alt={event.title}
//           loading="lazy"
//           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//         />
//         {event.category ? (
//           <Badge className="absolute top-4 right-4 bg-[#D9F265] px-3 py-4 text-xs font-semibold text-[#1F3D2B]">
//             {event.category}
//           </Badge>
//         ) : null}
//       </div>

//       {/* ---- Title, joined date, location, description ---- */}
//       <CardContent className="flex flex-1 flex-col gap-4 pt-5 pb-5">
//         <CardTitle className="text-xl leading-snug font-bold">
//           {event.title}
//         </CardTitle>

//         <div className="flex items-center gap-3">
//           <CalendarCheck className="size-5 shrink-0 text-[#087C7E]" />
//           <span className="text-sm font-semibold text-[#087C7E]">
//             Joined {joinedDate ? `on ${joinedDate}` : "—"}
//           </span>
//         </div>

//         <div className="flex items-start gap-3 text-muted-foreground">
//           <MapPin className="mt-0.5 size-5 shrink-0" />
//           <span className="text-sm">{formatEventLocation(event.location)}</span>
//         </div>

//         <CardDescription className="line-clamp-3 leading-relaxed">
//           {event.description ||
//             "No description was provided for this event."}
//         </CardDescription>
//       </CardContent>

//       {/* ---- View details button ---- */}
//       <CardFooter className="border-t bg-transparent p-4">
//         {/* <Button
//           render={<Link href={`/upcoming/${event._id }`} />}
//           //  render={<Link href={`/upcoming/${event._id}`} />}
//           className="h-11 w-full gap-2 rounded-xl bg-[#EB7036] text-sm font-semibold text-white hover:bg-[#d95f27]"
//         >
//           <Eye className="size-4" />
//           View Details
//         </Button> */}
//         <Link
//     href={`/joined/${event._id}`}
//     className={cn(
//       buttonVariants({ variant: "default", size: "lg" }),
//       "h-11 w-full gap-2 rounded-xl bg-[#EB7036] text-sm font-semibold text-white hover:bg-[#d95f27]"
//     )}
//   >
//     <Eye className="size-4" />
//     View Details
//   </Link>
//       </CardFooter>
//     </Card>
//   );
// };

// export default JoinedEventCard;
