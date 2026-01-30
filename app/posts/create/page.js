import { redirect } from "next/navigation";
import FormPost from "@/components/FormPost";
import styles from "./page.module.css";
import { requireAuth } from "@/lib/auth-actions";

export default async function CreatePage() {
  const user = await requireAuth(); // Require authentication
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts.json`; // Get Firebase Realtime Database URL

  // Server Action to handle post creation
  async function createPost(formData) {
    "use server"; // Mark as server action - runs on server only
    const caption = formData.get("caption");
    const image = formData.get("image");

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        caption,
        image,
        uid: user.uid, // Use authenticated user's ID
        createdAt: new Date().toISOString() // Add creation timestamp
      })
    });

    if (response.ok) {
      redirect("/posts");
    }
  }

  return (
    <section className={styles.formPage}>
      <div className={styles.container}>
        <h1>Create New Post</h1>
        <FormPost action={createPost} />
      </div>
    </section>
  );
}
