import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { getUserByEmail, createUser } from "@/lib/firebase-users";
import { redirect } from "next/navigation";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    })
  ],
  callbacks: {
    async signIn({ user }) {
      const existingUser = await getUserByEmail(user.email);

      if (!existingUser) {
        await createUser({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      if (token.email) {
        const firebaseUser = await getUserByEmail(token.email);
        if (firebaseUser) {
          session.user = {
            uid: firebaseUser.id,
            email: firebaseUser.mail,
            name: firebaseUser.name,
            image: firebaseUser.image,
            title: firebaseUser.title
          };
        }
      }

      return session;
    }
  },
  pages: {
    signIn: "/signin"
  }
});
