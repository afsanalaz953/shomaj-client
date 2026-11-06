"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import UpdatedProfile from "@/components/shared/UpdatedProfile";

const ProfilePage = () => {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const user = session?.user;

  /* ---------- Loading / Unauthenticated states ---------- */
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-base-100 shadow-sm m-4 p-20 text-center">
        <p className="text-xl mb-4">You are not logged in.</p>
        <Link href="/login">
          <Button color="primary">Go to Login</Button>
        </Link>
      </div>
    );
  }

  /* ---------- Avatar fallback ---------- */
  const avatarSrc: string =
    user.image ||
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
      user.name || "user"
    )}`;

  return (
    <div className="bg-base-100 shadow-sm m-4 p-20">
      <div className="card bg-base-100 w-full max-w-md mx-auto shadow-sm">
        <figure className="px-10 pt-10 flex justify-center">
          <Image
            src={avatarSrc}
            referrerPolicy="no-referrer"
            alt={user.name || "User avatar"}
            width={150}
            height={150}
            className="rounded-full object-cover"
          />
        </figure>

        <div className="card-body items-center text-center">
          <h2 className="card-title font-bold text-3xl">{user.name}</h2>
          <p className="text-lg">{user.email}</p>

          <div className="card-actions w-full flex flex-col gap-2 mt-4">
            <Button
              as={Link}
              href="/"
              variant="flat"
              className="w-full bg-blue-300"
            >
              Go Back to Home
            </Button>

            <Button
              className="w-full bg-[#D9EF78]"
              onPress={() => setIsEditOpen(true)}
            >
              Update Profile
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Modal rendered OUTSIDE the Button */}
      <UpdatedProfile
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        profile={{ userName: user.name, image: user.image }}
        refetch={refetch as () => Promise<void>}
      />
    </div>
  );
};

export default ProfilePage;



