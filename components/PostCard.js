// Server Component - no "use client" needed
import Image from "next/image";
import styles from "./PostCard.module.css";
import UserAvatar from "./UserAvatar";

export default function PostCard({ post }) {
  return (
    <article className={styles.postCard}>
      {/* Async Server Component inside */}
      <UserAvatar uid={post.uid} />
      <Image src={post.image} alt={post.caption} className={styles.postCardImage} width={500} height={500} />
      <h3>{post.caption}</h3>
    </article>
  );
}
