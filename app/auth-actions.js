"use server";

import { cookies } from "next/headers";

export async function setAuthToken(token) {
  const cookieStore = await cookies();

  if (token) {
    // HttpOnly cookie for sikkerhed
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 7 dage
    });
  } else {
    cookieStore.delete("token");
  }
}
