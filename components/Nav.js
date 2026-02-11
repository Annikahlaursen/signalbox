// Client Component - needed for usePathname hook
"use client"; // Mark as client component

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  // Get current pathname to highlight active link
  const pathname = usePathname();

  const linkBaseClasses =
    "rounded-lg px-4 py-2 font-medium transition-colors hover:bg-[var(--background)] text-[var(--text-primary)]";
  const linkActiveClasses = "bg-[var(--background)]";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between gap-8 border-b border-[var(--border-color)] bg-[var(--foreground)] px-5 py-5">
      <div className="flex min-w-[180px] items-center">
        <a
          href="https://discord.gg/your-invite"
          className="rounded-full bg-[#5865f2] px-4 py-2 font-semibold text-white shadow-[0_6px_16px_rgba(88,101,242,0.25)] transition hover:translate-y-[-1px] hover:opacity-95"
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect Discord
        </a>
      </div>
      <div className="flex flex-1 justify-center gap-8">
        <Link
          href="/help-us"
          className={`${linkBaseClasses} ${pathname === "/help-us" ? linkActiveClasses : ""}`}
        >
          Help us
        </Link>
        <Link
          href="/playtest"
          className={`${linkBaseClasses} ${pathname === "/playtest" ? linkActiveClasses : ""}`}
        >
          Playtest
        </Link>
        <Link
          href="/waitinglist"
          className={`${linkBaseClasses} ${pathname === "/waitinglist" ? linkActiveClasses : ""}`}
        >
          Waitinglist
        </Link>
        <Link
          href="/about-us"
          className={`${linkBaseClasses} ${pathname === "/about-us" ? linkActiveClasses : ""}`}
        >
          About us
        </Link>
        <Link
          href="/newsfeed"
          className={`${linkBaseClasses} ${pathname === "/newsfeed" ? linkActiveClasses : ""}`}
        >
          Newsfeed
        </Link>
      </div>
    </nav>
  );
}
