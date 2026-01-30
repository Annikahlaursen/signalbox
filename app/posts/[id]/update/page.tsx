import FormPost from "@/components/FormPost";
import { redirect } from "next/navigation";
import { Post } from "@/types/types";

interface UpdatePageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post: Post = await response.json();

  // Server Action to handle post update
  async function updatePost(formData: FormData) {
    "use server"; // Mark as server action - runs on server only
    const caption = formData.get("caption") as string;
    const image = formData.get("image") as string;

    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify({ caption, image })
    });

    if (response.ok) {
      redirect(`/posts/${id}`);
    }
  }

  return (
    <section className="min-h-screen pt-20 pb-10 px-5">
      <div className="max-w-[900px] mx-auto py-10 px-5">
        <h1 className="text-[32px] font-semibold mb-6 text-[#ededed] tracking-tight">Update Post</h1>
        <FormPost action={updatePost} post={post} />
      </div>
    </section>
  );
}
