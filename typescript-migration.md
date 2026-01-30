# Modul 5: Implementer TypeScript

## Oversigt

I dette modul vil du migrere applikationen fra JavaScript til TypeScript. Du vil lære at arbejde med type safety og se hvordan TypeScript kan hjælpe med at undgå fejl.

---

## Opgave 5.1: Installer TypeScript

**Installation:**

```bash
npm install -D typescript @types/react @types/node
```

**Automatisk konfiguration:**

Omdøb en `.js` fil til `.tsx` - Next.js opretter automatisk `tsconfig.json`.

For eksempel:

```bash
mv components/Nav.js components/Nav.tsx
```

Start development server: `npm run dev`

Next.js vil automatisk:

- Oprette `tsconfig.json` med optimale indstillinger
- Oprette `next-env.d.ts` med type definitions

---

## Opgave 5.2: Gradvis Migration - Start med Types

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

2. **Migrer komponenter én ad gangen:**

**Start med små komponenter (`UserAvatar.tsx`):**

```typescript
import { User } from "@/types/types";

interface UserAvatarProps {
  user: User;
  size?: "small" | "medium" | "large";
}

export default function UserAvatar({ user, size = "medium" }: UserAvatarProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  return <img className={`${sizeClasses[size]} rounded-full object-cover`} src={user.image} alt={user.name} />;
}
```

**Migrer PostCard komponenten:**

```typescript
import { Post, User } from "@/types/types";
import Link from "next/link";

interface PostCardProps {
  post: Post;
  user: User;
}

export default function PostCard({ post, user }: PostCardProps) {
  return <article className="bg-white rounded-lg shadow-md p-6">{/* ... */}</article>;
}
```

**Migrer FormPost komponenten:**

```typescript
"use client";
import { useFormState } from "react-dom";

interface FormPostProps {
  post?: Post;
  action: (prevState: any, formData: FormData) => Promise<void>;
}

export default function FormPost({ post, action }: FormPostProps) {
  const [state, formAction] = useFormState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      {/* ... */}
    </form>
  );
}
```

3. **Tilføj return types til funktioner:**

```typescript
async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${process.env.FIREBASE_URL}/posts.json`);
  const data = await response.json();
  // ...
  return posts;
}

async function getUser(uid: string): Promise<User | null> {
  const response = await fetch(`${process.env.FIREBASE_URL}/users/${uid}.json`);
  const user = await response.json();
  return user;
}
```

---

## Opgave 5.3: Type Server Actions

**Server Actions med TypeScript:**

```typescript
"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData): Promise<void> {
  const caption = formData.get("caption") as string;
  const image = formData.get("image") as string;
  const uid = formData.get("uid") as string;

  if (!caption || !image || !uid) {
    throw new Error("Missing required fields");
  }

  const newPost = {
    caption,
    image,
    uid,
    createdAt: Date.now()
  };

  await fetch(`${process.env.FIREBASE_URL}/posts.json`, {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-Type": "application/json"
    }
  });

  revalidatePath("/posts");
  redirect("/posts");
}

export async function updatePost(id: string, formData: FormData): Promise<void> {
  const caption = formData.get("caption") as string;
  const image = formData.get("image") as string;

  const updates = {
    caption,
    image
  };

  await fetch(`${process.env.FIREBASE_URL}/posts/${id}.json`, {
    method: "PATCH",
    body: JSON.stringify(updates)
  });

  revalidatePath("/posts");
  redirect(`/posts/${id}`);
}

export async function deletePost(id: string): Promise<void> {
  await fetch(`${process.env.FIREBASE_URL}/posts/${id}.json`, {
    method: "DELETE"
  });

  revalidatePath("/posts");
  redirect("/posts");
}
```

---

## Opgave 5.4: Type Page Components

**Server Components (Pages):**

```typescript
import { Post, User } from "@/types/types";

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const post = await getPost(params.id);

  if (!post) {
    return <div>Post not found</div>;
  }

  const user = await getUser(post.uid);

  return <main className="max-w-3xl mx-auto px-4 py-8">{/* ... */}</main>;
}
```

**Search Params:**

```typescript
interface PostsPageProps {
  searchParams: {
    filter?: string;
    sort?: "newest" | "oldest";
  };
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const posts = await getPosts();

  // Filter and sort based on searchParams
  let filteredPosts = posts;

  if (searchParams.filter) {
    filteredPosts = posts.filter(post => post.caption.toLowerCase().includes(searchParams.filter!.toLowerCase()));
  }

  if (searchParams.sort === "oldest") {
    filteredPosts.sort((a, b) => a.createdAt - b.createdAt);
  } else {
    filteredPosts.sort((a, b) => b.createdAt - a.createdAt);
  }

  return <main className="max-w-6xl mx-auto px-4 py-8">{/* ... */}</main>;
}
```

---

## Opgave 5.5: Eksempler på TypeScript Fordele

**Find og dokumentér eksempler hvor TypeScript hjælper:**

1. **Prop validation:**

   - Hvad sker der hvis du sender forkert prop type?
   - Skab bevidst en fejl og se TypeScript fejlen

   Eksempel:

   ```typescript
   // ❌ Dette vil give en TypeScript fejl:
   <PostCard post={user} user={post} />

   // ✅ Korrekt:
   <PostCard post={post} user={user} />
   ```

2. **API responses:**

   - Type Firebase responses
   - Hvad hvis Firebase returnerer noget uventet?

   ```typescript
   async function getPosts(): Promise<Post[]> {
     const response = await fetch(`${process.env.FIREBASE_URL}/posts.json`);
     const data = await response.json();

     // TypeScript tvinger dig til at håndtere null/undefined
     if (!data) {
       return [];
     }

     const posts: Post[] = Object.keys(data).map(key => ({
       id: key,
       ...data[key]
     }));

     return posts;
   }
   ```

3. **Server Actions:**

   - Type FormData ekstraktion
   - Hvad kunne gå galt uden types?

   ```typescript
   // Med TypeScript får du autocomplete og type checking:
   const caption = formData.get("caption") as string;

   // TypeScript advarer hvis du glemmer null check:
   if (!caption) {
     throw new Error("Caption is required");
   }
   ```

**Opret `TYPESCRIPT_EXAMPLES.md` med:**

- 3 eksempler hvor TypeScript fangede en fejl
- 3 eksempler hvor TypeScript gjorde koden mere læsbar
- Screenshots af TypeScript intellisense i VS Code

---

## Opgave 5.6: Forbedr med Strenge Types

**Gør types mere præcise:**

1. **Brug literal types:**

```typescript
export type PostStatus = "draft" | "published" | "archived";
export type UserRole = "admin" | "user" | "moderator";

export interface Post {
  id: string;
  caption: string;
  image: string;
  uid: string;
  createdAt: number;
  status?: PostStatus;
}

export interface User {
  id: string;
  name: string;
  title: string;
  image: string;
  role?: UserRole;
}
```

2. **Brug Generics:**

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

3. **Brug Utility Types:**

```typescript
// Partial - gør alle properties optional
type PartialPost = Partial<Post>;

// Anvendelse i update funktioner:
async function updatePost(id: string, updates: Partial<Post>): Promise<void> {
  await fetch(`${process.env.FIREBASE_URL}/posts/${id}.json`, {
    method: "PATCH",
    body: JSON.stringify(updates)
  });
}

// Omit - fjern specific properties
type PostWithoutId = Omit<Post, "id">;
type PostCreateData = Omit<Post, "id" | "createdAt">;

// Pick - vælg specific properties
type PostPreview = Pick<Post, "id" | "caption" | "image">;

// Required - gør alle properties required
type CompletePost = Required<Post>;
```

4. **Custom Type Guards:**

```typescript
function isPost(obj: any): obj is Post {
  return (
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.caption === "string" &&
    typeof obj.image === "string" &&
    typeof obj.uid === "string" &&
    typeof obj.createdAt === "number"
  );
}

function isUser(obj: any): obj is User {
  return (
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.title === "string" &&
    typeof obj.image === "string"
  );
}

// Brug:
const data = await response.json();
if (isPost(data)) {
  // TypeScript ved nu at data er en Post
  console.log(data.caption);
}
```

---

## Opgave 5.7: Type Component Props Pattern

**Best practices for component props:**

```typescript
// Base props
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Extend base props
interface ButtonProps extends BaseComponentProps {
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export function Button({ children, onClick, variant = "primary", disabled = false, className = "" }: ButtonProps) {
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600",
    secondary: "bg-gray-200 hover:bg-gray-300",
    danger: "bg-red-600 hover:bg-red-700"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg ${variantClasses[variant]} ${className}`}>
      {children}
    </button>
  );
}
```

---

## Reflektion

- Hvilke fejl fangede TypeScript under migrationen?
- Hvordan har TypeScript ændret din udviklererfaring?
- Hvor tilføjede TypeScript mest værdi? (Components? Server Actions? API calls?)
- Hvad er udfordringerne ved TypeScript?
- Ville du bruge TypeScript i alle fremtidige projekter? Hvorfor/hvorfor ikke?
