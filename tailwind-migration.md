# Modul 4: Migrer til Tailwind CSS

## Oversigt

I dette modul vil du migrere hele applikationen fra CSS Modules til Tailwind CSS. Du vil lære at arbejde med utility-first CSS og se hvordan det kan forbedre din udviklingshastighed.

---

## Opgave 4.0: Opret et nyt branch til migrering

**Før du starter migreringen, opret et nyt branch så du kan arbejde sikkert:**

1. **Sørg for at du er på `main` branch og har de seneste ændringer:**

```bash
git checkout main
git pull
```

2. **Opret et nyt branch til Tailwind migrering:**

```bash
git checkout -b tailwind-migration
```

3. **Verificer at du er på det nye branch:**

```bash
git branch
```

Du skulle gerne se `* tailwind-migration` (stjernen viser hvilket branch du er på).

**Hvorfor et nyt branch?**

- Dit `main` branch forbliver uændret
- Du kan eksperimentere frit uden risiko
- Nemt at gå tilbage hvis noget går galt
- Let at merge ændringer tilbage til `main` når du er færdig

---

## Opgave 4.1: Installer Tailwind og VS Code Extension

**VIGTIGT: Installer VS Code Extension først!**

1. **Åbn VS Code Extensions (Cmd+Shift+X / Ctrl+Shift+X)**
2. **Søg efter: "Tailwind CSS IntelliSense"**
3. **Installer extensionen fra Tailwind Labs**
   - Denne extension giver dig autocomplete og preview af Tailwind classes
   - Du vil se farver, spacing og andre værdier når du skriver classes
   - Helt essentiel for at arbejde effektivt med Tailwind!

**Følg Next.js officielle dokumentation
(Gengivet nedenunder):**

https://nextjs.org/docs/app/getting-started/css#tailwind-css

**Installation (den nye måde i Next.js 16):**

```bash
npm install -D tailwindcss @tailwindcss/postcss
```

**Konfigurer PostCSS:**

Opret `postcss.config.mjs` i roden af projektet:

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};
```

**Opdater `app/globals.css`:**

Erstat alt indholdet med:

```css
@import "tailwindcss";
```

**Note:** Dette er den mindste konfiguration. Senere vil vi tilføje CSS variables og custom animations når vi migrerer komponenter.

**Verificer installation:**

Test at Tailwind virker ved at tilføje utility classes i en komponent - f.eks. i `app/page.js`:

```javascript
<h1 className="text-4xl font-bold">Test</h1>
```

Start development server: `npm run dev` og tjek at styling virker.

**Test VS Code Extension:**

Når du skriver `className="bg-` skulle du nu se autocomplete suggestions med farve preview!

Erstat nu `app/layout.js` med:

```javascript
import "./globals.css";
import Nav from "@/components/Nav";

// Metadata for SEO
export const metadata = {
  title: "Next.js Post App",
  description: "A modern post application built with Next.js 16"
};

// Root Layout - wraps all pages
export default function RootLayout({ children }) {
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

- Test i browseren.
- Hvad er forskellen?
- Har vi tilføjet noget Tailwind relateret? Hvor?

---

## Opgave 4.2: Forstå Tailwind Utility Classes

**Hvad er Tailwind CSS?**

Tailwind er et "utility-first" CSS framework. I stedet for at skrive custom CSS, bruger du små, genbrugelige CSS klasser direkte i din JSX.

**Quick Reference - De 10 mest brugte classes:**

1. `flex` - Layout med flexbox
2. `p-4` - Padding 16px
3. `m-4` - Margin 16px
4. `bg-white` - Hvid baggrund
5. `text-gray-900` - Mørk tekst
6. `rounded-lg` - Afrundede hjørner
7. `shadow-md` - Mellemhård skygge
8. `hover:bg-blue-600` - Ændring ved hover
9. `w-full` - Fuld bredde
10. `gap-4` - Mellemrum mellem elementer

**Med disse 10 classes kan du style 80% af din app!**

**Design strategi:**

Vi holder det simpelt og bruger én konsistent "dark" stil gennem hele appen:

- Mørk baggrund: `bg-[#1a1a1a]`
- Hvis der er brug for hvis baggrund kan det være: `bg-white`
- Mørk tekst: `text-[#ededed]` på mørke baggrunde, `text-black` på lyse
- Gråtoner til sekundær tekst: `text-gray-400`, `text-gray-600`

**Eksempel:**

```javascript
// Mørk baggrund med hvide cards
className = "bg-black"; // Page baggrund
className = "bg-white"; // Card baggrund
className = "text-black"; // Tekst på hvid baggrund
```

---

**Eksempel - Fra CSS Modules til Tailwind:**

```javascript
// TIDLIGERE med CSS Modules:
import styles from "./Nav.module.css";
<nav className={styles.nav}>
  <h1 className={styles.title}>Posts</h1>
</nav>

// CSS fil:
.nav {
  display: flex;
  padding: 1rem;
  background-color: #333;
}
.title {
  color: white;
  font-size: 1.5rem;
}
```

```javascript
// NU med Tailwind:
<nav className="flex p-4 bg-gray-800">
  <h1 className="text-white text-2xl">Posts</h1>
</nav>

// Ingen CSS fil nødvendig!
```

**De mest brugte Tailwind classes:**

**Layout:**

- `flex` = display: flex
- `grid` = display: grid
- `block` = display: block
- `hidden` = display: none

**Spacing (padding og margin):**

- `p-4` = padding: 1rem (16px)
- `px-4` = padding left og right: 1rem
- `py-4` = padding top og bottom: 1rem
- `pt-4` = padding-top: 1rem
- `pb-4` = padding-bottom: 1rem
- `m-4` = margin: 1rem
- `mx-auto` = margin left og right: auto (bruges til at centrere)
- `gap-4` = gap: 1rem (mellemrum mellem flex/grid børn)
- `space-y-4` = margin-top: 1rem mellem alle børn (vertical spacing)

**Skala (de mest brugte):**

- `0` = 0px
- `1` = 0.25rem (4px) - meget lille
- `2` = 0.5rem (8px) - lille
- `4` = 1rem (16px) - ⭐ standard, meget brugt
- `6` = 1.5rem (24px) - mellem
- `8` = 2rem (32px) - stor
- `12` = 3rem (48px) - meget stor

**Tip:** Start med at bruge `4` og `8`, tilpas derefter efter behov!

**Farver:**

- `bg-gray-800` = baggrund mørk grå
- `text-white` = hvid tekst
- `text-gray-600` = grå tekst
- Farver: `gray, red, blue, green, yellow, purple` osv.
- Nuancer: `50` (meget lys) → `500` (mellem) → `900` (meget mørk)

**Tommelfingerregel for nuancer:**

- `50-200` = Lyse farver (baggrunde, subtle highlights)
- `300-500` = Mellem farver (borders, sekundære elementer)
- `600-900` = Mørke farver (primær tekst, knapper, vigtige elementer)

**Eksempel:**

- `bg-blue-500` = Medium blå knap
- `hover:bg-blue-600` = Lidt mørkere ved hover
- `text-gray-900` = Næsten sort tekst (bedre end pure black!)
- `border-gray-300` = Lys grå border

**Typography:**

- `text-sm` = font-size: 0.875rem (14px)
- `text-base` = font-size: 1rem (16px)
- `text-lg` = font-size: 1.125rem (18px)
- `text-xl` = font-size: 1.25rem (20px)
- `text-2xl` = font-size: 1.5rem (24px)
- `font-bold` = font-weight: 700
- `font-semibold` = font-weight: 600

**Borders og Afrunding:**

- `border` = border: 1px solid
- `border-2` = border: 2px solid
- `rounded` = border-radius: 0.25rem
- `rounded-lg` = border-radius: 0.5rem
- `rounded-full` = border-radius: 9999px (cirkel)

**Hover og States:**

- `hover:bg-blue-600` = ændrer baggrund ved hover
- `hover:text-white` = ændrer tekst farve ved hover
- `transition` = tilføjer smooth transition

**Responsive Design:**

- `md:flex` = flex kun på medium screens og større
- `lg:text-2xl` = større tekst på large screens
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

**Praktisk øvelse - oversæt app/page.module.css til Tailwind på app/page.js**:

I denne øvelse skal du konvertere hele homepage'en (`app/page.js`) fra CSS Modules til Tailwind CSS.

**Trin 1: Undersøg den eksisterende styling**

Åbn `app/page.module.css` og se hvilke klasser der skal konverteres:

```css
.page {
  min-height: 100vh;
  padding: 80px 20px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
  max-width: 600px;
}

.logo {
  margin-bottom: 40px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}

.description {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}

.ctas {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.primaryButton {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  background-color: var(--text-primary);
  color: var(--background);
  transition: all 0.2s;
}

.primaryButton:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

.secondaryButton {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.secondaryButton:hover {
  background-color: var(--foreground);
}
```

**Trin 2: Konverter CSS klasser til Tailwind utilities**

Her er mappingen for hver klasse:

| CSS Module Klasse  | Tailwind Utilities                                                                                                | Forklaring                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `.page`            | `min-h-screen pt-20 pb-10 px-5 flex items-center justify-center`                                                  | `min-h-screen` = min-height: 100vh, `pt-20` = padding-top: 80px, `pb-10` = padding-bottom: 40px, `px-5` = padding left/right: 20px |
| `.container`       | `text-center max-w-[600px]`                                                                                       | Centrerer tekst og sætter max bredde (brug arbitrary value [600px])                                                                |
| `.logo`            | `mb-10`                                                                                                           | `mb-10` = margin-bottom: 40px                                                                                                      |
| `.title`           | `text-[32px] font-semibold mb-4 tracking-tight text-[#ededed]`                                                    | Brug arbitrary values for specifikke størrelser og farver                                                                          |
| `.description`     | `text-base text-gray-400 mb-8 leading-relaxed`                                                                    | `text-base` = 16px, `leading-relaxed` = line-height: 1.6                                                                           |
| `.ctas`            | `flex gap-4 justify-center`                                                                                       | Flexbox med gap mellem elementer                                                                                                   |
| `.primaryButton`   | `px-6 py-3 rounded-lg font-medium bg-[#ededed] text-black transition-all hover:opacity-85 hover:-translate-y-0.5` | Alle button styles inkl. hover states                                                                                              |
| `.secondaryButton` | `px-6 py-3 rounded-lg font-medium border border-gray-700 transition-all hover:bg-[#1a1a1a]`                       | Border button med hover                                                                                                            |

**Trin 3: Opdater app/page.js**

Erstat CSS Module klasserne med Tailwind utilities:

**FØR (med CSS Modules):**

```jsx
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Image className={styles.logo} src="/next.svg" alt="Next.js logo" width={180} height={37} priority />
        <h1 className={styles.title}>Next Post App</h1>
        <p className={styles.description}>En moderne blog platform...</p>
        <div className={styles.ctas}>
          <a href="/posts" className={styles.primaryButton}>
            Se Posts
          </a>
          <a href="/posts/create" className={styles.secondaryButton}>
            Opret Post
          </a>
        </div>
      </div>
    </div>
  );
}
```

**EFTER (med Tailwind):**

```jsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-5 flex items-center justify-center">
      <main className="text-center max-w-[600px]">
        <h1 className="text-[32px] font-semibold mb-4 tracking-tight text-[#ededed]">Next Post App</h1>
        <p className="text-base text-gray-400 mb-8 leading-relaxed">En moderne blog platform...</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/posts"
            className="px-6 py-3 rounded-lg font-medium bg-[#ededed] text-black transition-all hover:opacity-85 hover:-translate-y-0.5">
            Se Posts
          </Link>
          <Link
            href="/posts/create"
            className="px-6 py-3 rounded-lg font-medium border border-gray-700 transition-all hover:bg-[#1a1a1a]">
            Opret Post
          </Link>
        </div>
      </main>
    </div>
  );
}
```

**Bemærk ændringerne:**

- ❌ Fjernet `import Image from "next/image"` og Next.js logoet (ikke nødvendigt for denne app)
- Ændret `<div>` til `<main>` for bedre semantisk HTML
- Bruger `Link` komponent i stedet for `<a>` tag for interne links

**Trin 4: Fjern CSS Module importen**

Slet linjen:

```jsx
import styles from "./page.module.css";
```

**Trin 5: Slet CSS Module filen**

Nu hvor `app/page.js` bruger Tailwind, kan du slette den gamle CSS fil:

```bash
rm app/page.module.css
```

**Vigtige læringspunkter:**

1. **Arbitrary Values**: Brug `[32px]`, `[600px]`, `[#ededed]` når Tailwind ikke har præcis den værdi
2. **Hover States**: Prefix med `hover:` - fx `hover:opacity-85`
3. **Utility First**: Hver CSS property bliver til en utility class
4. **Transitions**: `transition-all` erstatter `transition: all 0.2s`
5. **Spacing**: Tailwinds spacing scale (4 = 16px, 10 = 40px, etc.)

**Checklist:**

- [ ] Fjernet `import styles from "./page.module.css"`
- [ ] Konverteret alle `className={styles.x}` til Tailwind utilities
- [ ] Hover effects virker på knapperne
- [ ] Slettet `app/page.module.css` filen
- [ ] Layout ser identisk ud i browseren
- [ ] Ingen console errors

---

## Opgave 4.4: Migrer UserAvatar Komponenten

**Nu skal vi prøve uden alt for meget hjælp! **

- Migrer `UserAvatar` komponenten til Tailwind helt selv.
- Åben http://localhost:3000/posts så du kan se hvordan den ser ud lige nu.
- Åben så UserAvatar komponenten og begynd at migrere.

**Tilladt hjælp:**

- Opgave 4.2 (utility classes reference)
- Tailwind dokumentation: https://tailwindcss.com/docs
- VS Code IntelliSense

**IKKE tilladt:**

- At scrolle ned til "Hjælp" sektionen før du har prøvet i minimum 15 minutter

**Checklist når du er færdig:**

- [ ] Billedet er cirkulært
- [ ] Billedet fylder den rigtige størrelse (40x40px)
- [ ] Navn og titel er hvide og synlige på mørk baggrund
- [ ] CSS Module import er fjernet
- [ ] Det ser ud som før i browseren

---

<details>
<summary><strong>🆘 Hjælp (kun hvis du virkelig sidder fast efter 15+ minutter)</strong></summary>

**Først skal du se den originale CSS Module styling:**

```css
/* UserAvatar.module.css */
.avatar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.avatarImage {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.userInfo {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.userInfo h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.2;
}

.userInfo p {
  font-size: 12px;
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.2;
}
```

**FØR (med CSS Modules):**

```javascript
import Image from "next/image";
import styles from "./UserAvatar.module.css";

export default async function UserAvatar({ uid }) {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${uid}.json`;
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
```

**EFTER (med Tailwind):**

```javascript
import Image from "next/image";

export default async function UserAvatar({ uid }) {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/users/${uid}.json`;
  const response = await fetch(url);
  const user = await response.json();

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

**Forklaring af CSS → Tailwind mapping:**

| CSS Module     | Tailwind Classes                                     | Forklaring                                      |
| -------------- | ---------------------------------------------------- | ----------------------------------------------- |
| `.avatar`      | `flex items-center gap-3 mb-3`                       | Flexbox container med 12px gap og margin-bottom |
| `.avatarImage` | `w-10 h-10 rounded-full object-cover shrink-0`       | 40x40px cirkulært billede der ikke krymper      |
| `.userInfo`    | `flex flex-col gap-0.5`                              | Vertikal flex container med 2px gap             |
| `.userInfo h3` | `text-sm font-semibold m-0 text-white leading-tight` | 14px bold hvid tekst                            |
| `.userInfo p`  | `text-xs m-0 text-white leading-tight`               | 12px hvid tekst                                 |

**Vigtige læringspunkter:**

1. **Tailwind størrelser:** `w-10 h-10` = 40px (Tailwind bruger 4px spacing scale)
2. **Gap utilities:** `gap-3` = 12px, `gap-0.5` = 2px (mellem navn og titel)
3. **Cirkulært billede:** `rounded-full` gør billeder perfekt runde
4. **Shrink:** `shrink-0` forhindrer billedet i at krympe (erstatter `flex-shrink: 0`)
5. **Tekstfarve:** `text-[#ededed]` for lys tekst der er synlig på mørk baggrund
6. **Leading:** `leading-tight` = `line-height: 1.2`

**Trin for at færdiggøre migreringen:**

1. **Fjern CSS Module importen:**

   ```javascript
   import styles from "./UserAvatar.module.css";
   ```

2. **Slet CSS Module filen:**
   ```bash
   rm components/UserAvatar.module.css
   ```

**VIGTIG note om tekstfarver:**

Selv om du har tilføjet `text-[#ededed]` til `h3` (user.name), kan det være at teksten stadig vises mørk i browseren. Det er fordi PostCard komponenten har CSS Module styling der overskriver dette. Når du migrerer PostCard til Tailwind i næste opgave, vil den lyse tekstfarve slå igennem korrekt!

</details>

---

## Opgave 4.5: Migrer PostCard Komponenten

**Udfordring: Del komponenten op i små dele! 🧩**

PostCard er en vigtig komponent i app'en. Den viser et post med bruger info, billede og caption.

**Din strategi:**

1. **Opdel komponenten mentalt:**

   - Container (article) med baggrund, padding, border-radius
   - UserAvatar komponent (allerede migreret!)
   - Post billede
   - Caption tekst (h3)

2. **Migrer ét element ad gangen:**

   - Start med container
   - Test i browseren
   - Fortsæt med næste element
   - Test igen

3. **Brug "Inspicér Element" i browseren:**
   - Højreklik på PostCard → Inspicér
   - Se de nuværende CSS regler
   - Oversæt til Tailwind utilities

**Tilladt hjælp:**

- Du må se på tidligere komponenter som inspiration
- Du må bruge Tailwind docs
- Du må bruge VS Code IntelliSense

**Checklist når du er færdig:**

- [ ] Card har mørk baggrund (lysere end page baggrund)
- [ ] Card har afrundede hjørner og shadow
- [ ] Hover effekt løfter card og gør shadow større
- [ ] Billede fylder fuld bredde og har fast højde
- [ ] Caption tekst er lys og læsbar
- [ ] CSS Module import er fjernet

**Når du er færdig, sammenlign med guiden nedenfor - er din løsning bedre eller dårligere? Hvorfor?**

---

<details>
<summary><strong>💡 Hints (hvis du sidder fast - åbn ét hint ad gangen)</strong></summary>

**Hint 1: Container baggrund**

- Du skal bruge en mørk grå farve som `bg-[#2a2a2a]` - ikke hvid!
- Husk at page baggrunden er sort, så card skal være lysere for at skille sig ud

**Hint 2: Shadow på mørk baggrund**

- Standard Tailwind shadows (`shadow-sm`, `shadow-lg`) er for svage på mørk baggrund
- Du skal bruge arbitrary values: `shadow-[0_2px_8px_rgba(0,0,0,0.3)]`
- Bemærk den højere opacity (0.3) for at skyggen er synlig

**Hint 3: Hover transform**

- Brug `hover:-translate-y-1` til at løfte card
- Kombiner med `hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]` for større shadow

**Hint 4: Billede højde**

- Brug arbitrary value `h-[250px]` for præcis 250px højde
- Husk `object-cover` og `w-full`

**Hint 5: Caption tekst farve**

- Brug `text-[#ededed]` for lys, læsbar tekst på mørk baggrund
- Ikke `text-black` eller `text-gray-900`!

</details>

---

<details>
<summary><strong>📋 Guide til sammenligning (åbn EFTER du har prøvet selv)</strong></summary>

**Først skal du se den originale CSS Module styling:**

```css
/* PostCard.module.css */
.postCard {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 12px;
  background-color: var(--foreground);
  transition: all 0.2s;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.postCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.postCardImage {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
}

.postCard h3 {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-top: 4px;
  line-height: 1.4;
}
```

**FØR (med CSS Modules):**

```javascript
import Image from "next/image";
import styles from "./PostCard.module.css";
import UserAvatar from "./UserAvatar";

export default function PostCard({ post }) {
  return (
    <article className={styles.postCard}>
      <UserAvatar uid={post.uid} />
      <Image src={post.image} alt={post.caption} className={styles.postCardImage} width={500} height={500} />
      <h3>{post.caption}</h3>
    </article>
  );
}
```

**EFTER (med Tailwind):**

```javascript
import Image from "next/image";
import UserAvatar from "./UserAvatar";

export default function PostCard({ post }) {
  return (
    <article className="flex flex-col gap-3 p-5 rounded-xl bg-[#2a2a2a] transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
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

**Forklaring af CSS → Tailwind mapping:**

| CSS Module                  | Tailwind Classes                                            | Forklaring                                                                           |
| --------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `.postCard` container       | `flex flex-col gap-3 p-5 rounded-xl`                        | Vertikal layout, 12px gap, 20px padding, 12px border-radius                          |
| `.postCard` baggrund        | `bg-[#2a2a2a]`                                              | Mørk grå baggrund der kontrasterer mod sort page baggrund                            |
| `.postCard` interaktion     | `transition-all cursor-pointer`                             | Smooth transitions og cursor pointer                                                 |
| `.postCard` shadow          | `shadow-[0_2px_8px_rgba(0,0,0,0.3)]`                        | Synlig mørk skygge (højere opacity end standard for at være synlig på mørk baggrund) |
| `.postCard:hover` transform | `hover:-translate-y-1`                                      | Løfter card 4px ved hover                                                            |
| `.postCard:hover` shadow    | `hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]`                 | Større, dybere skygge ved hover                                                      |
| `.postCardImage`            | `w-full h-[250px] object-cover rounded-lg`                  | Fuld bredde, fast højde 250px, beskærer billede, 8px border-radius                   |
| `.postCard h3`              | `text-base font-medium text-[#ededed] mt-1 leading-relaxed` | 16px, medium weight, lys tekst, lille top margin, 1.4 line-height                    |

**Vigtige læringspunkter:**

1. **Arbitrary values for farver:** `bg-[#2a2a2a]` og `text-[#ededed]` for specifikke farver
2. **Arbitrary values for shadows:** `shadow-[0_2px_8px_rgba(0,0,0,0.3)]` når standard shadows ikke passer
3. **Shadow på mørk baggrund:** Brug højere opacity (0.3-0.5) for at skygger er synlige
4. **Transform utilities:** `hover:-translate-y-1` = `transform: translateY(-4px)`
5. **Arbitrary height:** `h-[250px]` for præcis højde
6. **Kombineret hover state:** Kan kombinere multiple hover utilities på samme element

**Trin for at færdiggøre migreringen:**

1. **Fjern CSS Module importen:**

   ```javascript
   import styles from "./PostCard.module.css";
   ```

2. **Slet CSS Module filen:**
   ```bash
   rm components/PostCard.module.css
   ```

**💡 Bonus tip:** Bemærk hvordan UserAvatar's lyse tekstfarve nu er synlig fordi PostCard ikke længere har CSS Module styling der overskriver det!

</details>

---

## Opgave 4.6: Migrer FormPost Komponenten

**Forms i Tailwind - med responsive design!**

FormPost er en form komponent med grid layout der skal fungere både på mobil og desktop.

**Din strategi:**

1. **Forstå grid layoutet:**

   - Desktop: 2 kolonner (labels i venstre, inputs i højre)
   - Mobil: 1 kolonne (labels over inputs)

2. **Migrer systematisk:**
   - Form container med responsive grid
   - Labels med responsive padding
   - Input fields med dark theme styling
   - Image preview med grid column positioning
   - Button container

**Tilladt hjælp:**

- Tailwind responsive docs: https://tailwindcss.com/docs/responsive-design
- VS Code IntelliSense
- Tidligere komponenter som reference

**Checklist når du er færdig:**

- [ ] Form har 2 kolonner på desktop, 1 kolonne på mobil
- [ ] Labels er hvide og har padding-top kun på desktop
- [ ] Inputs har mørk baggrund og lys tekst
- [ ] Focus state har lys border og subtil shadow
- [ ] Image preview starter i kolonne 2 på desktop
- [ ] Button container starter i kolonne 2 på desktop
- [ ] CSS Module import er fjernet

---

<details>
<summary><strong>💡 Hints (åbn ét ad gangen hvis du sidder fast)</strong></summary>

**Hint 1: Responsive grid**

- Brug `grid-cols-1 md:grid-cols-[1fr_2fr]` for mobile-first design
- `md:` prefix betyder "fra medium breakpoint og op"

**Hint 2: Responsive padding på labels**

- Brug `md:pt-3` så padding-top kun er aktiv på desktop
- På mobil skal labels ikke have top padding

**Hint 3: Input dark theme**

- Baggrund: `bg-[#1a1a1a]`
- Border: `border-gray-700`
- Tekst: `text-[#ededed]`
- Focus border: `focus:border-[#ededed]`

**Hint 4: Grid column positioning**

- Brug `md:col-start-2` til at placere i kolonne 2 på desktop
- På mobil (uden `md:`) starter de automatisk i kolonne 1

**Hint 5: Focus shadow**

- Brug arbitrary value: `focus:shadow-[0_0_0_3px_rgba(237,237,237,0.1)]`
- Dette giver en lys ring omkring input ved focus

</details>

---

<details>
<summary><strong>📋 Fuld løsning (sammenlign EFTER du har prøvet)</strong></summary>

**Først skal du se den originale CSS Module styling:**

```css
/* FormPost.module.css */
.formPost {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
  align-items: start;
  max-width: 800px;
  margin: 20px 0;
}

.formPost label {
  font-weight: 500;
  padding-top: 12px;
  color: var(--text-primary);
}

.formPost input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  background-color: var(--foreground);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.formPost input:focus {
  outline: none;
  border-color: var(--text-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.imagePreview {
  width: 100%;
  height: auto;
  border-radius: 8px;
  grid-column: 2;
}

.btns {
  grid-column: 2;
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.btns button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--text-primary);
  color: var(--background);
}

.btns button:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

@media (max-width: 600px) {
  .formPost {
    grid-template-columns: 1fr;
  }

  .formPost label {
    padding-top: 0;
  }

  .imagePreview {
    grid-column: 1;
  }

  .btns {
    grid-column: 1;
  }
}
```

**FØR (med CSS Modules):**

```javascript
"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./FormPost.module.css";

export default function FormPost({ action, post }) {
  const [image, setImage] = useState(post?.image);

  return (
    <form action={action} className={styles.formPost}>
      <label htmlFor="caption">Caption</label>
      <input id="caption" name="caption" type="text" placeholder="Write a caption..." defaultValue={post?.caption} />
      <label htmlFor="image">Image</label>
      <input
        type="url"
        name="image"
        id="image"
        defaultValue={post?.image}
        placeholder="Paste an image URL"
        onChange={event => setImage(event.target.value)}
      />
      <label htmlFor="image-preview"></label>
      <Image
        id="image-preview"
        className={styles.imagePreview}
        src={image ? image : "https://placehold.co/600x400.webp?text=Paste+image+URL"}
        width={600}
        height={400}
        alt={post?.caption || "Image preview"}
      />
      <div className={styles.btns}>
        <button>{post?.caption ? "Update" : "Create"}</button>
      </div>
    </form>
  );
}
```

**EFTER (med Tailwind):**

```javascript
"use client";

import Image from "next/image";
import { useState } from "react";

export default function FormPost({ action, post }) {
  const [image, setImage] = useState(post?.image);

  return (
    <form action={action} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-start max-w-[800px] my-5">
      <label htmlFor="caption" className="font-medium md:pt-3 text-[#ededed]">
        Caption
      </label>
      <input
        id="caption"
        name="caption"
        type="text"
        placeholder="Write a caption..."
        defaultValue={post?.caption}
        className="w-full p-3 border border-gray-700 rounded-lg text-base font-[inherit] bg-[#1a1a1a] text-[#ededed] transition-colors focus:outline-none focus:border-[#ededed] focus:shadow-[0_0_0_3px_rgba(237,237,237,0.1)]"
      />
      <label htmlFor="image" className="font-medium md:pt-3 text-[#ededed]">
        Image
      </label>
      <input
        type="url"
        name="image"
        id="image"
        defaultValue={post?.image}
        placeholder="Paste an image URL"
        onChange={event => setImage(event.target.value)}
        className="w-full p-3 border border-gray-700 rounded-lg text-base font-[inherit] bg-[#1a1a1a] text-[#ededed] transition-colors focus:outline-none focus:border-[#ededed] focus:shadow-[0_0_0_3px_rgba(237,237,237,0.1)]"
      />
      <label htmlFor="image-preview" className="hidden md:block"></label>
      <Image
        id="image-preview"
        className="w-full h-auto rounded-lg md:col-start-2"
        src={image ? image : "https://placehold.co/600x400.webp?text=Paste+image+URL"}
        width={600}
        height={400}
        alt={post?.caption || "Image preview"}
      />
      <div className="md:col-start-2 flex gap-4 mt-5">
        <button className="px-6 py-3 border-none rounded-lg text-base font-medium cursor-pointer transition-all bg-[#ededed] text-black hover:opacity-85 hover:-translate-y-px">
          {post?.caption ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
```

**Forklaring af CSS → Tailwind mapping:**

| CSS Module              | Tailwind Classes                                                                           | Forklaring                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `.formPost` grid        | `grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-start max-w-[800px] my-5`             | Mobile: 1 kolonne, Desktop: 2 kolonner med arbitrary values |
| `.formPost label`       | `font-medium md:pt-3 text-[#ededed]`                                                       | Responsive padding-top (kun desktop), lys tekst             |
| `.formPost input` base  | `w-full p-3 border border-gray-700 rounded-lg text-base font-[inherit]`                    | Fuld bredde, padding, border, border-radius                 |
| `.formPost input` theme | `bg-[#1a1a1a] text-[#ededed] transition-colors`                                            | Mørk baggrund, lys tekst, smooth transitions                |
| `.formPost input:focus` | `focus:outline-none focus:border-[#ededed] focus:shadow-[0_0_0_3px_rgba(237,237,237,0.1)]` | Fjern outline, lys border, subtil glow effect               |
| `.imagePreview`         | `w-full h-auto rounded-lg md:col-start-2`                                                  | Responsive grid column (kun kolonne 2 på desktop)           |
| `.btns`                 | `md:col-start-2 flex gap-4 mt-5`                                                           | Responsive grid column, flexbox med gap                     |
| `.btns button`          | `px-6 py-3 border-none rounded-lg text-base font-medium cursor-pointer transition-all`     | Button base styling                                         |
| `.btns button` theme    | `bg-[#ededed] text-black hover:opacity-85 hover:-translate-y-px`                           | Lys baggrund, mørk tekst, hover effekter                    |

**Vigtige læringspunkter:**

1. **Mobile-first responsive design:** Start med `grid-cols-1`, tilføj `md:grid-cols-[1fr_2fr]` for desktop
2. **Responsive utilities:** `md:pt-3`, `md:col-start-2`, `md:block` aktiveres kun på medium+ screens
3. **Arbitrary grid values:** `grid-cols-[1fr_2fr]` for custom grid column proportions
4. **Focus states på dark theme:** Brug lys farver for border og shadow
5. **font-[inherit]:** Bevarer font-family fra parent element
6. **Hidden labels:** `hidden md:block` skjuler tomme labels på mobil

**Responsive breakpoints i Tailwind:**

- `sm:` = 640px og op
- `md:` = 768px og op ← Vi bruger denne
- `lg:` = 1024px og op
- `xl:` = 1280px og op

**Trin for at færdiggøre migreringen:**

1. **Fjern CSS Module importen:**

   ```javascript
   import styles from "./FormPost.module.css";
   ```

2. **Slet CSS Module filen:**

   ```bash
   rm components/FormPost.module.css
   ```

3. **Test responsive design:**
   - Åbn browseren og resize vinduet
   - På mobil (<768px): 1 kolonne layout
   - På desktop (≥768px): 2 kolonne layout

</details>

---

## Opgave 4.7: Migrer Sider

**Page layouts i Tailwind - alle posts sider! 📄**

Nu skal du migrere de sidste 4 sider der bruger CSS Modules. Alle disse sider har lignende struktur, så du kan lære et pattern og gentage det.

**Sider at migrere:**

1. `app/posts/page.js` - Posts liste med grid
2. `app/posts/create/page.js` - Opret post form
3. `app/posts/[id]/page.js` - Post detaljer med actions
4. `app/posts/[id]/update/page.js` - Rediger post form

**Fælles patterns:**

- Alle sider: `min-h-screen pt-20 pb-10 px-5` (men **IKKE** `bg-black` - det arves fra layout!)
- Form sider: `max-w-[900px]` container
- Detail sider: `max-w-[800px]` container
- Liste side: `max-w-[1400px]` container
- Headings: `text-[32px] font-semibold mb-6 text-[#ededed] tracking-tight`

**Tilladt hjælp:**

- Se på tidligere migrerede komponenter
- Tailwind grid docs for responsive layouts
- VS Code IntelliSense

**Checklist når alle 4 sider er færdige:**

- [ ] Alle CSS Module imports er fjernet
- [ ] Sider har korrekt padding-top for fixed nav (`pt-20`)
- [ ] Headings er hvide og læsbare
- [ ] Grid på liste siden er responsive
- [ ] Form sider bruger FormPost komponenten korrekt
- [ ] Buttons har konsistent styling
- [ ] **INGEN** `bg-black` på sider (arves fra layout)
- [ ] Alle 4 CSS Module filer er slettet

---

<details>
<summary><strong>💡 Hints (åbn ét ad gangen hvis du sidder fast)</strong></summary>

**Hint 1: Baggrundsfarve**

- Brug **IKKE** `bg-black` på siderne!
- Baggrundsfarven er allerede sat i `app/layout.js` med `bg-[#1a1a1a]`
- Alle sider arver automatisk denne baggrund

**Hint 2: Responsive grid (posts liste)**

- Brug `grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 py-5`
- Dette giver et grid der automatisk tilpasser antal kolonner baseret på skærmstørrelse
- `auto-fill` fylder rækker så meget som muligt

**Hint 3: Container størrelser**

- Posts liste: `max-w-[1400px]` (bred for mange cards)
- Form sider: `max-w-[900px]` (medium for forms)
- Detail side: `max-w-[800px]` (smallere for læsbarhed)

**Hint 4: Post detail card wrapper**

- Wrap PostCard i: `bg-[#2a2a2a] p-6 rounded-xl mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.3)]`
- Dette giver en mørk container omkring post detaljer

**Hint 5: Button styling**

- Update/Create buttons: `px-6 py-3 border-none rounded-lg text-base font-medium cursor-pointer transition-all bg-[#ededed] text-black hover:opacity-85 hover:-translate-y-px`
- Matcher styling fra andre primære buttons i app'en

</details>

---

<details>
<summary><strong>📋 Fuld løsning (sammenlign EFTER du har prøvet)</strong></summary>

### 1. Posts Liste Side (`app/posts/page.js`)

**FØR (med CSS Modules):**

```javascript
import PostCard from "@/components/PostCard";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts.json`;
  const response = await fetch(url);
  const dataObject = await response.json();

  const posts = Object.keys(dataObject).map(key => ({
    id: key,
    ...dataObject[key]
  }));

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.grid}>
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

**EFTER (med Tailwind):**

```javascript
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default async function Home() {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts.json`;
  const response = await fetch(url);
  const dataObject = await response.json();

  const posts = Object.keys(dataObject).map(key => ({
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

### 2. Create Post Side (`app/posts/create/page.js`)

**FØR (med CSS Modules):**

```javascript
import { redirect } from "next/navigation";
import FormPost from "@/components/FormPost";
import styles from "./page.module.css";

export default function CreatePage() {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts.json`;

  async function createPost(formData) {
    "use server";
    const caption = formData.get("caption");
    const image = formData.get("image");

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
    <section className={styles.formPage}>
      <div className={styles.container}>
        <h1>Create New Post</h1>
        <FormPost action={createPost} />
      </div>
    </section>
  );
}
```

**EFTER (med Tailwind):**

```javascript
import { redirect } from "next/navigation";
import FormPost from "@/components/FormPost";

export default function CreatePage() {
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts.json`;

  async function createPost(formData) {
    "use server";
    const caption = formData.get("caption");
    const image = formData.get("image");

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

### 3. Post Detail Side (`app/posts/[id]/page.js`)

**FØR (med CSS Modules):**

```javascript
import PostCard from "@/components/PostCard";
import DeletePostButton from "@/components/DeletePostButton";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function PostPage({ params }) {
  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post = await response.json();

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
    <main className={styles.postPage}>
      <div className={styles.container}>
        <h1>{post.caption}</h1>
        <div className={styles.postCard}>
          <PostCard post={post} />
        </div>
        <div className={styles.btns}>
          <DeletePostButton deleteAction={deletePost} />
          <Link href={`/posts/${id}/update`}>
            <button className={styles.btnUpdate}>Update post</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
```

**EFTER (med Tailwind):**

```javascript
import PostCard from "@/components/PostCard";
import DeletePostButton from "@/components/DeletePostButton";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PostPage({ params }) {
  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post = await response.json();

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

### 4. Update Post Side (`app/posts/[id]/update/page.js`)

**FØR (med CSS Modules):**

```javascript
import FormPost from "@/components/FormPost";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function UpdatePage({ params }) {
  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post = await response.json();

  async function updatePost(formData) {
    "use server";
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

**EFTER (med Tailwind):**

```javascript
import FormPost from "@/components/FormPost";
import { redirect } from "next/navigation";

export default async function UpdatePage({ params }) {
  const { id } = await params;
  const url = `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post = await response.json();

  async function updatePost(formData) {
    "use server";
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
    <section className="min-h-screen pt-20 pb-10 px-5">
      <div className="max-w-[900px] mx-auto py-10 px-5">
        <h1 className="text-[32px] font-semibold mb-6 text-[#ededed] tracking-tight">Update Post</h1>
        <FormPost action={updatePost} post={post} />
      </div>
    </section>
  );
}
```

**Vigtige læringspunkter:**

1. **Layout arv:** Baggrundsfarve sættes i `layout.js` og arves af alle sider - GENTAG IKKE `bg-black`!
2. **Fixed nav spacing:** Alle sider bruger `pt-20` (80px) for at give plads til fixed navigation
3. **Container størrelser:**
   - Liste: `max-w-[1400px]` - bred for grid
   - Form: `max-w-[900px]` - medium for forms
   - Detail: `max-w-[800px]` - smallere for fokus
4. **Responsive grid:** `grid-cols-[repeat(auto-fill,minmax(300px,1fr))]` tilpasser automatisk kolonner
5. **Konsistent styling:** Buttons, headings og spacing matcher på tværs af alle sider

**Trin for at færdiggøre migreringen:**

1. **Fjern CSS Module imports fra alle 4 sider:**

   - Slet `import styles from "./page.module.css";` fra hver fil

2. **VIGTIGT: Slet alle 4 CSS Module filer:**

   ```bash
   rm app/posts/page.module.css
   rm app/posts/create/page.module.css
   rm app/posts/[id]/page.module.css
   rm app/posts/[id]/update/page.module.css
   ```

   **Eller slet dem manuelt i VS Code:**

   - `app/posts/page.module.css`
   - `app/posts/create/page.module.css`
   - `app/posts/[id]/page.module.css`
   - `app/posts/[id]/update/page.module.css`

3. **Verificer i VS Code:**

   - Søg efter `page.module.css` i workspace - der skal **INGEN** resultater være i `app/posts/` mapperne
   - Tjek at der ikke er røde fejl-streger i de migrerede filer

4. **Test alle sider i browseren:**
   - Posts liste viser grid korrekt
   - Create/Update forms fungerer
   - Post detaljer vises korrekt med actions

</details>

---

## Opgave 4.8: Migrer Nav Komponenten

**Navigation med conditional styling! 🧭**

Nav er en Client Component der bruger `usePathname` hook til at highlight den aktive side.

**Udfordringer i denne komponent:**

1. **Fixed positioning** - Nav skal være fixed i toppen
2. **Conditional classes** - Aktiv link skal have anderledes styling
3. **Z-index** - Nav skal være over alt andet indhold
4. **Synlighed** - Nav skal skille sig ud fra baggrunden

**Tilladt hjælp:**

- React conditional rendering dokumentation
- Tailwind positioning docs
- VS Code IntelliSense

**Checklist når du er færdig:**

- [ ] Nav er fixed i toppen af siden
- [ ] Nav har lysere baggrund end page baggrund
- [ ] Border og shadow gør nav synlig
- [ ] Aktiv link har mørk baggrund
- [ ] Hover state virker på inaktive links
- [ ] CSS Module import er fjernet

---

<details>
<summary><strong>💡 Hints (åbn ét ad gangen hvis du sidder fast)</strong></summary>

**Hint 1: Fixed positioning**

- Brug `fixed top-0 left-0 right-0` til at fastgøre nav i toppen over hele bredden
- Husk `z-100` for at nav er over andet indhold

**Hint 2: Synlighed**

- Brug `bg-[#2a2a2a]` - lysere end page baggrund `bg-[#1a1a1a]`
- Tilføj `shadow-md` for dybde
- Brug `border-b border-gray-700` for synlig bund-border

**Hint 3: Conditional classes**

- Brug template literals: `className={\`base-classes ${condition ? "active" : "hover"}\`}`
- Sammenlign `pathname === "/"` for aktiv state
- Aktiv: `bg-black`, Inaktiv hover: `hover:bg-black`

**Hint 4: Gap mellem links**

- Brug `gap-8` for 32px mellemrum mellem nav links
- Centrer med `justify-center`

</details>

---

<details>
<summary><strong>📋 Fuld løsning (sammenlign EFTER du har prøvet)</strong></summary>

**Først skal du se den originale CSS Module styling:**

```css
/* Nav.module.css */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 20px;
  background-color: var(--foreground);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
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
```

**FØR (med CSS Modules):**

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

**EFTER (med Tailwind):**

```javascript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 flex justify-center gap-8 p-5 bg-[#2a2a2a] border-b border-gray-700 shadow-md z-100">
      <Link
        href="/"
        className={`px-4 py-2 rounded-lg font-medium transition-all text-[#ededed] ${
          pathname === "/" ? "bg-black" : "hover:bg-black"
        }`}>
        Home
      </Link>
      <Link
        href="/posts"
        className={`px-4 py-2 rounded-lg font-medium transition-all text-[#ededed] ${
          pathname === "/posts" ? "bg-black" : "hover:bg-black"
        }`}>
        Posts
      </Link>
      <Link
        href="/posts/create"
        className={`px-4 py-2 rounded-lg font-medium transition-all text-[#ededed] ${
          pathname === "/posts/create" ? "bg-black" : "hover:bg-black"
        }`}>
        New Post
      </Link>
    </nav>
  );
}
```

**Forklaring af CSS → Tailwind mapping:**

| CSS Module       | Tailwind Classes                                                 | Forklaring                                           |
| ---------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| `.nav` position  | `fixed top-0 left-0 right-0`                                     | Fixed i toppen over hele bredden                     |
| `.nav` layout    | `flex justify-center gap-8 p-5`                                  | Centreret flex med 32px gap og 20px padding          |
| `.nav` styling   | `bg-[#2a2a2a] border-b border-gray-700 shadow-md`                | Lysere baggrund, synlig border og shadow             |
| `.nav` z-index   | `z-100`                                                          | Z-index 100 for at være over indhold                 |
| `.navLink` base  | `px-4 py-2 rounded-lg font-medium transition-all text-[#ededed]` | Padding, border-radius, font, transitions, lys tekst |
| `.active`        | `bg-black` (conditional)                                         | Mørk baggrund for aktiv link                         |
| `.navLink:hover` | `hover:bg-black` (conditional)                                   | Mørk baggrund ved hover på inaktiv link              |

**Vigtige læringspunkter:**

1. **Conditional classes med template literals:**

   ```javascript
   className={`base-classes ${condition ? "class-if-true" : "class-if-false"}`}
   ```

2. **Fixed positioning:** `fixed top-0 left-0 right-0` dækker fuld bredde
3. **Z-index:** `z-100` sikrer nav er over andet indhold
4. **Synlighed på dark theme:**

   - Lysere baggrund end page: `bg-[#2a2a2a]` vs `bg-[#1a1a1a]`
   - Shadow: `shadow-md` giver dybde
   - Border: `border-gray-700` mere synlig end `border-gray-800`

5. **Client Component:** Husk at beholde `"use client"` da komponenten bruger `usePathname` hook

**Trin for at færdiggøre migreringen:**

1. **Fjern CSS Module importen:**

   ```javascript
   import styles from "./Nav.module.css";
   ```

2. **Slet CSS Module filen:**

   ```bash
   rm components/Nav.module.css
   ```

3. **Test navigation:**
   - Klik rundt mellem sider og se at aktiv link highlightes
   - Hover over inaktive links for at se hover effect
   - Verificer at nav er fixed og synlig over indhold

</details>

---

## Opgave 4.9: Migrer DeletePostButton

DeletePostButton er en komponent med modal dialog og animations.

### Hints

<details>
<summary>💡 Hint 1: Delete button styling</summary>

Delete knappen skal være transparent med rød border og tekst:

- `bg-transparent` - gennemsigtig baggrund
- `text-red-500` og `border-red-500` - rød farve
- `hover:bg-red-500 hover:text-white` - fyldt rød ved hover

</details>

<details>
<summary>💡 Hint 2: Modal overlay</summary>

Modal overlay skal dække hele skærmen:

- `fixed inset-0` - fixed position med top/right/bottom/left: 0
- `bg-black/50` - sort baggrund med 50% gennemsigtighed
- `flex items-center justify-center` - centrer indholdet
- `z-1000` - meget høj z-index

</details>

<details>
<summary>💡 Hint 3: Modal box</summary>

Modal boksen skal have:

- `bg-[#2a2a2a]` - mørk baggrund (matchende vores dark theme)
- `p-8 rounded-xl` - padding og runde hjørner
- `max-w-[450px] w-[90%]` - max bredde og responsiv
- `animate-fadeIn` og `animate-slideIn` - brug custom animations fra globals.css

</details>

<details>
<summary>💡 Hint 4: Modal buttons</summary>

Cancel button:

- `bg-[#1a1a1a]` med `border border-gray-700`
- `text-[#ededed]`
- `hover:bg-[#333333]`

Confirm button:

- `bg-red-500 text-white`
- `hover:bg-red-600`
- Begge har `disabled:opacity-50 disabled:cursor-not-allowed`

</details>

### Løsning

**components/DeletePostButton.module.css (FØR):**

```css
.btnDelete {
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #ef4444;
  border: 2px solid #ef4444;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btnDelete:hover {
  background-color: #ef4444;
  color: white;
}

/* Modal Overlay */
.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;
}

/* Modal Box */
.modal {
  background-color: var(--foreground);
  padding: 2rem;
  border-radius: 12px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.3s ease-out;
}

.modal h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal p {
  margin: 0 0 1.5rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Modal Buttons */
.modalButtons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btnCancel,
.btnConfirm {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btnCancel {
  background-color: var(--background);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btnCancel:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.btnConfirm {
  background-color: #ef4444;
  color: white;
}

.btnConfirm:hover:not(:disabled) {
  background-color: #dc2626;
}

.btnCancel:disabled,
.btnConfirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**components/DeletePostButton.js (FØR):**

```javascript
"use client";

import { useState } from "react";
import styles from "./DeletePostButton.module.css";

export default function DeletePostButton({ deleteAction }) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    await deleteAction();
  }

  return (
    <>
      <button type="button" className={styles.btnDelete} onClick={() => setShowModal(true)}>
        Delete post
      </button>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>Delete Post?</h2>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className={styles.modalButtons}>
              <button className={styles.btnCancel} onClick={() => setShowModal(false)} disabled={isDeleting}>
                Cancel
              </button>
              <button className={styles.btnConfirm} onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

**components/DeletePostButton.js (EFTER):**

```javascript
"use client";

import { useState } from "react";

export default function DeletePostButton({ deleteAction }) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    await deleteAction();
  }

  return (
    <>
      <button
        type="button"
        className="px-6 py-3 bg-transparent text-red-500 border-2 border-red-500 rounded-lg font-medium transition-all hover:bg-red-500 hover:text-white hover:cursor-pointer"
        onClick={() => setShowModal(true)}>
        Delete post
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 animate-fadeIn"
          onClick={() => setShowModal(false)}>
          <div
            className="bg-[#2a2a2a] p-8 rounded-xl max-w-[450px] w-[90%] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] animate-slideIn"
            onClick={e => e.stopPropagation()}>
            <h2 className="m-0 mb-4 text-2xl font-semibold text-[#ededed]">Delete Post?</h2>
            <p className="m-0 mb-6 text-gray-400 leading-relaxed">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-6 py-3 rounded-lg font-medium transition-all border border-gray-700 bg-[#1a1a1a] text-[#ededed] hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                onClick={() => setShowModal(false)}
                disabled={isDeleting}>
                Cancel
              </button>
              <button
                className="px-6 py-3 rounded-lg font-medium transition-all border-none bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                onClick={handleConfirmDelete}
                disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

### CSS → Tailwind Mapping

| CSS Module                                  | Tailwind Classes                                                                                      |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `.btnDelete`                                | `px-6 py-3 bg-transparent text-red-500 border-2 border-red-500 rounded-lg font-medium transition-all` |
| `.btnDelete:hover`                          | `hover:bg-red-500 hover:text-white`                                                                   |
| `.modalOverlay`                             | `fixed inset-0 bg-black/50 flex items-center justify-center z-1000 animate-fadeIn`                    |
| `position: fixed; top/left/right/bottom: 0` | `fixed inset-0`                                                                                       |
| `rgba(0, 0, 0, 0.5)`                        | `bg-black/50`                                                                                         |
| `z-index: 1000`                             | `z-1000`                                                                                              |
| `animation: fadeIn ...`                     | `animate-fadeIn`                                                                                      |
| `.modal`                                    | `bg-[#2a2a2a] p-8 rounded-xl max-w-[450px] w-[90%]`                                                   |
| `animation: slideIn ...`                    | `animate-slideIn`                                                                                     |
| `.modal h2`                                 | `m-0 mb-4 text-2xl font-semibold text-[#ededed]`                                                      |
| `.modal p`                                  | `m-0 mb-6 text-gray-400 leading-relaxed`                                                              |
| `.modalButtons`                             | `flex gap-4 justify-end`                                                                              |
| `.btnCancel`                                | `px-6 py-3 rounded-lg font-medium transition-all border border-gray-700 bg-[#1a1a1a] text-[#ededed]`  |
| `.btnCancel:hover`                          | `hover:bg-[#333333]`                                                                                  |
| `.btnConfirm`                               | `px-6 py-3 rounded-lg font-medium transition-all border-none bg-red-500 text-white`                   |
| `.btnConfirm:hover`                         | `hover:bg-red-600`                                                                                    |
| `:disabled`                                 | `disabled:opacity-50 disabled:cursor-not-allowed`                                                     |

### Læringspunkter

1. **Modal Overlay Pattern**: `fixed inset-0` dækker hele skærmen, `bg-black/50` giver semi-transparent baggrund
2. **Z-index**: `z-1000` sikrer modal ligger over alt andet indhold
3. **Custom Animations**: `animate-fadeIn` og `animate-slideIn` defineret i `globals.css`
4. **Click Propagation**: `onClick={e => e.stopPropagation()}` forhindrer lukning ved klik på modal indhold
5. **Disabled States**: `disabled:opacity-50 disabled:cursor-not-allowed` giver visuelt feedback
6. **Dark Theme Modal**: `bg-[#2a2a2a]` matcher vores mørke tema fra PostCard og Nav
7. **Red Button Styling**: `text-red-500 border-red-500` for delete action med `hover:bg-red-500 hover:text-white`

**Tilføj animations til globals.css:**

For at `animate-fadeIn` og `animate-slideIn` virker, skal vi tilføje custom keyframes til `app/globals.css`:

```css
@import "tailwindcss";

/* Custom animations for modal */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Make animations available as Tailwind utilities */
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}
```

**Slet filen:**

```bash
rm components/DeletePostButton.module.css
```

---

## Opgave 4.10: Tjek og Test Alle Komponenter

**Nu har du migreret alle komponenter. Tid til at teste!**

**Gennemgå hver komponent:**

1. **Nav** - Er navigationen fixed i toppen? Virker hover states?
2. **UserAvatar** - Er billedet cirkulært? Er tekststørrelser korrekte?
3. **PostCard** - Virker hover effect (løft og skygge)? Er spacing korrekt?
4. **FormPost** - Er grid layout korrekt på desktop? Bliver det én kolonne på mobil?
5. **DeletePostButton** - Vises modal korrekt? Virker animations?

**Test i browseren:**

- **Mobil** - Resize browser vinduet til mobil størrelse
- **Desktop** - Test på fuld skærm
- **Styling** - Sammenlign med original design

**Almindelige problemer:**

- Forkert spacing → sammenlign med original CSS Module styling
- Missing transitions → `transition-all` mangler på hover elementer
- Animations virker ikke → tjek at keyframes er tilføjet til `globals.css`

**Når alt fungerer korrekt, er du færdig med migreringen!**

---

## Opgave 5: Slet Alle CSS Module Filer

**Nu hvor alle komponenter og sider bruger Tailwind, er det tid til oprydning (hvis du ikke allerede har slettet filerne undervejs):**

**1. Tjek at alt fungerer:**

- Test hele applikationen i browseren
- Gennemgå alle sider og komponenter
- Verificer at styling ser korrekt ud

**2. Slet CSS Module filer (hvis de stadig findes):**

```bash
# I terminal, slet alle .module.css filer:
rm components/*.module.css
rm app/page.module.css
rm app/posts/page.module.css
rm app/posts/create/page.module.css
rm app/posts/[id]/page.module.css
rm app/posts/[id]/update/page.module.css
```

Eller slet dem manuelt én ad gangen:

**Komponenter:**

- `components/Nav.module.css`
- `components/PostCard.module.css`
- `components/UserAvatar.module.css`
- `components/FormPost.module.css`
- `components/DeletePostButton.module.css`

**Sider:**

- `app/page.module.css`
- `app/posts/page.module.css`
- `app/posts/create/page.module.css`
- `app/posts/[id]/page.module.css`
- `app/posts/[id]/update/page.module.css`

**3. Verificer at projektet stadig kører:**

```bash
npm run dev
```

Hvis du ser fejl om manglende CSS Module imports, skal du tjekke at du har fjernet alle `import styles from "./X.module.css"` linjer.

**4. Commit dine ændringer:**

```bash
git add .
git commit -m "Migrated from CSS Modules to Tailwind CSS"
```

---

## Opgave 6: Eksperimenter og Forbedringer (Valgfri)

**Nu hvor du har Tailwind, kan du nemt justere og forbedre:**

**1. Hover effects er allerede implementeret:**

```javascript
// PostCard hover effect
className = "hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all";

// Button hover effect
className = "hover:opacity-85 hover:-translate-y-px";
```

**2. Juster spacing efter behov:**

```javascript
// Prøv forskellige gap værdier
className = "gap-3 md:gap-4 lg:gap-6";

// Responsive padding
className = "p-4 md:p-6 lg:p-8";
```

**3. Eksperimenter med farver:**

```javascript
// Skift primær knap farve til blå
className = "bg-blue-600 text-white hover:bg-blue-700";

// Eller grøn
className = "bg-green-600 text-white hover:bg-green-700";
```

**4. Fine-tune border radius:**

```javascript
// Fra rounded-xl (12px) til rounded-2xl (16px)
className = "rounded-2xl";

// Eller mere kantede hjørner
className = "rounded-md";
```

**5. Tilføj nye responsive breakpoints:**

```javascript
// Skjul på mobil, vis på tablet
className = "hidden md:block";

// Forskellige layouts på mobil vs desktop
className = "flex-col md:flex-row";
```

---

## Konklusion

🎉 **Tillykke! Du har nu migreret hele Next.js Post App fra CSS Modules til Tailwind CSS!**

**Hvad har du lært:**

- At installere og konfigurere Tailwind CSS i Next.js 16
- At konvertere CSS Module styling til Tailwind utility classes
- Responsive design med Tailwind breakpoints (`md:`, `lg:`, etc.)
- Custom animations og keyframes
- Dark theme styling med custom farver
- Grid layouts med `repeat(auto-fill, minmax())`
- Hover states og transitions
- Modal dialogs med overlay og animations

**Refleksion:**

- Hvordan påvirker Tailwind din udviklingshastighed?
- Hvad er fordele og ulemper ved utility-first CSS?
- Hvornår ville du bruge Tailwind? Hvornår CSS Modules?

**Næste skridt:**

- Eksperimenter med forskellige farver og spacing
- Tilføj flere responsive breakpoints
- Prøv at designe nye komponenter fra bunden med Tailwind
- Del dine erfaringer med klassen!
