// Server Component - no "use client" needed
import Image from "next/image";
import UserAvatar from "./UserAvatar";

export default function PostCard({ post }) {
  return (
    <article className="flex flex-col gap-3 p-5 rounded-xl bg-[#2a2a2a] transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
      {/* Async Server Component inside */}
      <UserAvatar uid={post.uid} />
      <Image
        src={post.image}
        alt={post.caption}
        className="w-full h-[250px] object-cover rounded-lg"
        width={500}
        height={500}
      />
      <h3 className="text-base font-medium text-[#ededed] mt-1 leading-relaxed">{post.caption}</h3>
    </article>
  );
}
