"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }
    async function fetchUserData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${user.uid}.json`);
        const data = await response.json();
        if (data) {
          setName(data.name || "");
          setTitle(data.title || "");
          setImage(data.image || "");
        }
      } catch (error) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name.trim()) return setError("Name is required");
    if (!title.trim()) return setError("Title is required");
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${user.uid}.json`, {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim(),
          image: image.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
        })
      });
      if (response.ok) setSuccess("Profile updated successfully!");
      else setError("Failed to update profile");
    } catch (error) {
      setError("Failed to update profile. Please try again");
    } finally {
      setLoading(false);
    }
  }

  if (!user || loading) return null;

  return (
    <main className={styles.profilePage}>
      <div className={styles.container}>
        <h1>Edit Profile</h1>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Your name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Your title"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          {image && (
            <div className={styles.imagePreview}>
              <Image src={image} alt="Profile preview" width={100} height={100} />
            </div>
          )}
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
