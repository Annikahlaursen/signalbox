// Client Component - needed for usePathname hook
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { handleSignOut } from "@/lib/auth-actions";
import styles from "./Nav.module.css";

export default function Nav({ user }) {
  // Get current pathname to highlight active link
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.navLinks}>
        <Link href="/" className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}>
          Home
        </Link>
        <Link href="/posts" className={`${styles.navLink} ${pathname === "/posts" ? styles.active : ""}`}>
          Posts
        </Link>
        {user && (
          <Link
            href="/posts/create"
            className={`${styles.navLink} ${pathname === "/posts/create" ? styles.active : ""}`}>
            New Post
          </Link>
        )}
      </div>

      <div className={styles.authSection}>
        {user ? (
          <>
            <span className={styles.userEmail}>{user.name || user.email}</span>
            <Link href="/profile" className={`${styles.authButton} ${styles.profileButton}`}>
              Profile
            </Link>
            <form action={handleSignOut}>
              <button type="submit" className={`${styles.authButton} ${styles.logOutButton}`}>
                Log Out
              </button>
            </form>
          </>
        ) : (
          <Link href="/signin" className={`${styles.authButton} ${styles.signInButton}`}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
