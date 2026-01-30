import { handleSignIn } from "@/lib/auth-actions";
import styles from "./page.module.css";

export default function SignInPage() {
  return (
    <main className={styles.authPage}>
      <div className={styles.container}>
        <h1>Sign In</h1>

        <form action={handleSignIn} className={styles.form}>
          <button type="submit" className={styles.submitButton}>
            Sign in with GitHub
          </button>
        </form>
      </div>
    </main>
  );
}
