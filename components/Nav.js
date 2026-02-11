// Client Component - needed for usePathname hook
"use client"; // Mark as client component

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

export default function Nav() {
  // Get current pathname to highlight active link
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.navLeft}>
        <Link href="/" className={styles.logo}>
          SignalBox
        </Link>
      </div>
      <button
        type="button"
        className={styles.burgerButton}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
      </button>
      <div className={styles.navCenter}>
        <Link
          href="/help-us"
          className={`${styles.navLink} ${pathname === "/help-us" ? styles.active : ""}`}
        >
          Help us
        </Link>
        <Link
          href="/playtest"
          className={`${styles.navLink} ${pathname === "/playtest" ? styles.active : ""}`}
        >
          Playtest
        </Link>
        <Link
          href="/waitinglist"
          className={`${styles.navLink} ${pathname === "/waitinglist" ? styles.active : ""}`}
        >
          Waitinglist
        </Link>
        <Link
          href="/about-us"
          className={`${styles.navLink} ${pathname === "/about-us" ? styles.active : ""}`}
        >
          About us
        </Link>
        <Link
          href="/newsfeed"
          className={`${styles.navLink} ${pathname === "/newsfeed" ? styles.active : ""}`}
        >
          Newsfeed
        </Link>
      </div>
      <div className={styles.navRight}>
        <a
          href="https://discord.gg/your-invite"
          className={styles.discordButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect Discord
        </a>
      </div>
      <div
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}
        onClick={handleCloseMenu}
      >
        <div
          className={styles.mobileMenuInner}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={styles.mobileCloseButton}
            aria-label="Close menu"
            onClick={handleCloseMenu}
          >
            ×
          </button>
          <div className={styles.mobileMenuContent}>
            <Link
              href="/help-us"
              className={`${styles.mobileLink} ${pathname === "/help-us" ? styles.active : ""}`}
              onClick={handleCloseMenu}
            >
              Help us
            </Link>
            <Link
              href="/playtest"
              className={`${styles.mobileLink} ${pathname === "/playtest" ? styles.active : ""}`}
              onClick={handleCloseMenu}
            >
              Playtest
            </Link>
            <Link
              href="/waitinglist"
              className={`${styles.mobileLink} ${pathname === "/waitinglist" ? styles.active : ""}`}
              onClick={handleCloseMenu}
            >
              Waitinglist
            </Link>
            <Link
              href="/about-us"
              className={`${styles.mobileLink} ${pathname === "/about-us" ? styles.active : ""}`}
              onClick={handleCloseMenu}
            >
              About us
            </Link>
            <Link
              href="/newsfeed"
              className={`${styles.mobileLink} ${pathname === "/newsfeed" ? styles.active : ""}`}
              onClick={handleCloseMenu}
            >
              Newsfeed
            </Link>
            <a
              href="https://discord.gg/your-invite"
              className={styles.mobileCta}
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect Discord
            </a>
          </div>
          <div className={styles.mobileSocials}>
            <a
              href="https://discord.gg/your-invite"
              className={styles.mobileSocialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
            <a
              href="https://instagram.com"
              className={styles.mobileSocialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://x.com"
              className={styles.mobileSocialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
