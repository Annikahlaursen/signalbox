"use server";

import { signOut, signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}

export async function handleSignIn() {
  await signIn("github", { redirectTo: "/posts" });
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }
  return session.user;
}
