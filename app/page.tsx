import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen pt-20 pb-10 flex items-center justify-center">
      <main className="text-center max-w-[600px]">
        <h1 className="text-[32px] font-semibold mb-4 tracking-tight text-[#ededed]">Next.js Post App</h1>
        <p className="text-base text-gray-400 mb-8 leading-relaxed">
          A modern post application built with Next.js 16, featuring Server Components, Server Actions, and Firebase
          integration.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/posts"
            className="px-6 py-3 rounded-lg font-medium bg-white text-black transition-all hover:opacity-85 hover:-translate-y-px">
            View Posts
          </Link>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg font-medium border border-gray-700 text-[#ededed] transition-all hover:bg-gray-900">
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
