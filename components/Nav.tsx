// Client Component - needed for usePathname hook
"use client"; // Mark as client component

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  // Get current pathname to highlight active link
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 flex justify-center gap-8 p-5 bg-[#2a2a2a] border-b border-gray-700 shadow-md z-100">
      <Link
        href="/"
        className={`px-4 py-2 rounded-lg font-medium transition-all text-[#ededed] ${
          pathname === "/" ? "bg-black" : "hover:bg-black"
        }`}>
        Home
      </Link>
      <Link
        href="/posts"
        className={`px-4 py-2 rounded-lg font-medium transition-all text-[#ededed] ${
          pathname === "/posts" ? "bg-black" : "hover:bg-black"
        }`}>
        Posts
      </Link>
      <Link
        href="/posts/create"
        className={`px-4 py-2 rounded-lg font-medium transition-all text-[#ededed] ${
          pathname === "/posts/create" ? "bg-black" : "hover:bg-black"
        }`}>
        New Post
      </Link>
    </nav>
  );
}
