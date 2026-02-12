import PostCard from "@/components/PostCard";
import Link from "next/link";
import styles from "./page.module.css";
import { getWordPressPosts } from "@/lib/wordpress";

// Server Component
export default async function Home() {
  let posts = [];

  try {
    // Try to fetch from WordPress first
    const wordpressPosts = await getWordPressPosts({ per_page: 20 });
    posts = wordpressPosts.map((post) => ({
      id: post.id,
      caption: post.title.rendered,
      content: post.content.rendered,
      image: post.featured_media
        ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/media/${post.featured_media}`
        : "/placeholder.jpg",
      excerpt: post.excerpt.rendered,
      author: post._embedded?.["author"]?.[0]?.name || "Unknown",
    }));
  } catch (error) {
    console.warn("WordPress fetch failed, falling back to Firebase:", error);
    // Fallback to Firebase if WordPress fails
    try {
      const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts.json`;
      const response = await fetch(url);
      const dataObject = await response.json();
      posts = Object.keys(dataObject).map((key) => ({
        id: key,
        ...dataObject[key],
      }));
    } catch (firebaseError) {
      console.error("Both WordPress and Firebase failed:", firebaseError);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.grid}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link href={`/posts/${post.id}`} key={post.id}>
                <PostCard post={post} />
              </Link>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </section>
      </div>
    </main>
  );
}
