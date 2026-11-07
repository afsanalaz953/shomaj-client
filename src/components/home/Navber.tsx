"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import DropDownHover from "@/components/home/DropDownHover";
import { Button } from "../ui/button";
import ThemeToggle from "@/components/shared/ThemeToggle"

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href:string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const links = [
    { href: "/", label: "Home" },
    { href: "/upcoming", label: "Upcoming" },
    // { href: "/profile", label: "My Profile" },
    // { href: "/products", label: "Products" },
  ];

  // Helper to close the menu
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full py-2 border-b border-base-300 bg-[#D9EF78] backdrop-blur-md shadow-sm">
     <div className="flex justify-between container mx-auto">
        <div className="navbar grid grid-cols-3 gap-25 container mx-auto px-4">
        {/* ================= LEFT ================= */}
        <div className="navbar-start gap-2">
          {/* ---- Mobile hamburger ---- */}
          <div className={`dropdown md:hidden ${open ? "dropdown-open" : ""}`}>
            <button
              className="btn btn-ghost btn-square"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* ---- Mobile dropdown menu ---- */}
            <ul className="menu bg-[#087C7E] dropdown-content text-white mt-3 w-64 rounded-box  p-2 shadow-lg border border-base-300">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenu} // ✅ Close menu on link click
                    className={
                      isActive(href)
                        ? "active text-white font-semibold"
                        : ""
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}

              <div className="divider my-1" />

              {/* ---- Mobile auth section ---- */}
              {isPending ? (
                <li className="flex justify-center p-2">
                  <span className="loading loading-spinner text-success" />
                </li>
              ) : user ? (
                <>
                  <li className="px-3 py-1 text-sm opacity-70 text-white truncate">
                    Hi, {user.name}
                  </li>
                  <li>
                    <Button
                      onClick={async () => {
                        await authClient.signOut();
                        closeMenu(); // ✅ Already handled
                         router.push("/");
                         router.refresh(); 
                      }}
                       className="text-white font-medium"
                    >
                      Sign Out
                    </Button>
                  </li>
                </>
              ) : (
                <>
                 
                  <li>
                    <Button>
                    <Link href="/signup" onClick={closeMenu} className="text-[#EB7036] font-medium">
                      Sign Up
                    </Link>
                    </Button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* ---- Logo ---- */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/offset-colour-leaves_78370-6228.avif"
              alt="Serein Furniture Hub logo"
              width={50}
              height={50}
              className="rounded-full object-cover bg-[#D9EF78]"
            />
            <div>
              <p className="text-3xl font-bold tracking-widest  hover:text-white">shomaj.</p>
              {/* <p className="font-bold text-2xl leading-none">Shomaj.</p> */}
              <p className="text-[#087C7E] text-sm">Social Events Hub</p>
            </div>
          </Link>
        </div>

        {/* ============ CENTER (desktop links) ============ */}
        <div className="navbar-center hidden md:flex">
          <ul className="flex gap-6">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`pb-1 transition-colors hover:text-[#087C7E] ${
                    isActive(href) ? "border-b-4 border-b-cyan-600" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ============ RIGHT (desktop auth) ============ */}
        <div className="navbar-end hidden md:flex gap-2">
          {isPending ? (
            <span className="loading loading-spinner text-success" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <DropDownHover />
              <Button
                className="btn bg-[#087C7E] text-white hover:bg-[#066567]"
                onClick={async () =>{ await authClient.signOut();
                   router.push("/");
                   router.refresh(); 
                }}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
               <button> 
              <Link
                href="/signin"
                className=" bg-[#EB7036] rounded-full p-2 text-white hover:bg-[#EB7036]"
              >
                Sign in
              </Link>
             </button>
              <button>
              <Link
                href="/signup"
                className=" bg-[#EB7036] rounded-full p-2 text-white hover:bg-[#EB7036]"
              >
                Sign Up
              </Link>
              </button>
              
             
            </div>
          )}
        </div>
      
       
      </div>

      <div className="mt-2 mr-4">
          <ThemeToggle />
        </div>
     </div>
     
        
    </header>
  );
};

export default Navbar;







