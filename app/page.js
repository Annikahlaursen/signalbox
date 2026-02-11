import styles from "./page.module.css";
import SignupForm from "../components/SignupForm";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>SignalBox</p>
            <h1 className={styles.heroTitle}>Every Signal Matters</h1>
            <p className={styles.heroText}>
              Step into the control room of Signalbox, a realistic and intense
              train-simulation where every signal, switch, and second matters.
              Outsmart delays, manage traffic, and prove you can keep the
              network running smoothly.
            </p>
            <button type="button" className={styles.heroButton}>
              Read about us
            </button>
          </div>
        </section>

        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.cardImage} aria-hidden="true" />
            <div className={styles.cardContent}>
              <h2>Playtest</h2>
              <p>
                Læs mere om vores kommende playtests og hvordan du kan få tidlig
                adgang.
              </p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.cardImageAlt} aria-hidden="true" />
            <div className={styles.cardContent}>
              <h2>Software support</h2>
              <p>
                Vi hjælper dig med support og feedback, så oplevelsen bliver
                endnu bedre.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.signupSection}>
          <div className={styles.signupContent}>
            <h2>Tilmeld dig playtest</h2>
            <p>Få besked når vi åbner for næste runde. Ingen spam.</p>
          </div>
          <SignupForm />
        </section>

        <section className={styles.discordSection}>
          <div className={styles.discordImage} aria-hidden="true" />
          <div className={styles.discordContent}>
            <h2>Join vores Discord</h2>
            <p>
              Bliv en del af fællesskabet og få nyheder, opdateringer og direkte
              kontakt.
            </p>
            <a
              href="https://discord.gg/your-invite"
              className={styles.discordButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join our Discord
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
