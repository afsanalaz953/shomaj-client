
import { headers } from 'next/headers';
import React from 'react';
import { Table } from '@heroui/react';
// import {Button} from "@heroui/react"
import   DeleteAddingButton from "@/components/manage/DeleteButton";
import Image from "next/image";
import { auth } from '@/lib/auth';
import EditModal from '@/components/event/EditModal';



interface EventList {
  _id: string;
  imageUrl?: string;
  title: string;
  location: { venue: string };
  date: string;
  description?: string;
  category?: string;
  status?:string;
  userId?:string;
}



const ManagedPage = async() => {
const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
 });
 const user = session?.user
  // সেশন না থাকলে এরর বা রিডাইরেক্ট
  if (!user) {
    console.error("No session found");
    return <div>Unauthorized: Please login</div>;
  }
console.log(session, "myeventsession")
// server-side a token
  const tokenObjData = await auth.api.getToken({
        headers: await headers()
    })
     console.log(tokenObjData, "ManageTokenData")

const res = await fetch (`${process.env.NEXT_PUBLIC_SERVER_URL}/manage/${user?.id}`,{
  cache: 'no-store',
   headers:{
     authorization: `Bearer ${tokenObjData.token}`
      
 }
});


 if (!res.ok) {
    const errorText = await res.text();
    console.error(`API error ${res.status}: ${errorText}`);
    return <div>Failed to load events</div>;
  }


const myEventList: EventList[] = await res.json()
console.log(myEventList, "eventlist")


    return (
    <div className='container mx-auto m-20 space-y-10'>
  <h1 className='font-bold text-center lg:text-3xl'>My Event List</h1>

  {/* ✅ Empty state check – put it here */}
  {!myEventList || myEventList.length === 0 ? (
    <div className="text-center p-10 m-6 bg-gray-100 rounded-lg shadow">
      <p className="text-gray-600 text-lg"> No Events available yet.</p>
      <p className="text-gray-500">Click “Create Event” to get started.</p>
    </div>
  ) : (
    <div className=''>
      {/* <Table className=' w-min-700  bg-green-200'> */}
      <Table className="lg:w-full md:w-[760px] bg-[#F8F7F2]">
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members" className='p-3'>
            <Table.Header className="rounded bg-green-950 ">
              <Table.Column className="text-lg font-bold">Photo</Table.Column>
              <Table.Column isRowHeader className="text-lg font-bold">Event Title</Table.Column>
              <Table.Column className="text-lg font-bold">Location</Table.Column>
              <Table.Column className="text-lg font-bold" >Event Date</Table.Column>
              <Table.Column className="text-lg font-bold" >Description</Table.Column>
              <Table.Column  className="text-lg font-bold">Event type</Table.Column>
              {/* <Table.Column  className="text-lg font-bold">Description</Table.Column> */}
              <Table.Column>Status</Table.Column>
              {/* <Table.Column className="text-lg font-bold" >Session-Start-Date</Table.Column> */}
              <Table.Column className="text-lg font-bold text-center"> Action</Table.Column>
            </Table.Header>
            <Table.Body>
              {myEventList && myEventList.map((eventList: EventList) => (
                // console.log('Tutor ID:', formTutors.tutorId)
                <Table.Row key={eventList?._id}>
                  <Table.Cell>
                    <Image
                      src={eventList?.imageUrl || ""}
                      alt={eventList.title}
                      width={70}
                      height={70}
                      className="rounded-full object-cover"
                      unoptimized={true}
                    />
                  </Table.Cell>
                  <Table.Cell >{eventList.title}</Table.Cell>
                  <Table.Cell>{eventList.location?.venue}</Table.Cell>
                  <Table.Cell>{new Date(eventList?.date).toLocaleDateString()}</Table.Cell>
                  {/* <Table.Cell>{formTutors.sessionStartDate}</Table.Cell> */}
                  {/* <Table.Cell>$ {eventList.date}</Table.Cell> */}
                  <Table.Cell>{eventList.description}</Table.Cell>
                  <Table.Cell>{eventList.category}</Table.Cell>
                  <Table.Cell> {eventList.status}</Table.Cell>
                  <Table.Cell className="flex gap-3 bg-white p-8">
                    {/* <Button>  {'Edit'} </Button>  */}
                    <EditModal eventList= {eventList} />
                     < DeleteAddingButton  userId= {eventList._id} />
                   </Table.Cell> 
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  )}
</div>
);
};
    


export default ManagedPage;