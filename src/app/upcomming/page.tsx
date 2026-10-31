import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Eye, MapPin } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/types/event";

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
          className="h-48 w-full object-cover rounded "
          loading="lazy"
        />
      ) : null}
             {event.category ? (
          <Badge variant="outline" className="absolute top-4 right-4 p-4  bg-[#b9d82f]">{event.category}</Badge>
        ) : null}
        </div>
      {/* {event.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      ) : null} */}

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-2xl">{event.title}</CardTitle>
          {/* <Badge variant={isFull ? "destructive" : "secondary"}>
            {event.status ?? (isFull ? "full" : "upcoming")}
          </Badge> */}
        </div>
        {/* <CardDescription className="line-clamp-3">
          {event.description}
        </CardDescription> */}
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* {event.category ? (
          <Badge variant="outline">{event.category}</Badge>
        ) : null} */}

        <div className="flex flex-col gap-2 text-sm text-muted-foreground ">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-lg text-orange-700 shrink-0" />
            <span className="text-orange-700 font-bold">{formatDate(event.date)}</span>
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
              {[event.location?.venue, event.location?.area, event.location?.city]
                .filter(Boolean)
                .join(", ") || "TBA"}
            </span>
          </div>

          {/* <div className="flex items-center gap-2">
            <Users className="size-4 shrink-0" />
            <span>
              {registered}/{capacity || "?"} joined
              {capacity > 0 && !isFull ? ` · ${seatsLeft} seats left` : ""}
            </span>
          </div> */}
        </div>

        {event.organizer?.name ? (
          <p className="text-xs text-muted-foreground">
            Organized by {event.organizer.name}
            {event.organizer.verified ? " · Verified" : ""}
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="">
        <Button
          variant="outline"
          className="w-full bg-[#EB7036] rounded"
          render={<Link href={`/event/${event._id}`} />}
        >
          <Eye className="size-4" />
          View Event
        </Button>
        {/* <Button className="w-full bg-[#087C7E] text-white hover:bg-[#066567]" disabled={isFull}>
          {isFull ? "Registration Full" : "Join Event"}
        </Button> */}
      </CardFooter>
    </Card>
  );
};

const UpCommingPage = async () => {
  let allEvents: Event[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/upcomming`, {
      cache: "no-store",
      //   headers:{
      //     authorization: `Bearer ${tokenObjData.token}`
      //      }
    });
    const data = await res.json();
    allEvents = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load upcoming events", error);
  }

  return (
    <section className="container mx-auto flex flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <p className="text-muted-foreground">
          {allEvents.length} events are waiting for you
        </p>
      </div>

      {allEvents.length === 0 ? (
        <p className="text-muted-foreground">No upcoming events found.</p>
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

export default UpCommingPage;
