// src/components/JoinedEventDetailsCard.tsx
import Link from "next/link";
import Image from "next/image";
import { CalendarCheck, MapPin, ArrowLeft } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JoinedEvent } from "@/types/event";

function formatJoinedDate(joinedAt?: string) {
  if (!joinedAt) return null;
  const parsed = parseISO(joinedAt);
  return isValid(parsed) ? format(parsed, "MMM d, yyyy") : joinedAt;
}

export default function JoinedEventDetailsCard({
  event,
}: {
  event: JoinedEvent;
}) {
  const joinedDate = formatJoinedDate(event.joinedAt);

  return (
    <Card className="mx-auto max-w-3xl overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
        )}

        {event.category ? (
          <Badge className="absolute top-4 right-4 z-10 bg-[#D9F265] text-xs font-semibold text-[#1F3D2B]">
            {event.category}
          </Badge>
        ) : null}
      </div>

      <CardHeader>
        <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#087C7E]">
          <CalendarCheck className="size-5" />
          Joined {joinedDate ? `on ${joinedDate}` : "—"}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-5" />
          {[event.location?.venue, event.location?.area, event.location?.city]
            .filter(Boolean)
            .join(", ") || "Location to be announced"}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-base leading-relaxed">
          {event.description || "No description was provided for this event."}
        </CardDescription>

        {typeof event.registeredCount === "number" && (
          <p className="text-sm text-muted-foreground">
            Total registered: <strong>{event.registeredCount}</strong>
          </p>
        )}
      </CardContent>

      <div className="border-t p-4">
        <Link
          href="/joined"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "gap-2"
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Joined Events
        </Link>
      </div>
    </Card>
  );
}





// // src/components/JoinedEventDetailsCard.tsx
// "use client";

// import Link from "next/link";
// import Image from 'next/image'
// import { CalendarCheck, MapPin, ArrowLeft } from "lucide-react";
// import { format, isValid, parseISO } from "date-fns";
// import { Badge } from "@/components/ui/badge";
// import { buttonVariants } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import type { JoinedEvent } from "@/types/event";

// function formatJoinedDate(joinedAt?: string) {
//   if (!joinedAt) return null;
//   const parsed = parseISO(joinedAt);
//   return isValid(parsed) ? format(parsed, "MMM d, yyyy") : joinedAt;
// }

// export default function JoinedEventDetailsCard({ event }: { event: JoinedEvent }) {
//   const joinedDate = formatJoinedDate(event.joinedAt);
// console.log(event, 'already joined event')
//   return (
//     <Card className="mx-auto max-w-3xl overflow-hidden">
//       <div className="relative aspect-video w-full overflow-hidden">
//         {/* <Image
//           src={event.imageUrl} 
//           alt={event.title}
//           className="h-full w-full object-cover"
//         /> */}
//         {event.imageUrl && (
//   <Image
//     src={event.imageUrl}
//     alt={event.title}
//     fill
//     sizes="(max-width: 768px) 100vw, 768px"
//     className="object-cover"
//   />
// )}
        
//         {event.category ? (
//           <Badge className="absolute top-4 right-4 bg-[#D9F265] text-xs font-semibold text-[#1F3D2B]">
//             {event.category}
//           </Badge>
//         ) : null}
//       </div>

//       <CardHeader>
//         <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
//         <div className="flex items-center gap-2 text-sm font-semibold text-[#087C7E]">
//           <CalendarCheck className="size-5" />
//           Joined {joinedDate ? `on ${joinedDate}` : "—"}
//         </div>
//         <div className="flex items-center gap-2 text-muted-foreground">
//           <MapPin className="size-5" />
//           {[event.location?.venue, event.location?.area, event.location?.city]
//             .filter(Boolean)
//             .join(", ") || "Location to be announced"}
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <CardDescription className="text-base leading-relaxed">
//           {event.description || "No description was provided for this event."}
//         </CardDescription>

//         {/* এখানে আপনার joined ইভেন্টের অন্যান্য ফিল্ড দেখাতে পারেন */}
//         {event.registeredCount !== undefined && (
//           <p className="text-sm text-muted-foreground">
//             Total registered: <strong>{event.registeredCount}</strong>
//           </p>
//         )}
//       </CardContent>

//       <div className="border-t p-4">
//         <Link
//           href="/joined"
//           className={cn(
//             buttonVariants({ variant: "outline", size: "lg" }),
//             "gap-2"
//           )}
//         >
//           <ArrowLeft className="size-4" />
//           Back to Joined Events
//         </Link>
//       </div>
//     </Card>
//   );
// }