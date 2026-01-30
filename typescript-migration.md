# Implementer TypeScript

## Oversigt

I dette modul vil du migrere applikationen fra JavaScript til TypeScript. Du vil lære at arbejde med type safety og se hvordan TypeScript kan hjælpe med at undgå fejl.

---

## Opgave 1: Opret en ny branch

Før vi starter migrationen, skal du oprette en ny branch. Dette sikrer at din `main` branch forbliver intakt, og du kan arbejde sikkert med migrationen.

**1. Åbn terminalen i VS Code**

**2. Tjek at du er på main branch:**

```bash
git status
```

**3. Commit eventuelle ændringer først:**

```bash
git add .
git commit -m "Klar til TypeScript migration"
```

**4. Opret og skift til en ny branch:**

```bash
git checkout -b typescript-migration
```

Eller med den nyere kommando:

```bash
git switch -c typescript-migration
```

**5. Verificer at du er på den nye branch:**

```bash
git branch
```

Du skulle se en stjerne (\*) ved `typescript-migration`.

**Hvorfor er dette vigtigt?**

- ✅ Du kan altid gå tilbage til `main` hvis noget går galt
- ✅ Du kan sammenligne før/efter ved at skifte mellem branches
- ✅ Du lærer god Git workflow
- ✅ Du kan push din branch til GitHub og lave en Pull Request senere

---

## Hvad er TypeScript?

**TypeScript er JavaScript med syntax for types.** Det er et programmeringssprog udviklet af Microsoft som bygger oven på JavaScript ved at tilføje statisk type-checking.

### Nøglekoncepter:

**1. TypeScript = JavaScript + Types**

```typescript
// JavaScript
function greet(name) {
  return "Hello, " + name;
}

// TypeScript
function greet(name: string): string {
  return "Hello, " + name;
}
```

**2. Compile-time vs Runtime fejl**

- **JavaScript:** Fejl opdages når koden kører (runtime)
- **TypeScript:** Mange fejl opdages når du skriver koden (compile-time)

**3. TypeScript kompilerer til JavaScript**

- Browsers forstår kun JavaScript
- TypeScript bliver "oversat" til JavaScript før det kører
- Next.js håndterer dette automatisk for dig

---

## Hvorfor bruge TypeScript?

### ❌ Problem med JavaScript:

```javascript
// JavaScript - Ingen advarsler!
function calculateTotal(price, quantity) {
  return price * quantity;
}

// Disse kald giver ingen fejl, men forkerte resultater:
calculateTotal("10", "5"); // "1010" (string concatenation)
calculateTotal(10); // NaN (quantity er undefined)
calculateTotal(null, 5); // 0 (null * 5)
calculateTotal({ price: 10 }, 5); // NaN (object * 5)
```

### ✅ Løsning med TypeScript:

```typescript
// TypeScript - Fanger fejl med det samme!
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// TypeScript giver røde streger under disse:
calculateTotal("10", "5"); // ❌ Fejl: string er ikke number
calculateTotal(10); // ❌ Fejl: mangler quantity parameter
calculateTotal(null, 5); // ❌ Fejl: null er ikke number
calculateTotal({ price: 10 }, 5); // ❌ Fejl: object er ikke number

// Kun dette er tilladt:
calculateTotal(10, 5); // ✅ OK: returnerer 50
```

### Konkrete fordele:

1. **Fanger fejl før koden kører**

   - Stavefejl i property navne
   - Forkerte typer sendt til funktioner
   - Manglende required properties

2. **Bedre udviklingsoplevelse**

   - IntelliSense/autocomplete i VS Code
   - Dokumentation direkte i koden
   - Hurtigere at navigere i kodebasen

3. **Sikrere refactoring**

   - Omdøb en property - TypeScript finder alle steder
   - Ændre en function signatur - TypeScript viser hvor den bruges forkert

4. **Levende dokumentation**
   - Types viser hvad funktioner forventer og returnerer
   - Interfaces dokumenterer data strukturer

---

## Før vi starter: Forstå grundlæggende types

### Primitive types:

```typescript
let name: string = "Alice";
let age: number = 25;
let isStudent: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;
```

### Arrays:

```typescript
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];
let mixed: (string | number)[] = ["Alice", 25]; // Union type
```

### Objects med interface:

```typescript
interface Person {
  name: string;
  age: number;
  email?: string; // ? betyder optional
}

const person: Person = {
  name: "Alice",
  age: 25
  // email er optional, så det er OK at udelade
};
```

### Function types:

```typescript
// Function med parameter og return type
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Function type i interface
interface MathOperation {
  execute: (a: number, b: number) => number;
}
```

---

## Opgave 2: Forstå problemet TypeScript løser (15 min)

**Formål:** Oplev konkret hvorfor TypeScript er værdifuldt ved at teste i dit eget projekt.

### Del 1: Generelle scenarier (5 min)

Tænk over disse typiske JavaScript problemer:

**Scenario 1: Stavefejl i property navn**

```javascript
// JavaScript - ingen fejl før runtime
const post = { caption: "Hello", image: "url.jpg" };
console.log(post.capition); // undefined - ingen advarsel!
```

**Scenario 2: Forkert type sendt til funktion**

```javascript
// JavaScript - ingen fejl før runtime
function calculateAge(birthYear) {
  return 2024 - birthYear;
}
calculateAge("1990"); // "20241990" - forkert resultat!
```

**Scenario 3: Manglende required felt**

```javascript
// JavaScript - fejl først når koden kører
const user = { name: "Alice" }; // mangler email
sendEmail(user.email); // Runtime fejl: Cannot read property of undefined
```

### Del 2: Test i dit projekt (10 min)

**Nu skal du teste lignende fejl i din NUVÆRENDE JavaScript kode!**

#### Test 1: Stavefejl

I `components/PostCard.js`, lav bevidst en stavefejl:

```javascript
// Ændr midlertidigt:
<h3>{post.capition}</h3> // Forkert: capition i stedet for caption
```

**Hvad sker der?**

- Får du en fejl med det samme?
- Skal du køre appen for at se fejlen?
- Hvad vises i browseren?

**Husk at ændre tilbage til `post.caption` efter testen!**

#### Test 2: Manglende property check

I `components/UserAvatar.js`, kommenter valideringen ud:

```javascript
// Tilføj før return:
console.log("User:", user);
console.log("User name:", user.name);

// Hvad hvis user er null eller undefined?
```

Prøv at sende `null` som uid:

```javascript
<UserAvatar uid={null} />
```

**Hvad sker der?**

- Får du en fejl?
- Hvornår opdages problemet?

**Husk at fjerne testen efter!**

#### Test 3: Forkert prop type

I `app/posts/page.js`, prøv at sende en string i stedet for et post objekt:

```javascript
<PostCard post="dette er forkert" />
```

**Hvad sker der?**

- Advarer JavaScript dig?
- Hvornår går det galt?

**Husk at ændre tilbage!**

### Refleksion (skriv ned):

1. Hvornår opdagede du fejlene? (compile-time eller runtime?)
2. Var fejlmeddelelserne klare?
3. Hvor mange fejl kunne have nået produktion?
4. Hvordan tror du TypeScript ville hjælpe?

💡 **Husk disse eksempler - vi tester de samme fejl med TypeScript i Opgave 8!**

---

## Opgave 3: Commit dine ændringer

Før vi installerer TypeScript, skal du committe dine ændringer fra Opgave 5.1.

```bash
git add .
git commit -m "Test JavaScript problemer før TypeScript migration"
```

**Hvorfor?**

- Du kan altid gå tilbage til denne commit
- Det gør det nemt at se hvilke filer TypeScript ændrer
- God Git hygiejne - små, logiske commits

---

## Opgave 4: Installer TypeScript

**Trin 1: Installation af dependencies**

```bash
npm install -D typescript @types/react @types/node
```

**Trin 2: Opret TypeScript konfiguration**

Opret `tsconfig.json` i projektets rod:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Trin 3: Start med at omdøbe en fil**

Omdøb en `.js` fil til `.tsx` for at aktivere TypeScript:

```bash
mv components/Nav.js components/Nav.tsx
```

**Trin 4: Start development server**

```bash
npm run dev
```

Next.js vil nu automatisk oprette `next-env.d.ts` med type definitions.

**Vigtigt:** `allowJs: true` i `tsconfig.json` betyder at JavaScript og TypeScript kan eksistere side om side, så du kan migrere gradvist fil for fil.

---

## Opgave 5: Forstå Interfaces og Types

**Hvad er en interface?**

En interface er en kontrakt der definerer strukturen af et objekt. Det fortæller TypeScript præcis hvilke properties et objekt skal have.

### Eksempel: Uden interface (JavaScript)

```javascript
// JavaScript - ingen garanti for struktur
const post = {
  id: "123",
  caption: "Hello",
  image: "url.jpg",
  uid: "user1",
  createdAt: 1234567890
};

// Ingen advarsler hvis du laver fejl:
console.log(post.capition); // undefined - stavefejl!
console.log(post.date); // undefined - property findes ikke!
```

### Eksempel: Med interface (TypeScript)

```typescript
// TypeScript - klar struktur
interface Post {
  id: string;
  caption: string;
  image: string;
  uid: string;
  createdAt: number;
}

const post: Post = {
  id: "123",
  caption: "Hello",
  image: "url.jpg",
  uid: "user1",
  createdAt: 1234567890
};

// TypeScript fanger fejl:
console.log(post.capition); // ❌ Fejl: Property 'capition' does not exist
console.log(post.date); // ❌ Fejl: Property 'date' does not exist

// Kun dette virker:
console.log(post.caption); // ✅ OK
```

### Fordele ved interfaces:

1. **Autocomplete:** VS Code viser alle tilgængelige properties
2. **Fejlfinding:** Fanger stavefejl med det samme
3. **Dokumentation:** Andre kan se hvilke felter objektet har
4. **Genbrug:** Samme interface kan bruges mange steder

---

## Opgave 6: Opret Type Definitions

**Opret type definitions:**

1. **Opret `types/` mappe med `types.ts`:**

```typescript
export interface Post {
  id: string;
  caption: string;
  image: string;
  uid: string;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  title: string;
  image: string;
}
```

**Hvorfor export?**

- `export` betyder at andre filer kan importere disse interfaces
- Uden `export` kan interfaces kun bruges i samme fil

**Øvelse: Forstå interfaces**

Prøv at tilføje et Post objekt med en fejl:

```typescript
// I din kode, prøv:
const testPost: Post = {
  id: "1",
  caption: "Test"
  // mangler image, uid, createdAt - hvad sker der?
};
```

**Refleksion:**

- Hvad siger TypeScript fejlen?
- Hvor hurtigt opdagede du fejlen?
- Sammenlign med JavaScript - hvornår ville du have opdaget fejlen der?

---

## Opgave 7: Migrer Komponenter

2. **Omdøb og migrer komponenter én ad gangen:**

```bash
# Omdøb komponent filer til .tsx
mv components/UserAvatar.js components/UserAvatar.tsx
mv components/PostCard.js components/PostCard.tsx
mv components/FormPost.js components/FormPost.tsx
mv components/DeletePostButton.js components/DeletePostButton.tsx
```

**UserAvatar.tsx** - Async Server Component:

```typescript
// Async Server Component - fetches user data on the server
import Image from "next/image";
import { User } from "@/types/types";

interface UserAvatarProps {
  uid: string;
}

export default async function UserAvatar({ uid }: UserAvatarProps) {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${uid}.json`;

  // Fetch user data - runs on server, not sent to client
  const response = await fetch(url);
  const user: User = await response.json();

  return (
    <div className="flex items-center gap-3 mb-3">
      <Image
        src={user.image}
        alt={user.name}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
      <span className="flex flex-col gap-0.5">
        <h3 className="text-sm font-semibold m-0 text-[#ededed] leading-tight">{user.name}</h3>
        <p className="text-xs m-0 text-gray-400 leading-tight">{user.title}</p>
      </span>
    </div>
  );
}
```

**PostCard.tsx** - Server Component:

```typescript
// Server Component - no "use client" needed
import Image from "next/image";
import UserAvatar from "./UserAvatar";
import { Post } from "@/types/types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="flex flex-col gap-3 p-5 rounded-xl bg-[#2a2a2a] transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
      {/* Async Server Component inside */}
      <UserAvatar uid={post.uid} />
      <Image
        src={post.image}
        alt={post.caption}
        className="w-full h-[250px] object-cover rounded-lg"
        width={500}
        height={500}
      />
      <h3 className="text-base font-medium text-[#ededed] mt-1 leading-relaxed">{post.caption}</h3>
    </article>
  );
}
```

**FormPost.tsx** - Client Component:

```typescript
// Client Component - needed for useState to manage image preview
"use client";

import Image from "next/image";
import { useState } from "react";
import { Post } from "@/types/types";

interface FormPostProps {
  action: (formData: FormData) => void;
  post?: Post;
}

export default function FormPost({ action, post }: FormPostProps) {
  // Local state for image preview
  const [image, setImage] = useState(post?.image);

  return (
    <form action={action} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-start max-w-[800px] my-5">
      {/* Form fields... */}
    </form>
  );
}
```

**DeletePostButton.tsx** - Client Component:

```typescript
// Client Component - needed for useState to manage modal visibility
"use client";

import { useState } from "react";

interface DeletePostButtonProps {
  deleteAction: () => void;
}

export default function DeletePostButton({ deleteAction }: DeletePostButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    await deleteAction();
    // Redirect happens in Server Action
  }

  return (
    <>
      <button type="button" onClick={() => setShowModal(true)}>
        Delete post
      </button>
      {showModal && <div>{/* Modal content... */}</div>}
    </>
  );
}
```

**Vigtigt:** Bemærk forskellen mellem Server og Client Components:

- Server Components: Kan være `async` og fetche data direkte
- Client Components: Skal markeres med `"use client"` og bruger hooks som `useState`

---

## Opgave 8: Oplev TypeScript's Fordele (Praktisk øvelse - 15 min)

**Formål:** Teste de samme scenarier fra Opgave 5.0, men nu med TypeScript!

### Øvelse 1: TypeScript fanger stavefejl (Scenario 1 fra Opgave 5.0)

**Husker du dette fra Opgave 5.0?**

```javascript
// JavaScript - ingen fejl
console.log(post.capition); // undefined
```

**Nu med TypeScript - prøv det samme i `PostCard.tsx`:**

```typescript
export default function PostCard({ post }: PostCardProps) {
  return (
    <article>
      <h3>{post.capition}</h3> {/* Stavefejl: capition i stedet for caption */}
    </article>
  );
}
```

**Hvad sker der nu?**

- 🔴 TypeScript viser en rød streg med det samme!
- Fejlbesked: `Property 'capition' does not exist on type 'Post'`
- Du opdager fejlen FØR du kører koden

**Sammenlign med JavaScript:**

- JavaScript: Ingen fejl før runtime (eller slet ikke)
- TypeScript: Fejl med det samme i editoren ✅

### Øvelse 2: TypeScript kræver alle required properties (Scenario 3 fra Opgave 5.0)

**Husker du dette fra Opgave 5.0?**

```javascript
// JavaScript - runtime fejl
const user = { name: "Alice" }; // mangler email
```

**Nu med TypeScript - prøv i `posts/page.tsx`:**

```typescript
const emptyPost: Post = {
  id: "1",
  caption: "Test"
  // mangler image, uid, createdAt - hvad sker der?
};
```

**Hvad sker der nu?**

- 🔴 TypeScript viser fejl for HVER manglende property
- Præcis besked om hvad der mangler
- Kan ikke bygge appen før det er rettet

**Sammenlign med JavaScript:**

- JavaScript: Fejl først når koden kører (runtime error)
- TypeScript: Fejl med det samme (compile-time error) ✅

### Øvelse 3: TypeScript's IntelliSense (Bonus fordel!)

**I JavaScript:** Du skal huske eller slå op hvilke properties Post har.

**I TypeScript:** Editoren hjælper dig!

I `PostCard.tsx`, skriv `post.` og tryk Ctrl+Space (eller Cmd+Space på Mac):

```typescript
<h3>{post.}</h3>  {/* Tryk Ctrl+Space her */}
```

**Hvad sker der?**

- 📋 VS Code viser alle tilgængelige properties: `id`, `caption`, `image`, `uid`, `createdAt`
- Du behøver ikke at huske eller slå op hvad Post har
- Autocomplete hjælper dig med at skrive hurtigere og undgå stavefejl

### Opsummering: Opgave 5.0 vs Opgave 5.5

| Scenario                   | JavaScript (Opgave 5.0)         | TypeScript (Opgave 5.5)    |
| -------------------------- | ------------------------------- | -------------------------- |
| **Stavefejl** (`capition`) | ❌ Ingen fejl - viser undefined | ✅ Rød streg med det samme |
| **Manglende properties**   | ❌ Runtime error                | ✅ Compile-time error      |
| **Forkert type**           | ❌ Forkert resultat             | ✅ Fejl ved compile-time   |
| **Autocomplete**           | ❌ Begrænset                    | ✅ Fuld understøttelse     |

**Konklusion:** TypeScript fanger fejl MEGET tidligere i udviklingscyklussen! 🎯

### Refleksion (skriv ned):

1. Hvilke af de 3 scenarier fra Opgave 5.0 fangede TypeScript?
2. Hvad var den største forskel mellem JavaScript og TypeScript?
3. Hvor hjalp IntelliSense dig mest?
4. Føler du dig mere sikker på at kode med TypeScript? Hvorfor?

---

## Opgave 9: Migrer Page Filer

Nu skal vi migrere page filerne i `app/` mappen til TypeScript.

**Trin 1: Omdøb page filer**

```bash
# Main pages
mv app/layout.js app/layout.tsx
mv app/page.js app/page.tsx

# Posts pages
mv app/posts/page.js app/posts/page.tsx
mv app/posts/create/page.js app/posts/create/page.tsx

# Dynamic routes (brug escaped brackets i zsh)
mv app/posts/\[id\]/page.js app/posts/\[id\]/page.tsx
mv app/posts/\[id\]/update/page.js app/posts/\[id\]/update/page.tsx
```

**Trin 2: Tilføj types til layout.tsx**

```typescript
import "./globals.css";
import Nav from "@/components/Nav";
import { Metadata } from "next";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Next.js Post App",
  description: "A modern post application built with Next.js 16"
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// Root Layout - wraps all pages
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-[#1a1a1a]">
        <Nav />
        {children}
      </body>
    </html>
  );
}
```

**Trin 3: Tilføj types til posts/page.tsx**

```typescript
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { Post } from "@/types/types";

// Server Component
export default async function Home() {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts.json`;
  const response = await fetch(url);
  const dataObject = await response.json();

  // Convert Firebase object to array of posts
  const posts: Post[] = Object.keys(dataObject).map(key => ({
    id: key,
    ...dataObject[key]
  }));

  return (
    <main className="min-h-screen pt-20 pb-10 px-5">
      <div className="max-w-[1400px] mx-auto px-5">
        <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 py-5">
          {posts.map(post => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <PostCard post={post} />
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
```

**Trin 4: Tilføj types til posts/create/page.tsx**

```typescript
import { redirect } from "next/navigation";
import FormPost from "@/components/FormPost";

export default function CreatePage() {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts.json`;

  // Server Action to handle post creation
  async function createPost(formData: FormData) {
    "use server";
    const caption = formData.get("caption") as string;
    const image = formData.get("image") as string;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        caption,
        image,
        uid: "OPPe5jue2Ghxx3mtnxevB5FwCYe2",
        createdAt: new Date().toISOString()
      })
    });

    if (response.ok) {
      redirect("/posts");
    }
  }

  return (
    <section className="min-h-screen pt-20 pb-10 px-5">
      <div className="max-w-[900px] mx-auto py-10 px-5">
        <h1 className="text-[32px] font-semibold mb-6 text-[#ededed] tracking-tight">Create New Post</h1>
        <FormPost action={createPost} />
      </div>
    </section>
  );
}
```

**Trin 5: Tilføj types til posts/[id]/page.tsx**

```typescript
import PostCard from "@/components/PostCard";
import DeletePostButton from "@/components/DeletePostButton";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Post } from "@/types/types";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post: Post = await response.json();

  // Server Action to handle post deletion
  async function deletePost() {
    "use server";
    const response = await fetch(url, {
      method: "DELETE"
    });
    if (response.ok) {
      redirect("/posts");
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-10 px-5">
      <div className="max-w-[800px] mx-auto py-10 px-5">
        <h1 className="text-[32px] font-semibold mb-6 text-[#ededed] tracking-tight">{post.caption}</h1>
        <div className="bg-[#2a2a2a] p-6 rounded-xl mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <PostCard post={post} />
        </div>
        <div className="flex gap-4 mt-5">
          <DeletePostButton deleteAction={deletePost} />
          <Link href={`/posts/${id}/update`}>
            <button className="px-6 py-3 border-none rounded-lg text-base font-medium cursor-pointer transition-all bg-[#ededed] text-black hover:opacity-85 hover:-translate-y-px">
              Update post
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
```

**Trin 6: Tilføj types til posts/[id]/update/page.tsx**

```typescript
import FormPost from "@/components/FormPost";
import { redirect } from "next/navigation";
import { Post } from "@/types/types";

interface UpdatePageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post: Post = await response.json();

  // Server Action to handle post update
  async function updatePost(formData: FormData) {
    "use server";
    const caption = formData.get("caption") as string;
    const image = formData.get("image") as string;

    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify({ caption, image })
    });

    if (response.ok) {
      redirect(`/posts/${id}`);
    }
  }

  return (
    <section className="min-h-screen pt-20 pb-10 px-5">
      <div className="max-w-[900px] mx-auto py-10 px-5">
        <h1 className="text-[32px] font-semibold mb-6 text-[#ededed] tracking-tight">Update Post</h1>
        <FormPost action={updatePost} post={post} />
      </div>
    </section>
  );
}
```

**Vigtige TypeScript koncepter brugt:**

1. **Metadata type:** `export const metadata: Metadata` - Next.js built-in type
2. **React.ReactNode:** Type for children prop
3. **Promise params:** `params: Promise<{ id: string }>` - Next.js 15+ kræver await på params
4. **Server Actions:** `async function(formData: FormData)` - TypeScript infererer automatisk return type
5. **Type assertions:** `as string` når vi henter fra FormData
6. **Array typing:** `posts: Post[]` for eksplicit array type

---

## Opgave 10: Test og Verificer

**Kør development server:**

```bash
npm run dev
```

**Tjek for TypeScript fejl:**

```bash
npx tsc --noEmit
```

**Hvad du skal verificere:**

1. ✅ Ingen TypeScript kompileringsfejl
2. ✅ Alle komponenter har typed props
3. ✅ Server Actions har typed parametre (FormData)
4. ✅ Fetch responses er typed (Post, User)
5. ✅ Dynamic routes har typed params (Promise<{ id: string }>)

**TypeScript fordele du nu har:**

- **Type safety:** Fanger fejl ved compile-time i stedet for runtime
- **IntelliSense:** Bedre autocomplete i VS Code
- **Refactoring:** Trygt at omdøbe properties - TypeScript finder alle steder
- **Dokumentation:** Types fungerer som levende dokumentation
- **Mindre bugs:** Fanger null/undefined fejl før de når produktion

---

## Opgave 11: Best Practices

**TypeScript conventions vi har brugt:**

1. **Interface for objekter:**

```typescript
interface Post {
  id: string;
  caption: string;
  // ...
}
```

2. **Props interfaces:**

```typescript
interface PostCardProps {
  post: Post;
}
```

3. **Server Actions pattern:**

```typescript
async function actionName(formData: FormData) {
  "use server";
  const field = formData.get("field") as string;
  // ...
}
```

4. **Type assertions ved FormData:**

```typescript
const caption = formData.get("caption") as string;
```

5. **Lad TypeScript inferere return types:**

```typescript
// ✅ Godt - TypeScript infererer automatisk at async funktioner returnerer Promise
async function createPost(formData: FormData) {
  "use server";
  // ...
}

// ❌ Unødvendigt - redundant type annotation
async function createPost(formData: FormData): Promise<void> {
  "use server";
  // ...
}
```

6. **Simple types frem for komplekse:**

```typescript
// ✅ Godt - simpelt og læseligt
const posts: Post[] = Object.keys(dataObject).map(...)

// ❌ Undgå - for komplekst
const dataObject: Record<string, Omit<Post, "id">> = ...
```

---

## Opsummering og Refleksion

**Du har nu migreret hele applikationen til TypeScript!**

✅ **Installeret:** TypeScript + type definitions  
✅ **Konfigureret:** tsconfig.json + next-env.d.ts  
✅ **Types oprettet:** Post og User interfaces  
✅ **Komponenter:** Alle .js filer -> .tsx med typed props  
✅ **Pages:** Alle routes typed inkl. dynamic routes  
✅ **Server Actions:** Typed FormData parametre

### Refleksionsspørgsmål (besvar skriftligt):

**Om læring:**

1. Hvad er den største fordel du har oplevet ved TypeScript?
2. Hvilke konkrete fejl fangede TypeScript før runtime?
3. Hvordan hjalp IntelliSense/autocomplete dig?

**Om forståelse:** 4. Forklar med dine egne ord: Hvad er forskellen på compile-time og runtime fejl? 5. Hvad er en interface, og hvorfor er den nyttig? 6. Hvorfor infererer TypeScript return types automatisk på async funktioner?

**Om praksis:** 7. Ville du vælge TypeScript til dit næste projekt? Hvorfor/hvorfor ikke? 8. Hvilke situationer kan du forestille dig TypeScript er særligt værdifuldt? 9. Hvad var det sværeste ved at migrere til TypeScript?

**Sammenlign før og efter:**

| Aspekt                 | JavaScript                            | TypeScript                              |
| ---------------------- | ------------------------------------- | --------------------------------------- |
| Stavefejl i properties | Opdages ved runtime (eller slet ikke) | Opdages med det samme                   |
| Manglende properties   | Runtime fejl                          | Compile-time fejl                       |
| Autocomplete           | Begrænset                             | Fuld understøttelse                     |
| Refactoring sikkerhed  | Risikabelt                            | Sikkert - TypeScript finder alle steder |
| Dokumentation          | Skal skrives separat                  | Types fungerer som dokumentation        |

### Hvad har du lært?

Skriv 3-5 konkrete ting du har lært om:

- **Type safety:** Hvordan hjælper det dig?
- **Development experience:** Hvad blev bedre?
- **Best practices:** Hvilke patterns vil du bruge fremover?

---

## Bonus: Avancerede TypeScript Features (Valgfrit)

Hvis du vil gå dybere med TypeScript, kan du udforske:

### Generics

```typescript
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  return data as T;
}

// Brug:
const posts = await fetchData<Post[]>(`${process.env.FIREBASE_URL}/posts.json`);
const user = await fetchData<User>(`${process.env.FIREBASE_URL}/users/${uid}.json`);
```

### Utility Types

```typescript
// Partial - gør alle properties optional
type PartialPost = Partial<Post>;

// Omit - fjern specific properties
type PostCreateData = Omit<Post, "id" | "createdAt">;

// Pick - vælg specific properties
type PostPreview = Pick<Post, "id" | "caption" | "image">;
```

### Type Guards

```typescript
function isPost(obj: any): obj is Post {
  return (
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.caption === "string" &&
    typeof obj.image === "string"
  );
}
```

### Literal Types

```typescript
export type PostStatus = "draft" | "published" | "archived";
export type UserRole = "admin" | "user" | "moderator";
```

---

**Tillykke! Du har nu migreret din Next.js app til TypeScript! 🎉**
