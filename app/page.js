import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <Image className={styles.logo} src="/next.svg" alt="Next.js logo" width={180} height={37} priority />
        <h1 className={styles.title}>Next.js Post App</h1>
        <p className={styles.description}>
          A modern post app built with Next.js 16, featuring Server Components, Server Actions, and Firebase
          integration.
        </p>
        <div className={styles.ctas}>
          <Link href="/posts" className={styles.primaryButton}>
            View Posts
          </Link>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryButton}>
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
