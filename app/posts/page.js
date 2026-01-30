import PostCard from "@/components/PostCard";
import Link from "next/link";

// Server Component
export default async function Home() {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts.json`;
  const response = await fetch(url);
  const dataObject = await response.json();

  const posts = Object.keys(dataObject).map(key => ({
    id: key,
    ...dataObject[key]
  })); // Convert object to array
  console.log(posts);

  return (
    <main className="min-h-screen pt-20 pb-10 px-5">
      <div className="max-w-[1400px] mx-auto px-5">
        <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 py-5">
          {posts.map(post => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <PostCard post={post} />
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
