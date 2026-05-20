# Harshdeep Singh — Portfolio

Personal portfolio site for [Harshdeep Singh](https://theharshdeepsingh.com), a Canada-based full-stack developer and AI automation engineer with 5+ years of experience in React, TypeScript, Node.js, and cloud technologies.

**Live site →** [theharshdeepsingh.com](https://theharshdeepsingh.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| UI | MUI v9, Emotion, Font Awesome, Outfit (Google Fonts) |
| Database | MongoDB via Mongoose |
| Assets | Cloudinary |
| Analytics | Google Analytics 4 |
| SEO | next-sitemap, JSON-LD schema, llms.txt |
| Deployment | Node.js server (`next start`) |

---

## Features

- **Dynamic content** — all portfolio data (profile, skills, projects, work history, education) is stored in MongoDB and rendered fresh on every request with zero caching
- **Live GitHub stats** — public repos, commit count, and estimated lines of code are fetched from the GitHub API at request time
- **Dark / light theme** — theme is persisted in `localStorage` and applied before first paint to eliminate flash of unstyled content
- **Animated particles background** — canvas-based interactive particle field rendered on every page
- **Skills carousel** — horizontally scrolling animated tile layout for tech stack
- **Responsive layout** — MUI breakpoints aligned to Bootstrap-compatible widths (`sm: 576`, `md: 768`, `lg: 992`, `xl: 1200`)
- **SEO-ready** — Open Graph tags, Twitter cards, canonical URLs, Person/WebSite/ProfilePage JSON-LD, sitemap.xml, robots.txt, and `llms.txt` for AI crawlers
- **Security hardened** — strict CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, `poweredByHeader: false`, and a middleware that rejects all non-GET/HEAD requests globally

---

## Pages

| Route | Content |
|---|---|
| `/` | Hero with profile, GitHub stats, animated skill tiles, and portfolio stats |
| `/skills` | Full skills breakdown by category |
| `/projects` | Project cards with tech tags and links |
| `/experiences` | Work history timeline |
| `/education` | Education records |
| `/resume` | Resume viewer / download |

---

## Project Structure

```
.
├── modals/                  # Mongoose models (outside src/ by convention)
│   ├── user.ts
│   ├── skill.ts
│   ├── project.ts
│   ├── workExperience.ts
│   └── educations.ts
├── public/
│   ├── assets/              # Static images, OG image, favicons
│   ├── llms.txt             # AI crawler permissions
│   └── robots.txt
├── src/
│   ├── app/                 # Next.js App Router pages & layouts
│   │   ├── layout.tsx       # Root layout — NavBar, Footer, ThemeProvider, JSON-LD
│   │   ├── page.tsx         # Home page
│   │   ├── skills/
│   │   ├── projects/
│   │   ├── experiences/
│   │   ├── education/
│   │   ├── resume/
│   │   └── _globalStyles.tsx  # Shared layout primitives (Container, Row, PageHeader…)
│   ├── components/          # Feature components (LandingPage, NavBar, Footer, …)
│   ├── context/             # ThemeContext — dark/light toggle + MUI ThemeProvider
│   ├── lib/
│   │   ├── mongoose.ts      # MongoDB singleton connection
│   │   ├── getData.ts       # All DB query helpers
│   │   ├── github.ts        # GitHub API stats fetcher
│   │   └── emotionRegistry.tsx  # SSR Emotion cache
│   ├── theme/
│   │   ├── index.ts         # createAppTheme(mode) — full MUI palette + global styles
│   │   └── animations.ts    # Reusable @emotion/react keyframes
│   └── middleware.ts        # Global 405 guard for non-GET/HEAD requests
├── next.config.ts           # Security headers, www→apex redirect
├── next-sitemap.config.js   # Sitemap + robots.txt generation
└── tsconfig.json
```

---

## Local Development

### Prerequisites

- Node.js 20+
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone and install

```bash
git clone https://github.com/harshdeepsingh13/harshdeep-singh.git
cd harshdeep-singh
npm install
```

> `postinstall` runs `npm run build` automatically. Skip it during development by running `npm install --ignore-scripts` instead.

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>

# Email address used to identify the portfolio owner's documents in MongoDB
# Note: the variable name has an intentional typo — use exactly as shown
UESR_EMAIL=your@email.com

# Cloudinary base URL for profile images and assets
NEXT_PUBLIC_CLOUDINARY_RES_LINK=https://res.cloudinary.com/<cloud-name>/image/upload

# Google Analytics measurement ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# GitHub stats (optional — stats show as 0 if omitted)
GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

### 3. Start the dev server

```bash
npm run dev      # http://localhost:3000  (Turbopack)
```

### Other commands

```bash
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint
```

---

## Data Model

All portfolio content is keyed by the `UESR_EMAIL` environment variable. Seed your MongoDB instance with documents that match this email in each collection:

| Collection | Model file | Purpose |
|---|---|---|
| `users` | `modals/user.ts` | Profile, avatar, objective, social links |
| `skills` | `modals/skill.ts` | Skills list |
| `projects` | `modals/project.ts` | Portfolio projects |
| `workexperiences` | `modals/workExperience.ts` | Job history |
| `educations` | `modals/educations.ts` | Education records |

---

## Theming

The MUI theme is created by `createAppTheme(mode)` in `src/theme/index.ts`. It exposes:

- **Standard palette keys** — `background.default`, `background.paper`, `text.primary`, `text.secondary`, `divider`, `primary.main`
- **Cyan accent variants** — `primary.glow`, `primary.border`, `primary.alpha10`, `primary.alpha20`, `primary.scanLineBg`
- **Custom tokens** — `theme.palette.custom.*` (hover states, tertiary surfaces, accent text, border hover)

Never hardcode colors — always reference `theme.palette.*`. Shared layout primitives (Container, Row, PageHeader, BreadcrumbsNav, CardTitle, CustomTabs) live in `src/app/_globalStyles.tsx`.

---

## Security

| Measure | Implementation |
|---|---|
| Content Security Policy | `next.config.ts` headers |
| HSTS | `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` |
| Clickjacking prevention | `X-Frame-Options: DENY` |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| Method restriction | `src/middleware.ts` — 405 for anything except GET/HEAD |
| Server fingerprint | `poweredByHeader: false` |
| www redirect | Permanent 301 from `www.theharshdeepsingh.com` to apex |

---

## Links

- **Portfolio** — [theharshdeepsingh.com](https://theharshdeepsingh.com)
- **LinkedIn** — [linkedin.com/in/harshdeepsingh13](https://www.linkedin.com/in/harshdeepsingh13/)
- **GitHub** — [github.com/harshdeepsingh13](https://github.com/harshdeepsingh13/)
- **Toptal** — [toptal.com/resume/harshdeep-singh](https://www.toptal.com/resume/harshdeep-singh)
