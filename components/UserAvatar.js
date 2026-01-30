// Async Server Component - fetches user data on the server
import Image from "next/image";
import styles from "./UserAvatar.module.css";

export default async function UserAvatar({ uid }) {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${uid}.json`;

  // Fetch user data - runs on server, not sent to client
  const response = await fetch(url);
  const user = await response.json();

  return (
    <div className={styles.avatar}>
      <Image src={user.image} alt={user.name} width={40} height={40} className={styles.avatarImage} />
      <span className={styles.userInfo}>
        <h3>{user.name}</h3>
        <p>{user.title}</p>
      </span>
    </div>
  );
}
