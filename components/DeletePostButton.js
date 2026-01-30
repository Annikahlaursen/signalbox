// Client Component - needed for useState to manage modal visibility
"use client";

import { useState } from "react";

export default function DeletePostButton({ deleteAction }) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    await deleteAction();
    // Redirect happens in Server Action, so no need to setIsDeleting(false)
  }

  return (
    <>
      <button
        type="button"
        className="px-6 py-3 bg-transparent text-red-500 border-2 border-red-500 rounded-lg font-medium transition-all hover:bg-red-500 hover:text-white hover:cursor-pointer"
        onClick={() => setShowModal(true)}>
        Delete post
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 animate-fadeIn"
          onClick={() => setShowModal(false)}>
          <div
            className="bg-[#2a2a2a] p-8 rounded-xl max-w-[450px] w-[90%] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] animate-slideIn"
            onClick={e => e.stopPropagation()}>
            <h2 className="m-0 mb-4 text-2xl font-semibold text-[#ededed]">Delete Post?</h2>
            <p className="m-0 mb-6 text-gray-400 leading-relaxed">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-6 py-3 rounded-lg font-medium transition-all border border-gray-700 bg-[#1a1a1a] text-[#ededed] hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                onClick={() => setShowModal(false)}
                disabled={isDeleting}>
                Cancel
              </button>
              <button
                className="px-6 py-3 rounded-lg font-medium transition-all border-none bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                onClick={handleConfirmDelete}
                disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
