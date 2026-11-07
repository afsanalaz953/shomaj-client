import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';
import JoinedEventGrid from '@/components/joined/JoinedEventGrid';
import type { JoinedEvent } from '@/types/event';

const JoinEventPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    console.error('No session found');
    return <div>Unauthorized: Please login</div>;
  }
  // server-side a token
  const tokenObjData = await auth.api.getToken({
        headers: await headers()
    })
     console.log(tokenObjData, "joinedTokenData")

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/joined/${user.id}`,
    { cache: 'no-store',
      headers:{
    authorization: `Bearer ${tokenObjData.token}`
     } 

    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API error ${res.status}: ${errorText}`);
    return <div>Failed to load joinedevents</div>;
  }

  const myJoinedEventList: JoinedEvent[] = await res.json();

  const joinedTime = (event: JoinedEvent) => {
    const time = event.joinedAt ? Date.parse(event.joinedAt) : Number.NaN;
    return Number.isNaN(time) ? 0 : time;
  };

  const sortedJoinedEvents = [...myJoinedEventList].sort(
    (a, b) => joinedTime(a) - joinedTime(b),
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
      <div className="mb-10 flex flex-col items-start gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-[#EB7036]" />
            <p className="text-[0.7rem] font-semibold tracking-[0.35em] text-[#EB7036] uppercase">
              Events you signed up for
            </p>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-[#1F3D2B] md:text-4xl">
            My Joined Events
          </h1>
          <p className="leading-relaxed text-muted-foreground">
            Every event you have joined, starting with the ones you joined
            first — each card shows when you joined it.
          </p>
        </div>
      </div>

      <JoinedEventGrid events={sortedJoinedEvents} />
    </section>
  );
};

export default JoinEventPage;





