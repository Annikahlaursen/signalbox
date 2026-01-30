"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Nav.module.css";

export default function Nav() {
  const pathname = usePathname();
  const { user, logOut } = useAuth();

  async function handleLogout() {
    try {
      await logOut();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }

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
            <span className={styles.userEmail}>{user.email}</span>
            <Link href="/profile" className={`${styles.authButton} ${styles.profileButton}`}>
              Profile
            </Link>
            <button onClick={handleLogout} className={`${styles.authButton} ${styles.logOutButton}`}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className={`${styles.authButton} ${styles.signInButton}`}>
              Sign In
            </Link>
            <Link href="/signup" className={`${styles.authButton} ${styles.signUpButton}`}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
