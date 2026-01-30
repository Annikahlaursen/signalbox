"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./page.module.css";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const userCredential = await signUp(email, password);
      const user = userCredential.user;

      // Gem brugerdata i databasen
      const userUrl = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${user.uid}.json`;
      await fetch(userUrl, {
        method: "PUT",
        body: JSON.stringify({
          email: user.email,
          name: name.trim(),
          title: title.trim(),
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          createdAt: new Date().toISOString()
        })
      });

      router.push("/posts");
    } catch (error) {
      // Brugervenlige error beskeder
      if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters");
      } else {
        setError("Failed to create account. Please try again");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.authPage}>
      <div className={styles.container}>
        <h1>Sign Up</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="din@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Dit navn"
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
              placeholder="Din titel"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link href="/signin">Sign In</Link>
        </p>
      </div>
    </main>
  );
}
