import React from 'react';
import EventDetailsCard from '@/components/event/EventDetailsCard';
import type { Event } from '@/types/event';

interface DetailsProps {
  params: Promise<{ id: string }>;
}

const EventDetailsPage = async({params}: DetailsProps) => {
    const {id} = await params;
    console.log(id, 'id')

const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/upcoming/${id}`,{
cache:"no-store",
// headers:{
//       authorization: `Bearer ${tokenObj.token}`
//    }
});

// if (!res.ok) {
//   throw new Error(`Failed to fetch event: ${res.status}`);
// }
// const detailsEvent = (await res.json()) as Event;
// console.log(detailsEvent,"single event detail")
if (!res.ok) {
  throw new Error(`Failed to fetch event: ${res.status}`);
}

// ❶ বডি টেক্সট হিসেবে পড়ুন (খালি বডি সেফটি)
const text = await res.text();

// ❷ খালি বডি হলে সাথে সাথে এরর দিন
if (!text) {
  throw new Error("Empty response body from server");
}

const detailsEvent = JSON.parse(text) as Event | null;

// ❸ null হলে কার্ডে পাঠাবেন না
if (!detailsEvent) {
  return (
    <section className="container mx-auto px-4 py-10">
      <p className="text-center text-red-500">Event not found</p>
    </section>
  );
}

console.log(detailsEvent, "single event detail");


    return (
        <section className="container mx-auto px-4 py-10">
            <EventDetailsCard event={detailsEvent} />
        </section>
    );
};

export default EventDetailsPage;