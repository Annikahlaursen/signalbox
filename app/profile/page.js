import { requireAuth } from "@/lib/auth-actions";
import { updateUser } from "@/lib/firebase-users";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import styles from "./page.module.css";

export default async function ProfilePage() {
  const user = await requireAuth();

  async function updateProfile(formData) {
    "use server";

    const name = formData.get("name");
    const title = formData.get("title");
    const image = formData.get("image");

    // Update in Firebase
    await updateUser(user.uid, {
      name: name.trim(),
      title: title.trim(),
      image: image.trim() || user.image
    });

    revalidatePath("/");
  }

  return (
    <main className={styles.profilePage}>
      <div className={styles.container}>
        <h1>Edit Profile</h1>

        <form action={updateProfile} className={styles.form}>
          {user.image && (
            <div className={styles.imagePreview}>
              <Image src={user.image} alt={user.name || "Profile"} width={100} height={100} />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" defaultValue={user.name || ""} required placeholder="Your name" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={user.title || ""}
              required
              placeholder="Your title"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              defaultValue={user.image || ""}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className={styles.infoGroup}>
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}
