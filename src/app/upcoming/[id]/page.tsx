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

if (!res.ok) {
  throw new Error(`Failed to fetch event: ${res.status}`);
}
const detailsEvent = (await res.json()) as Event;
console.log(detailsEvent,"single event detail")

    return (
        <section className="container mx-auto px-4 py-10">
            <EventDetailsCard event={detailsEvent} />
        </section>
    );
};

export default EventDetailsPage;