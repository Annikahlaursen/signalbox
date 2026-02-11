"use client";

import { useState } from "react";
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
      // Replace with your WordPress site URL
      const wordpressUrl =
        process.env.NEXT_PUBLIC_WORDPRESS_URL ||
        "https://great-northern-games.com/";

      const response = await fetch(
        `${wordpressUrl}/wp-json/contact-form-7/v1/contact-forms/YOUR_FORM_ID/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Tak! Du er nu tilmeldt playtest.");
        setEmail("");
      } else {
        throw new Error(data.message || "Noget gik galt");
      }
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
