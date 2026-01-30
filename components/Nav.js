// Client Component - needed for usePathname hook
"use client"; // Mark as client component

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

export default function Nav() {
  // Get current pathname to highlight active link
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link href="/" className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}>
        Home
      </Link>
      <Link href="/posts" className={`${styles.navLink} ${pathname === "/posts" ? styles.active : ""}`}>
        Posts
      </Link>
      <Link href="/posts/create" className={`${styles.navLink} ${pathname === "/posts/create" ? styles.active : ""}`}>
        New Post
      </Link>
    </nav>
  );
}
