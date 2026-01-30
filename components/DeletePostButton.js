// Client Component - needed for useState to manage modal visibility
"use client";

import { useState } from "react";
import styles from "./DeletePostButton.module.css";

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
      <button type="button" className={styles.btnDelete} onClick={() => setShowModal(true)}>
        Delete post
      </button>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>Delete Post?</h2>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className={styles.modalButtons}>
              <button className={styles.btnCancel} onClick={() => setShowModal(false)} disabled={isDeleting}>
                Cancel
              </button>
              <button className={styles.btnConfirm} onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
