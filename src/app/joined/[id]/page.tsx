// src/app/joined/[id]/page.tsx
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import JoinedEventDetailsCard from '@/components/joined/JoinedEventDetailsCard';
import type { JoinedEvent } from '@/types/event';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JoinedEventDetailsPage({ params }: PageProps) {
  const { id } = await params;

//   const session = await auth.api.getSession({ headers: await headers() });
//  const user = session?.user
//   if (!session) {
//     return (
//       <section className="container mx-auto px-4 py-10 text-center">
//         <h1 className="text-xl font-bold">Please log in</h1>
//         <p className="text-muted-foreground mt-2">
//           You need to be logged in to view this joined event.
//         </p>
//       </section>
//     );
//   }

//   const token = session.session.token;

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/joined/${user?.id}`,
//     {
//       cache: 'no-store',
//       headers: { authorization: `Bearer ${token}` },
//     }
//   );
// my code
const session = await auth.api.getSession({
    headers: await headers(),
  });
 const user = session?.user
   if (!user) {
    console.error("No session found");
    return <div>Unauthorized: Please login</div>;
  }
  const tokenObjData = await auth.api.getToken({
          headers: await headers()
      })
       console.log(tokenObjData, "AlreadyJoinedTokenData")
  
  const res = await fetch (`${process.env.NEXT_PUBLIC_SERVER_URL}/joined/${user?.id}`,
    { cache: 'no-store',
         headers: {
        authorization: `Bearer ${tokenObjData.token}`,
      },

     }
  );

  if (res.status === 401) {
    return (
      <section className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-xl font-bold">Session expired</h1>
        <p className="text-muted-foreground mt-2">Please log in again.</p>
      </section>
    );
  }

  if (res.status === 404) {
    return <p className="text-center py-10">Joined event not found</p>;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch joined event: ${res.status}`);
  }

  const text = await res.text();
  if (!text) {
    return <p className="text-center py-10">Empty response from server</p>;
  }

  const payload = JSON.parse(text);

  // একক object অথবা array — দুটোই সেফভাবে হ্যান্ডল
  const joinedEvent: JoinedEvent | null = Array.isArray(payload)
    ? payload.find((e: JoinedEvent) => e._id === id) ?? null
    : payload;

  if (!joinedEvent) {
    return <p className="text-center py-10">Joined event not found</p>;
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <JoinedEventDetailsCard event={joinedEvent} />
    </section>
  );
}






// import JoinedEventDetailsCard from '@/components/joined/JoinedEventDetailsCard'; // নতুন ডিটেইলস কম্পোনেন্ট
// import { auth } from '@/lib/auth';
// import type { JoinedEvent } from '@/types/event';
// import { headers } from 'next/headers';

// interface PageProps {
//   params: { id: string };
// }

// export default async function JoinedEventDetailsPage({ params }: PageProps) {
//   const { id } = await params; // Next.js 15+ হলে await লাগবে

// const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//  const user = session?.user
//    if (!user) {
//     console.error("No session found");
//     return <div>Unauthorized: Please login</div>;
//   }
//   const tokenObjData = await auth.api.getToken({
//           headers: await headers()
//       })
//        console.log(tokenObjData, "AlreadyJoinedTokenData")
  
//   const res = await fetch (`${process.env.NEXT_PUBLIC_SERVER_URL}/joined/${user?.id}`,
//     { cache: 'no-store',
//          headers: {
//         authorization: `Bearer ${tokenObjData.token}`,
//       },

//      }
//   );

//   // 404 হলে ক্র্যাশ নয়, সরাসরি মেসেজ
//   if (res.status === 404) {
//     return (
//       <section className="container mx-auto px-4 py-10 text-center">
//         <h1 className="text-xl font-bold">Joined Event Not Found</h1>
//         <p className="text-muted-foreground">ID: {id}</p>
//       </section>
//     );
//   }

//   if (!res.ok) {
//     throw new Error(`Failed to fetch joined event: ${res.status}`);
//   }

//   const text = await res.text();
//   if (!text) {
//     return <p className="text-center py-10">Empty response from server</p>;
//   }

//   const joinedEvent = JSON.parse(text) as JoinedEvent | null;
//   if (!joinedEvent) {
//     return <p className="text-center py-10">Joined event not found</p>;
//   }

//   return (
//     <section className="container mx-auto px-4 py-10">
//       <JoinedEventDetailsCard event={joinedEvent} />
//     </section>
//   );
// }