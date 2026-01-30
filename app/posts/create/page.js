import { redirect } from "next/navigation";
import FormPost from "@/components/FormPost";

export default function CreatePage() {
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
        uid: "OPPe5jue2Ghxx3mtnxevB5FwCYe2", // TODO: Replace with actual user ID from auth
        createdAt: new Date().toISOString() // Add creation timestamp
      })
    });

    if (response.ok) {
      redirect("/posts");
    }
  }

  return (
    <section className="min-h-screen pt-20 pb-10 px-5">
      <div className="max-w-[900px] mx-auto py-10 px-5">
        <h1 className="text-[32px] font-semibold mb-6 text-[#ededed] tracking-tight">Create New Post</h1>
        <FormPost action={createPost} />
      </div>
    </section>
  );
}
