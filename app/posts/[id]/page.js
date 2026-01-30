import DeletePostButton from "@/components/DeletePostButton";
import PostCard from "@/components/PostCard";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function PostPage({ params }) {
  const user = await requireAuth().catch(() => redirect("/signin")); // ← Beskyt med auth

  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post = await response.json();

  const isOwner = user && user.uid === post.uid;

  // Server Action to handle post deletion
  async function deletePost() {
    "use server"; // Mark as server action - runs on server only

    if (!isOwner) {
      redirect("/posts"); // ❌ Forhindre sletning af andres posts
    }

    const response = await fetch(url, {
      method: "DELETE"
    });
    if (response.ok) {
      redirect("/posts");
    }
  }

  return (
    <main className={styles.postPage}>
      <div className={styles.container}>
        <h1>{post.caption}</h1>
        <div className={styles.postCard}>
          <PostCard post={post} />
        </div>
        {isOwner && (
          <div className={styles.btns}>
            <DeletePostButton deleteAction={deletePost} />
            <Link href={`/posts/${id}/update`}>
              <button className={styles.btnUpdate}>Update post</button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
