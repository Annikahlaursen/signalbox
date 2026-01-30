// Client Component - needed for useState to manage image preview
"use client"; // Mark as client component

import Image from "next/image";
import { useState } from "react";
import { Post } from "@/types/types";

interface FormPostProps {
  action: (formData: FormData) => void;
  post?: Post;
}

export default function FormPost({ action, post }: FormPostProps) {
  // Local state for image preview
  const [image, setImage] = useState(post?.image);

  return (
    // Form uses Server Action passed as prop
    <form action={action} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-start max-w-[800px] my-5">
      <label htmlFor="caption" className="font-medium md:pt-3 text-[#ededed]">
        Caption
      </label>
      <input
        id="caption"
        name="caption"
        type="text"
        aria-label="caption"
        placeholder="Write a caption..."
        defaultValue={post?.caption}
        className="w-full p-3 border border-gray-700 rounded-lg text-base font-[inherit] bg-[#1a1a1a] text-[#ededed] transition-colors focus:outline-none focus:border-[#ededed] focus:shadow-[0_0_0_3px_rgba(237,237,237,0.1)]"
      />
      <label htmlFor="image" className="font-medium md:pt-3 text-[#ededed]">
        Image
      </label>
      <input
        type="url"
        name="image"
        id="image"
        defaultValue={post?.image}
        aria-label="image"
        placeholder="Paste an image URL"
        onChange={event => setImage(event.target.value)}
        className="w-full p-3 border border-gray-700 rounded-lg text-base font-[inherit] bg-[#1a1a1a] text-[#ededed] transition-colors focus:outline-none focus:border-[#ededed] focus:shadow-[0_0_0_3px_rgba(237,237,237,0.1)]"
      />
      <label htmlFor="image-preview" className="hidden md:block"></label>
      {/* Live image preview */}
      <Image
        id="image-preview"
        className="w-full h-auto rounded-lg md:col-start-2"
        src={image ? image : "https://placehold.co/600x400.webp?text=Paste+image+URL"}
        width={600}
        height={400}
        alt={post?.caption || "Image preview"}
      />
      <div className="md:col-start-2 flex gap-4 mt-5">
        <button className="px-6 py-3 border-none rounded-lg text-base font-medium cursor-pointer transition-all bg-[#ededed] text-black hover:opacity-85 hover:-translate-y-px">
          {post?.caption ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
