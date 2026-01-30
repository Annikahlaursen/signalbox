import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

export async function getServerUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    // Verificer token med Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getServerUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
