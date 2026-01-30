# Firebase Authentication Guide

Denne guide viser hvordan du implementerer Firebase Authentication i din Next.js post app.

## Oversigt

**Udgangspunkt:** Du har en Next.js post app hvor posts har hardcoded `uid: "OPPe5jue2Ghxx3mtnxevB5FwCYe2"`

**Mål:** Implementere rigtig authentication så:

- ✅ Brugere kan oprette konto og logge ind
- ✅ Posts får automatisk authenticated user's UID
- ✅ Kun ejeren kan edit/delete sine egne posts
- ✅ Server Actions er beskyttet med token-verifikation

**Hvad skal implementeres:**

- ✅ Firebase Authentication med email/password
- ✅ Firebase Admin SDK for server-side token-verifikation
- ✅ HttpOnly cookies for sikker auth
- ✅ Login/Signup sider
- ✅ Beskyttede Server Actions
- ✅ Owner-baseret adgangskontrol

---

## Før du starter: Opret en ny branch

**VIGTIGT:** Lav denne implementation på en ny branch, så du kan bevare din `main` branch som den er.

```bash
# Sørg for du er på main branch
git checkout main

# Opret og skift til en ny branch
git checkout -b firebase-authentication

# Verificer du er på den nye branch
git branch
```

Nu arbejder du på `firebase-authentication` branchen, og din `main` branch forbliver uændret.

---

## Del 1: Installation og Setup

### 1.1 Installer Firebase pakker

```bash
npm install firebase firebase-admin
```

### 1.2 Opret Firebase projekt

1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Klik **Add project**![[Screenshot 2025-11-18 at 08.55.39.png]]
3. Følg setup-guiden
   1. Fravælg Analytics
4. Gå til "Realtime Database" og "Create Database"![[Screenshot 2025-11-18 at 08.58.00.png]]
   1. Vælg database
   2. Vælg "Start in Test mode" og klik "Enable"
5. Importer data til din Realtime Database.
   1. Brug følgende JSON-data: https://github.com/cederdorff/race/blob/master/data/postsUsersObject.json
   2. Download Raw File så den ligger lokalt på din maskine![[Screenshot 2025-11-18 at 09.01.42.png]]
   3. Importer nu JSON-filen:![[Screenshot 2025-11-18 at 09.03.21.png]]
   4. Og kontroller at du har data:![[Screenshot 2025-11-18 at 09.03.48.png]]
   5. Test at du kan tilgå data:
      1. https://din-egen-firebase-database-url.com/**posts.json**
         ![[Screenshot 2025-11-18 at 09.05.35.png]]
      2. https://din-egen-firebase-database-url.com/**users.json**
         ![[Screenshot 2025-11-18 at 09.06.03.png]]
6. I Project Overview → "Project Settings" → Klik **Web** ikonet (`</>`)![[Screenshot 2025-11-18 at 09.07.41.png]]
7. Registrer din app og kopier config, så du om lidt kan kopiere værdierne.![[Screenshot 2025-11-18 at 09.08.38.png]]

### 1.3 Aktiver Email/Password Authentication

1. I Firebase Console → **Authentication**
2. Klik **Get started**
3. Under **Sign-in method** → Klik **Email/Password**
4. Enable **Email/Password**
5. Klik **Save**

### 1.4 Tilføj Firebase config til `.env.local`

1. Opret en .env.local i roden af dit Next projekt. '
2. Tilføj variabler/værdierne fra din firebase configuration (step 1.2). Indsæt værdierne så de passer:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=din-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dit-projekt.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://dit-projekt.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dit-projekt-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dit-projekt.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin SDK (Server-side) - tilføjes nu
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

---

## Del 2: Firebase Admin Credentials

### 2.1 Hent Service Account Key

1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Vælg dit projekt
3. Klik på **Project Settings** (tandhjul-ikonet)
4. Gå til fanen **Service Accounts**![[Screenshot 2025-11-18 at 09.51.29.png]]
5. Klik **Generate new private key**
6. En JSON-fil downloades

### 2.2 Tilføj credentials til `.env.local`

1. Åben den downloadede JSON-fil i VS Code![[Screenshot 2025-11-18 at 09.54.23.png]]
2. Fra den downloadede JSON-fil, tilføj disse værdier (project_id, client_email og private_key) til din `.env.local`:

```env
FIREBASE_PROJECT_ID=dit-projekt-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@dit-projekt.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nDINPRIVATEKEYHER\n-----END PRIVATE KEY-----\n"
```

**VIGTIGT:** Tilføj `.env.local` til `.gitignore`! Du må ikke dele dine env-filer på GitHub.

---

## Del 3: Firebase Setup

I denne del opretter du tre vigtige filer der håndterer Firebase på client-side og server-side:

- **`lib/firebase.js`** - Client-side Firebase (bruges til login/signup UI)
- **`lib/firebase-admin.js`** - Server-side Firebase Admin SDK (verificerer tokens)
- **`lib/auth.js`** - Helper functions til at tjekke auth i Server Components

### 3.1 Opret `lib/firebase.js`

```javascript
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase (kun hvis den ikke allerede er initialiseret)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
```

### 2.2 Opret `lib/firebase-admin.js`

```javascript
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin (kun én gang)
function initAdmin() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
      })
    });
  }
}

initAdmin();

export const adminAuth = getAuth();
```

### 2.3 Opret `lib/auth.js`

```javascript
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
```

---

## Del 4: Auth Context

Auth Context holder styr på brugerens login-status i hele appen:

- **`AuthContext`** - React Context der deler auth state med alle components
- **`onAuthStateChanged`** - Lytter til login/logout events fra Firebase
- **`setAuthToken`** - Server Action der gemmer Firebase token i HttpOnly cookie
- **`AuthProvider`** - Wrapper der giver alle components adgang til auth

### 4.1 Opret `contexts/AuthContext.js`

```javascript
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setAuthToken } from "@/app/auth-actions";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user);

      // Sæt HttpOnly cookie med Firebase IdToken
      if (user) {
        const token = await user.getIdToken();
        await setAuthToken(token);
      } else {
        await setAuthToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    return signOut(auth);
  };

  return <AuthContext.Provider value={{ user, signIn, signUp, logOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### 3.2 Opret `app/auth-actions.js`

```javascript
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
```

### 3.3 Tilføj AuthProvider til `app/layout.js`

```javascript
import Nav from "@/components/Nav";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Next Post App",
  description: "A simple post app built with Next.js"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Nav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## Del 5: Login/Signup Sider

Nu opretter du login og signup sider hvor brugere kan:

- **Signup** - Oprette ny konto med email, password, navn og titel
- **Signin** - Logge ind med eksisterende konto
- **Error handling** - Brugervenlige fejlbeskeder på dansk/engelsk
- **Redirect** - Automatisk redirect til `/posts` efter succesfuldt login

### 5.1 Opret `app/signin/page.js`

```javascript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./page.module.css";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/posts");
    } catch (error) {
      // Brugervenlige error beskeder
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        setError("Invalid email or password");
      } else if (error.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later");
      } else {
        setError("Failed to sign in. Please try again");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.authPage}>
      <div className={styles.container}>
        <h1>Sign In</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="din@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
        </p>
      </div>
    </main>
  );
}
```

### 4.2 Opret `app/signin/page.module.css`

```css
.authPage {
  min-height: 100vh;
  padding: 80px 20px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 500px;
  width: 100%;
  padding: 40px;
  background-color: var(--foreground);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.container h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 32px;
  text-align: center;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.error {
  padding: 12px 16px;
  margin-bottom: 24px;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 14px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.formGroup label {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-primary);
}

.formGroup input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  background-color: var(--background);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.formGroup input:focus {
  outline: none;
  border-color: var(--text-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.submitButton {
  width: 100%;
  padding: 12px 24px;
  margin-top: 8px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submitButton:hover:not(:disabled) {
  background-color: #2563eb;
}

.submitButton:disabled {
  background-color: rgba(59, 130, 246, 0.5);
  cursor: not-allowed;
}

.footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #999;
}

.footer a {
  color: #3b82f6;
  font-weight: 500;
}

.footer a:hover {
  text-decoration: underline;
}
```

### 4.3 Opret `app/signup/page.js`

```javascript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./page.module.css";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const userCredential = await signUp(email, password);
      const user = userCredential.user;

      // Gem brugerdata i databasen
      const userUrl = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${user.uid}.json`;
      await fetch(userUrl, {
        method: "PUT",
        body: JSON.stringify({
          email: user.email,
          name: name.trim(),
          title: title.trim(),
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          createdAt: new Date().toISOString()
        })
      });

      router.push("/posts");
    } catch (error) {
      // Brugervenlige error beskeder
      if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters");
      } else {
        setError("Failed to create account. Please try again");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.authPage}>
      <div className={styles.container}>
        <h1>Sign Up</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="din@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Dit navn"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Din titel"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link href="/signin">Sign In</Link>
        </p>
      </div>
    </main>
  );
}
```

### 4.4 Opret `app/signup/page.module.css`

```css
.authPage {
  min-height: 100vh;
  padding: 80px 20px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 500px;
  width: 100%;
  padding: 40px;
  background-color: var(--foreground);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.container h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 32px;
  text-align: center;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.error {
  padding: 12px 16px;
  margin-bottom: 24px;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 14px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.formGroup label {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-primary);
}

.formGroup input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  background-color: var(--background);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.formGroup input:focus {
  outline: none;
  border-color: var(--text-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.submitButton {
  width: 100%;
  padding: 12px 24px;
  margin-top: 8px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submitButton:hover:not(:disabled) {
  background-color: #059669;
}

.submitButton:disabled {
  background-color: rgba(16, 185, 129, 0.5);
  cursor: not-allowed;
}

.footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #999;
}

.footer a {
  color: #10b981;
  font-weight: 500;
}

.footer a:hover {
  text-decoration: underline;
}
```

---

## Del 6: Brugerprofiler

### 6.1 Gem brugerdata i databasen ved signup

Når en bruger opretter sig, skal du gemme deres navn, titel og evt. profilbillede i Realtime Database:

- Kontroller koden - du har allerede indsat denne stump i `app/signup/page.js`, efter succesfuld signup:

```javascript
const userCredential = await signUp(email, password);
const user = userCredential.user;
const userUrl = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${user.uid}.json`;
await fetch(userUrl, {
  method: "PUT",
  body: JSON.stringify({
    email: user.email,
    name: name.trim(),
    title: title.trim(),
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
    createdAt: new Date().toISOString()
  })
});
```

### 5.2 Opret en Profile Page

Tilføj en side `/app/profile/page.js` hvor brugeren kan se og opdatere egne oplysninger (name, title, image):

```javascript
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }
    async function fetchUserData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${user.uid}.json`);
        const data = await response.json();
        if (data) {
          setName(data.name || "");
          setTitle(data.title || "");
          setImage(data.image || "");
        }
      } catch (error) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name.trim()) return setError("Name is required");
    if (!title.trim()) return setError("Title is required");
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${user.uid}.json`, {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim(),
          image: image.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
        })
      });
      if (response.ok) setSuccess("Profile updated successfully!");
      else setError("Failed to update profile");
    } catch (error) {
      setError("Failed to update profile. Please try again");
    } finally {
      setLoading(false);
    }
  }

  if (!user || loading) return null;

  return (
    <main className={styles.profilePage}>
      <div className={styles.container}>
        <h1>Edit Profile</h1>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Your name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Your title"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          {image && (
            <div className={styles.imagePreview}>
              <Image src={image} alt="Profile preview" width={100} height={100} />
            </div>
          )}
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
```

### 6.3 Opret `app/profile/page.module.css`

```css
.profilePage {
  min-height: 100vh;
  padding: 80px 20px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 500px;
  width: 100%;
  padding: 40px;
  background-color: var(--foreground);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.container h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 32px;
  text-align: center;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.error {
  padding: 12px 16px;
  margin-bottom: 24px;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 14px;
}

.success {
  padding: 12px 16px;
  margin-bottom: 24px;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  color: #10b981;
  font-size: 14px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.formGroup label {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-primary);
}

.formGroup input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  background-color: var(--background);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.formGroup input:focus {
  outline: none;
  border-color: var(--text-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.imagePreview {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.imagePreview img {
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color);
}

.submitButton {
  width: 100%;
  padding: 12px 24px;
  margin-top: 8px;
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submitButton:hover:not(:disabled) {
  background-color: #7c3aed;
}

.submitButton:disabled {
  background-color: rgba(139, 92, 246, 0.5);
  cursor: not-allowed;
}
```

---

## Del 7: Navigation med Auth

### 7.1 Opdater `components/Nav.js`

**Før (main branch):** Simpel navigation uden auth

```javascript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link href="/" className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}>
        Home
      </Link>
      <Link href="/posts" className={`${styles.navLink} ${pathname === "/posts" ? styles.active : ""}`}>
        Posts
      </Link>
      <Link href="/posts/create" className={`${styles.navLink} ${pathname === "/posts/create" ? styles.active : ""}`}>
        New Post
      </Link>
    </nav>
  );
}
```

**Efter:** Med auth state og conditional rendering

```javascript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Nav.module.css";

export default function Nav() {
  const pathname = usePathname();
  const { user, logOut } = useAuth();

  async function handleLogout() {
    try {
      await logOut();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.navLinks}>
        <Link href="/" className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}>
          Home
        </Link>
        <Link href="/posts" className={`${styles.navLink} ${pathname === "/posts" ? styles.active : ""}`}>
          Posts
        </Link>
        {user && (
          <Link
            href="/posts/create"
            className={`${styles.navLink} ${pathname === "/posts/create" ? styles.active : ""}`}>
            New Post
          </Link>
        )}
      </div>

      <div className={styles.authSection}>
        {user ? (
          <>
            <span className={styles.userEmail}>{user.email}</span>
            <Link href="/profile" className={`${styles.authButton} ${styles.profileButton}`}>
              Profile
            </Link>
            <button onClick={handleLogout} className={`${styles.authButton} ${styles.logOutButton}`}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className={`${styles.authButton} ${styles.signInButton}`}>
              Sign In
            </Link>
            <Link href="/signup" className={`${styles.authButton} ${styles.signUpButton}`}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
```

**Vigtige ændringer:**

- ✅ Import `useAuth` hook
- ✅ Hent `user` og `logOut` fra context
- ✅ Wrapper links i `<div className={styles.navLinks}>`
- ✅ "New Post" vises kun hvis `user` er logged ind
- ✅ Nyt `<div className={styles.authSection}>` med auth knapper
- ✅ Vis email og "Log Out" hvis logged ind, ellers "Sign In" og "Sign Up"

### 7.2 Opdater `components/Nav.module.css`

Erstat dine styles med:

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: var(--foreground);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
}

.navLinks {
  display: flex;
  gap: 16px;
}

.navLink {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  color: var(--text-primary);
}

.navLink:hover {
  background-color: var(--background);
}

.active {
  background-color: var(--background);
}

.authSection {
  display: flex;
  gap: 16px;
  align-items: center;
}

.userEmail {
  font-size: 14px;
  color: #999;
}

.authButton {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
}

.signInButton {
  background-color: #3b82f6;
  color: white;
}

.signInButton:hover {
  background-color: #2563eb;
}

.signUpButton {
  background-color: #10b981;
  color: white;
}

.signUpButton:hover {
  background-color: #059669;
}

.profileButton {
  background-color: #8b5cf6;
  color: white;
}

.profileButton:hover {
  background-color: #7c3aed;
}

.logOutButton {
  background-color: #ef4444;
  color: white;
}

.logOutButton:hover {
  background-color: #dc2626;
}
```

---

## Del 8: Beskyt Server Actions

### 8.1 Opdater `app/posts/create/page.js`

**VIGTIGT:** Tilføj authentication til siden og brug den autentificerede brugers UID.

```javascript
import { redirect } from "next/navigation";
import FormPost from "@/components/FormPost";
import styles from "./page.module.css";
import { requireAuth } from "@/lib/auth";

export default async function CreatePage() {
  const user = await requireAuth().catch(() => redirect("/signin")); // ← Beskyt med auth
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts.json`; // Get Firebase Realtime Database URL

  // Server Action to handle post creation
  async function createPost(formData) {
    "use server"; // Mark as server action - runs on server only
    const caption = formData.get("caption");
    const image = formData.get("image");

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        caption,
        image,
        uid: user.uid, // Associate post with the authenticated user
        createdAt: new Date().toISOString() // Add creation timestamp
      })
    });

    if (response.ok) {
      redirect("/posts");
    }
  }

  return (
    <section className={styles.formPage}>
      <div className={styles.container}>
        <h1>Create New Post</h1>
        <FormPost action={createPost} />
      </div>
    </section>
  );
}
```

**Vigtige ændringer:**

- ✅ Import `requireAuth` fra `@/lib/auth`
- ✅ Gør component til `async function` så den kan await auth check
- ✅ Tilføj auth check: `const user = await requireAuth().catch(() => redirect("/signin"))`
- ✅ Server Action forbliver nested (har adgang til `user` og `url` via closure)
- ✅ Brug `uid: user.uid` for at associere posten med den autentificerede bruger, som opretter den nye post.

### 8.2 Opdater `app/posts/[id]/update/page.js`

```javascript
import FormPost from "@/components/FormPost";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { requireAuth } from "@/lib/auth";

export default async function UpdatePage({ params }) {
  const user = await requireAuth().catch(() => redirect("/signin")); // ← Beskyt med auth

  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post = await response.json();

  if (user.uid !== post.uid) {
    redirect("/posts");
  }

  // Server Action to handle post update
  async function updatePost(formData) {
    "use server"; // Mark as server action - runs on server only
    const caption = formData.get("caption");
    const image = formData.get("image");

    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify({ caption, image })
    });

    if (response.ok) {
      redirect(`/posts/${id}`);
    }
  }

  return (
    <section className={styles.formPage}>
      <div className={styles.container}>
        <h1>Update Post</h1>
        <FormPost action={updatePost} post={post} />
      </div>
    </section>
  );
}
```

**Vigtige ændringer:**

- ✅ Import `requireAuth` fra `@/lib/auth`
- ✅ Auth check og gem `user` objekt: `const user = await requireAuth()`
- ✅ **Ownership check:** `if (user.uid !== post.uid) { redirect("/posts"); }`
- ✅ Server Action forbliver nested (har adgang til `url` og `id` via closure)

### 8.3 Opdater `app/posts/[id]/page.js`

```javascript
import DeletePostButton from "@/components/DeletePostButton";
import PostCard from "@/components/PostCard";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function PostPage({ params }) {
  const user = await requireAuth().catch(() => redirect("/signin")); // ← Beskyt med auth

  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post = await response.json();

  const isOwner = user && user.uid === post.uid;

  // Server Action to handle post deletion
  async function deletePost() {
    "use server";

    if (!isOwner) {
      redirect("/posts"); // Forhindre sletning af andres posts
    }

    const response = await fetch(url, {
      method: "DELETE"
    });
    if (response.ok) {
      redirect("/posts");
    }
  }

  return (
    <main className={styles.postPage}>
      <div className={styles.container}>
        <h1>{post.caption}</h1>
        <div className={styles.postCard}>
          <PostCard post={post} />
        </div>
        {isOwner && (
          <div className={styles.btns}>
            <DeletePostButton deleteAction={deletePost} />
            <Link href={`/posts/${id}/update`}>
              <button className={styles.btnUpdate}>Update post</button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
```

**Vigtige ændringer:**

- ✅ Brug `requireAuth()` i stedet for `getServerUser()` og gem `user`
- ✅ Beregn `isOwner` baseret på `user.uid === post.uid`
- ✅ **Ownership check i deletePost:** `if (!isOwner) { redirect("/posts"); }`
- ✅ `deletePost` er nested Server Action med adgang til `url` og `isOwner` via closure
- ✅ UI conditional `{isOwner && ...}` skjuler delete/update knapper for ikke-ejere

**Vigtige ændringer:**

- ✅ Auth check med `await requireAuth()` i starten af component
- ✅ `deletePost` er nested Server Action (har adgang til `url` via closure)
- ✅ Ingen `.bind()` nødvendig - `deletePost` kan bruge `url` direkte
- ✅ `isOwner` check sikrer kun post-ejeren ser delete/update knapper

---

## Test din implementation

### 1. Start dev server

```bash
npm run dev
```

### 2. Test Authentication (Hvem er du?)

1. ✅ **Uauthenticated access:**

   - Gå til `/posts/create` uden at være logged ind
   - Du skal blive redirected til `/signin`
   - Prøv at gå til `/profile` - du skal også redirectes

2. ✅ **Signup flow:**

   - Gå til `/signup` og opret en ny bruger
   - Tjek at du bliver redirected til `/posts`
   - Tjek at Nav viser din email og "Log Out" knap

3. ✅ **Login flow:**

   - Log ud
   - Gå til `/signin` og log ind med dine credentials
   - Tjek at du bliver redirected til `/posts`

4. ✅ **Session persistence:**
   - Mens logged ind, refresh browseren (F5)
   - Du skal stadig være logged ind (ikke redirected til signin)

### 3. Test Authorization (Hvad må du?)

5. ✅ **Create post (kun authenticated):**

   - Som logged ind bruger, klik "New Post"
   - Opret et post med caption og billede
   - Tjek at posten vises med DIT navn (ikke hardcoded UID)

6. ✅ **View posts (alle kan se):**

   - Log ud
   - Log ind med en ANDEN bruger (opret ny hvis nødvendigt)
   - Gå til `/posts` - du skal kunne se alle posts
   - Klik på et post du IKKE ejer

7. ✅ **Update authorization (kun ejer):**

   - Mens du ser et post du IKKE ejer: Tjek at du IKKE ser "Update post" knap
   - Prøv at gå direkte til `/posts/[id]/update` URL'en
   - Du skal blive redirected til `/posts` (ikke ejer = ingen adgang)

8. ✅ **Delete authorization (kun ejer):**

   - Mens du ser et post du IKKE ejer: Tjek at du IKKE ser delete-knappen
   - Gå til et post DU ejer (opret evt. et nyt)
   - Tjek at du nu SER både "Delete" og "Update post" knapper
   - Slet posten - det skal virke

9. ✅ **Profile authorization:**
   - Gå til `/profile`
   - Opdater dit navn eller titel
   - Opret et nyt post og tjek at det nye navn vises

---

## Hvad har vi opnået?

### 📊 Security Oversigt - Alle Pages

| Page                     | Auth Check           | Authorization                   | Status | Note                              |
| ------------------------ | -------------------- | ------------------------------- | ------ | --------------------------------- |
| **`/` (home)**           | ❌ Ingen             | N/A                             | ✅ OK  | Offentlig landing page            |
| **`/posts`**             | ❌ Ingen             | N/A                             | ✅ OK  | Offentlig liste - alle kan browse |
| **`/posts/[id]`**        | ✅ `requireAuth()`   | ✅ `isOwner` check i deletePost | ✅ God | Alle kan se, kun ejer kan delete  |
| **`/posts/[id]/update`** | ✅ `requireAuth()`   | ✅ Ownership redirect           | ✅ God | Kun ejer kan opdatere             |
| **`/posts/create`**      | ✅ `requireAuth()`   | ✅ Bruger egen UID              | ✅ God | Kun authenticated kan create      |
| **`/profile`**           | ✅ Client-side check | N/A                             | ✅ OK  | Client Component med useAuth      |
| **`/signin`**            | ❌ Ingen             | N/A                             | ✅ OK  | Login page                        |
| **`/signup`**            | ❌ Ingen             | N/A                             | ✅ OK  | Signup page                       |

### 🔒 Authorization Matrix - Hvad må brugere gøre?

| Action               | Unauthenticated        | Authenticated (ikke ejer) | Authenticated (ejer) |
| -------------------- | ---------------------- | ------------------------- | -------------------- |
| **Browse /posts**    | ✅ Tilladt             | ✅ Tilladt                | ✅ Tilladt           |
| **View post detail** | ❌ Redirect til signin | ✅ Kan se posten          | ✅ Kan se posten     |
| **Create post**      | ❌ Redirect til signin | ✅ Kan oprette            | ✅ Kan oprette       |
| **Update post**      | ❌ Redirect til signin | ❌ Redirect til /posts    | ✅ Kan opdatere      |
| **Delete post**      | ❌ Redirect til signin | ❌ Action redirecter      | ✅ Kan slette        |
| **Edit profile**     | ❌ Redirect til signin | ✅ Egen profil            | ✅ Egen profil       |

### 🛡️ Sikkerhedslag - Defense in Depth

| Lag                             | Beskyttelse                        | Implementering                        |
| ------------------------------- | ---------------------------------- | ------------------------------------- |
| **1. Page-level Auth**          | Bloker unauthenticated users       | `requireAuth()` på protected pages    |
| **2. Ownership Check**          | Bloker ikke-ejere fra update-siden | `if (user.uid !== post.uid) redirect` |
| **3. Server Action Auth**       | Verificer ownership i actions      | `if (!isOwner) redirect` i deletePost |
| **4. UI Conditional**           | Skjul knapper for ikke-ejere       | `{isOwner && <DeleteButton />}`       |
| **5. HttpOnly Cookies**         | Beskyt mod XSS                     | `httpOnly: true` i cookie settings    |
| **6. Server-side Verification** | Verificer tokens er ægte           | Firebase Admin SDK `verifyIdToken()`  |

### Authentication (Hvem er du?)

✅ **Sikker authentication** - Firebase Admin SDK verificerer tokens på server  
✅ **HttpOnly cookies** - Tokens kan ikke manipuleres fra client  
✅ **Persistent sessions** - Login bevares ved browser refresh  
✅ **Protected pages** - Unauthenticated users redirectes til `/signin`

### Authorization (Hvad må du?)

✅ **Owner-based access** - Kun ejeren kan edit/delete egne posts  
✅ **Ownership checks** - Verificeret på både page-level og i Server Actions  
✅ **UI conditionals** - Delete/update knapper kun synlige for ejere  
✅ **Create authorization** - Posts associeres med autentificeret brugers UID

### Technical Excellence

✅ **Server Components** - Bevaret for optimal performance  
✅ **Nested Server Actions** - Sikker closure-based access til user data  
✅ **Brugervenlige fejl** - Klare beskeder på dansk/engelsk  
✅ **Professional UX** - Loading states, error handling, redirects

---

## Arkitektur-oversigt

```
Client (Browser)
    │
    ├─> Firebase Auth (login/signup)
    │   └─> Får IdToken fra Firebase
    │
    ├─> AuthContext sætter token i HttpOnly cookie
    │
Server (Next.js)
    │
    ├─> Page Level
    │   ├─> requireAuth() verificerer token
    │   └─> Ownership check (update page)
    │
    ├─> Firebase Admin SDK
    │   └─> verifyIdToken() verificerer token er ægte
    │
    └─> Server Actions (Nested)
        ├─> Closure access til user/post data
        └─> Ownership check (deletePost)
```

**Authentication Flow:**

1. Bruger logger ind via Firebase Auth (client-side)
2. `AuthContext` modtager IdToken fra Firebase
3. Token gemmes i HttpOnly cookie via Server Action
4. Ved hver request verificeres token med Firebase Admin SDK
5. `requireAuth()` returnerer user objekt eller fejler

**Authorization Flow:**

1. **Create:** `user.uid` sættes automatisk på nye posts
2. **Update:** Page-level check `if (user.uid !== post.uid) redirect`
3. **Delete:** Server Action check `if (!isOwner) redirect`
4. **View:** UI conditional `{isOwner && <DeleteButton />}`

**Nøgle-komponenter:**

- **Client:** `firebase` pakke til login/signup UI
- **Server:** `firebase-admin` til token-verifikation
- **Bridge:** HttpOnly cookies synkroniserer auth state sikkert
- **Auth helpers:** `requireAuth()` verificerer auth + returnerer user
- **Ownership pattern:** Nested Server Actions med closure access til user/post data

---

## Troubleshooting

**Problem:** "Firebase Admin error"

- Tjek at alle `FIREBASE_*` env vars er sat korrekt
- Husk `\n` skal være i private key strengen

**Problem:** "Not logged in after refresh"

- Tjek at `onAuthStateChanged` kører i `AuthContext`
- Tjek browser cookies - skal være en `token` cookie

**Problem:** "Can't create/update/delete posts"

- Tjek at `requireAuth()` ikke fejler i Server Actions
- Tjek browser console for errors

---

## Bonus: Næste steps

Hvis du vil udvide systemet:

- [ ] Email verification
- [ ] Password reset
- [ ] Google/GitHub OAuth
- [ ] User profiles i Realtime Database
- [ ] Rate limiting
- [ ] Middleware-baseret route protection

God fornøjelse med Firebase Authentication! 🚀
