"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/wordpress";
import styles from "../app/page.module.css";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await submitContactForm(email);
      setStatus("success");
      setMessage("Tak! Du er nu tilmeldt playtest.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Der skete en fejl. Prøv igen senere.");
    }
  };

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          placeholder="Din email"
          aria-label="Din email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sender..." : "Send"}
        </button>
      </div>
      {message && (
        <p
          className={
            status === "success" ? styles.successMessage : styles.errorMessage
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}
