"use client";




import React from 'react';
import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation';
import Image from "next/image"
import { authClient } from "@/lib/auth-client"


const DropDownHover = () => {
    const { data: session} = authClient.useSession();
    console.log (session, "session")
    
    const user = session?.user;
    console.log (user, "user");

     const router = useRouter();
     const pathname = usePathname();
        console.log (pathname, "pathname");
    
        const isActive = (href:string) =>{
           return href === pathname;
        };
    return (
        <div className="dropdown dropdown-hover">
  <div tabIndex={0} role="button" className="m-1">
     {/* <Image src={user?.image || userAvatar  } */}
     <div className="avatar flex gap-3">
    
     <div className="w-10 rounded-full">
    <Image
    alt="Tailwind-CSS-Avatar-component" 
    src= {user?.image as string}
     width={10}
      height={10} 
    />
  
  </div>   
           
  </div> 

    </div>
  <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-2 w-25 shadow-sm">
    <li className='text-cyan-800 font-bold'> {user?.name}  </li>
    <li className='text-cyan-800 font-bold'><Link href={"/create"} className={`${isActive ("/create") ? " border-b-4 border-b-cyan-600" : ""}`} >Create Event</Link></li>
    <li className='text-cyan-800 font-bold'><Link href={"/manage"} className={`${isActive ("/manage") ? " border-b-4 border-b-cyan-600" : ""}`} >Manage Event</Link></li>
    {/* <li className='text-cyan-800 font-bold'><Link href={"/profile"} className={`${isActive ("/profile") ? " border-b-4 border-b-cyan-600" : ""}`} >Profile</Link></li> */}
    
    <li> 
                    <button className='btn bg-[#087C7E] hover:text-white text-sm' 
                    onClick={async () => {
                      await authClient.signOut();
                      router.push("/");
                    }} >
                       Sign Out</button>
                       </li>
  </ul>
</div>
    );
};

export default DropDownHover;