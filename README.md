# Harshdeep Singh — Full Stack Developer Portfolio

This is my personal corner of the internet — a handcrafted portfolio and blog running in production at **[theharshdeepsingh.com](https://theharshdeepsingh.com)**. I'm a full stack developer based in Canada with 5+ years building web products, and I built this site myself the way I'd build anything: with code I'd actually want to maintain.

---

## What's inside

Most portfolio sites are static files or template clones. This one isn't. Every piece of content — skills, projects, work history, education — lives in MongoDB and renders fresh on every request. When something changes, it's live within seconds. No redeployments, no YAML files to wrestle with.

The `/blog` section is a proper publishing system I built into the same app: a TipTap rich-text editor, a password-protected admin panel for writing and publishing directly from the browser, ISR-cached public pages, and an RSS feed. Every post gets Article JSON-LD schema for both search engines and AI crawlers. It started as a small addition and became one of the parts of this project I'm most proud of.

Also: a dark/light theme applied before first paint (no FOUC), live GitHub stats fetched at request time, an animated particle canvas on every page, and a global middleware that rejects every non-GET/HEAD request before it touches a route handler.

---

## Stack

- **Framework:** Next.js 15 App Router, Turbopack, TypeScript
- **UI:** MUI v9, Emotion, Font Awesome
- **Database:** MongoDB via Mongoose
- **Auth:** NextAuth.js v5 — Credentials provider with bcrypt, JWT sessions
- **Rich-text editor:** TipTap — code blocks with syntax highlighting, image and YouTube embeds, tables
- **Assets:** Cloudinary
- **SEO:** JSON-LD (Person, WebSite, ProfilePage, BlogPosting), next-sitemap, RSS 2.0, Open Graph, llms.txt

---

## Pages

| Route | |
|---|---|
| `/` | Hero, live GitHub stats, animated skills, portfolio overview |
| `/skills` | Full tech stack breakdown by category |
| `/projects` | Project cards with tech tags, demo and repo links |
| `/experiences` | Work history timeline |
| `/education` | Education records |
| `/resume` | Resume viewer and download |
| `/blog` | Post listing with tag filter and reading times |
| `/blog/[slug]` | Post page — syntax-highlighted code, Article JSON-LD, ISR |
| `/admin` | Blog CMS — write, edit, and publish posts (auth-protected) |

---

## Blog

The blog is a first-class publishing system, not a markdown folder or third-party service.

**Writing:** A TipTap editor with headings, bold/italic/strike/inline code, fenced code blocks with syntax highlighting (lowlight + highlight.js), bullet and ordered lists, blockquote, links, image embeds, YouTube embeds, and tables.

**Storage:** Each post is saved in MongoDB in two formats — `body_json` (TipTap's ProseMirror JSON, so posts can be re-opened in the editor for editing) and `body_html` (pre-rendered HTML for fast public rendering without re-parsing on every request).

**Publishing:** Draft/published toggle. Setting a post to published sets `publishedAt` and makes it appear on `/blog`. The admin panel is protected by NextAuth.js v5 — credentials login, bcrypt-hashed password, JWT session.

**Discoverability:** Article JSON-LD on every post, canonical URLs, Open Graph and Twitter meta, RSS 2.0 at `/blog/rss.xml`. Published posts are auto-included in `sitemap.xml`.

---

## Running it locally

Node.js 20+ and a MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas) free tier).

```bash
git clone https://github.com/harshdeepsingh13/portfolio-2024.git
cd portfolio-2024
npm install --ignore-scripts   # skip the postinstall build step during local setup
```


```bash
npm run dev      # http://localhost:3000 with Turbopack
npm run build    # Production build — also regenerates sitemap.xml
npm run start    # Serve production build
npm run lint     # ESLint
```

---

## About me

I'm a full stack developer based in Vancouver, Canada — React, TypeScript, Node.js, and cloud infrastructure are my daily tools. Vetted by Toptal, top 3% of applicants globally. I write about what I'm building at [theharshdeepsingh.com/blog](https://theharshdeepsingh.com/blog).

- **Portfolio** — [https://theharshdeepsingh.com](https://theharshdeepsingh.com)
- **LinkedIn** — [https://linkedin.com/in/harshdeepsingh13](https://www.linkedin.com/in/harshdeepsingh13/)
- **GitHub** — [https://github.com/harshdeepsingh13](https://github.com/harshdeepsingh13/)
- **Toptal** — [https://toptal.com/resume/harshdeep-singh](https://www.toptal.com/resume/harshdeep-singh)
