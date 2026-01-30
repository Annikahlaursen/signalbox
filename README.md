# Next.js Post App 2025

A modern post application built with **Next.js 16** demonstrating best practices for **Server Components**, **Server Actions**, and **CSS Modules**.

## 🎯 Learning Objectives

This project demonstrates:

- ✅ **Next.js 16** - Latest features and patterns
- ✅ **React 19** - Server Components architecture
- ✅ **Server Actions** - Secure server-side data mutations
- ✅ **CSS Modules** - Component-scoped styling
- ✅ **Firebase Realtime Database** - Backend integration
- ✅ **Async/Await** - Modern data fetching
- ✅ **Dynamic Routes** - File-based routing

## 📁 Project Structure

```
app/
├── layout.js              # Root layout with Nav
├── page.js                # Home page
├── page.module.css        # Home page styles
├── globals.css            # Global styles & design tokens
└── posts/
    ├── page.js            # Posts list (Server Component)
    ├── page.module.css    # Posts list styles
    ├── create/
    │   ├── page.js        # Create post (Server Action)
    │   └── page.module.css
    └── [id]/
        ├── page.js        # Post detail (Dynamic Route)
        ├── page.module.css
        └── update/
            ├── page.js    # Update post (Server Action)
            └── page.module.css

components/
├── Nav.js                 # Navigation (Client Component)
├── Nav.module.css
├── PostCard.js            # Post card (Server Component)
├── PostCard.module.css
├── UserAvatar.js          # User avatar (Async Server Component)
├── UserAvatar.module.css
├── FormPost.js            # Post form (Client Component)
└── FormPost.module.css
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase Realtime Database setup
- Environment variables configured

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-firebase-db.firebaseio.com
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Key Concepts

### Server Components (Default)

All components are Server Components by default, enabling:

- Server-side data fetching
- Zero JavaScript sent to client
- Direct database access
- Better performance

```javascript
// app/posts/page.js
export default async function PostsPage() {
  const response = await fetch(url);
  const posts = await response.json();
  return <div>{/* Render posts */}</div>;
}
```

### Client Components (Only When Needed)

Use `"use client"` only for interactivity:

- State management (`useState`, `useReducer`)
- Event handlers
- Browser APIs
- Hooks like `usePathname`, `useSearchParams`

```javascript
// components/Nav.js
"use client";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  // Client-side interactivity
}
```

### Server Actions

Secure server-side mutations without API routes:

```javascript
async function createPost(formData) {
  "use server";
  const caption = formData.get("caption");
  await fetch(url, { method: "POST", body: JSON.stringify({ caption }) });
  redirect("/posts");
}
```

### CSS Modules

Component-scoped styling prevents conflicts:

```javascript
import styles from "./Component.module.css";

export default function Component() {
  return <div className={styles.container}>Content</div>;
}
```

## 🎨 Styling Architecture

### Design System (globals.css)

```css
:root {
  --background: #fafafa;
  --foreground: #fff;
  --text-primary: #000;
  --text-secondary: #666;
  --border-color: #ebebeb;
}
```

All components use CSS variables for consistent theming with automatic dark mode support.

## 📚 Best Practices Demonstrated

### 1. Proper Component Types

- Server Components for data fetching
- Client Components minimized (only Nav & FormPost)
- Async Server Components (UserAvatar)

### 2. Data Fetching

- `cache: 'no-store'` for dynamic data (Next.js 15+ requirement)
- Async/await in Server Components
- No client-side data fetching

### 3. Routing

- File-based routing
- Dynamic routes `[id]`
- Nested layouts
- `redirect()` after mutations

### 4. Forms & Actions

- Progressive enhancement
- Server Actions for mutations
- FormData API
- No client-side JavaScript required

### 5. Styling

- CSS Modules (scoped)
- CSS Variables (theming)
- Mobile-first responsive design
- Dark mode support

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_firebase_database_url
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules)

## 👨‍💻 Author

Created as a teaching example for web development students.

## 📝 License

This project is open source and available for educational purposes.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
