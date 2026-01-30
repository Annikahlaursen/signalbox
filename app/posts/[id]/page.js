import PostCard from "@/components/PostCard";
import DeletePostButton from "@/components/DeletePostButton";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PostPage({ params }) {
  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post = await response.json();

  // Server Action to handle post deletion
  async function deletePost() {
    "use server"; // Mark as server action - runs on server only
    const response = await fetch(url, {
      method: "DELETE"
    });
    if (response.ok) {
      redirect("/posts");
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-10 px-5">
      <div className="max-w-[800px] mx-auto py-10 px-5">
        <h1 className="text-[32px] font-semibold mb-6 text-[#ededed] tracking-tight">{post.caption}</h1>
        <div className="bg-[#2a2a2a] p-6 rounded-xl mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <PostCard post={post} />
        </div>
        <div className="flex gap-4 mt-5">
          <DeletePostButton deleteAction={deletePost} />
          <Link href={`/posts/${id}/update`}>
            <button className="px-6 py-3 border-none rounded-lg text-base font-medium cursor-pointer transition-all bg-[#ededed] text-black hover:opacity-85 hover:-translate-y-px">
              Update post
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
