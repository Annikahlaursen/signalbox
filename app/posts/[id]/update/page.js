import FormPost from "@/components/FormPost";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { requireAuth } from "@/lib/auth";

export default async function UpdatePage({ params }) {
  const user = await requireAuth().catch(() => redirect("/signin")); // ← Beskyt med auth

  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post = await response.json();

  if (user.uid !== post.uid) {
    redirect("/posts");
  }

  // Server Action to handle post update
  async function updatePost(formData) {
    "use server"; // Mark as server action - runs on server only
    const caption = formData.get("caption");
    const image = formData.get("image");

    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify({ caption, image })
    });

    if (response.ok) {
      redirect(`/posts/${id}`);
    }
  }

  return (
    <section className={styles.formPage}>
      <div className={styles.container}>
        <h1>Update Post</h1>
        <FormPost action={updatePost} post={post} />
      </div>
    </section>
  );
}
