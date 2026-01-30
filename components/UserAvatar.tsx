// Async Server Component - fetches user data on the server
import Image from "next/image";
import { User } from "@/types/types";

interface UserAvatarProps {
  uid: string;
}

export default async function UserAvatar({ uid }: UserAvatarProps) {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${uid}.json`;

  // Fetch user data - runs on server, not sent to client
  const response = await fetch(url);
  const user: User = await response.json();

  return (
    <div className="flex items-center gap-3 mb-3">
      <Image
        src={user.image}
        alt={user.name}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
      <span className="flex flex-col gap-0.5">
        <h3 className="text-sm font-semibold m-0 text-[#ededed] leading-tight">{user.name}</h3>
        <p className="text-xs m-0 text-gray-400 leading-tight">{user.title}</p>
      </span>
    </div>
  );
}
