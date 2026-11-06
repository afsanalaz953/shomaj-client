"use client"
import React from 'react';
import { authClient } from "@/lib/auth-client"
import Image from "next/image";
// import userAvatar from "@/assets/useravater.png"
import Link from "next/link";
import {Button} from "@heroui/react";


const ProfilePage = () => {
const { data: session} = authClient.useSession();
console.log (session, "profilesession")

const user = session?.user;
console.log (user, "profilesession");



    return (
       
          <div className='bg-base-100 shadow-sm m-4 p-20'>
              <div className="card bg-base-100 w-150 h-100 shadow-sm container mx-auto ">
  <figure className="px-10 pt-10">
      <Image src={user?.image as string}
                   referrerPolicy='no-referrer'
                 alt=" author"
                 width={150}
                 height={150} 
                 className='containner mx-auto mt-6'
                 />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title font-bold text-3xl">{user?.name}</h2>
    <p className='text-lg'> {user?.email} </p>
    <div className="card-actions">
         <Button type="submit"  className='w-full' ><Link href ={"/"} ></Link> Go Back to Home </Button>
      <Button className="bg-[#D9EF78]"><Link href= '/updateform'>Update Profile</Link></Button>
    </div>
  </div>



           
           </div>
           

        </div>
    );
};

export default ProfilePage;
