# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack on http://localhost:3000
npm run build    # Production build (also runs postinstall)
npm run lint     # ESLint check
npm run start    # Serve production build
```

There are no tests in this project.

## Environment Variables

Required in `.env`:
- `MONGODB_URI` — MongoDB connection string
- `UESR_EMAIL` — Portfolio owner's email used to query all data (note: intentional typo in the variable name)
- `NEXT_PUBLIC_CLOUDINARY_RES_LINK` — Cloudinary base URL for assets
- `NEXT_PUBLIC_GA_ID` — Google Analytics measurement ID

Optional:
- `GITHUB_USERNAME` — used by `getGitHubStats` (home page repo/commit/LOC stats)
- `GITHUB_TOKEN` — raises the GitHub API rate limit for `getGitHubStats` and for the
  per-project README fetch (`src/lib/github.ts`). Works without it for a few projects.

## Architecture

This is a **Next.js 15 App Router** portfolio site (TypeScript). All pages are server components that fetch data directly from MongoDB at request time (`force-dynamic`, `revalidate = 0`).

### Data flow

Pages call `getData.*` helpers from `src/lib/getData.ts`, which connect to MongoDB via the singleton in `src/lib/mongoose.ts` and query Mongoose models. All portfolio content (user profile, skills, projects, work experience, education) lives in MongoDB and is identified by the `UESR_EMAIL` env var.

**Mongoose models** live in the root `modals/` directory (not `src/`):
- `user.ts` — profile, avatar, social links
- `skill.ts` — tech skills list
- `project.ts` — portfolio projects
- `workExperience.ts` — job history
- `educations.ts` — education records

### Theming

The design system uses **MUI (Material UI v9)**. The theme factory is in `src/theme/index.ts` — it exports `createAppTheme(mode)` which maps all design tokens to MUI palette keys. `ThemeContext` (`src/context/ThemeContext.tsx`) reads/writes `localStorage` and `document.documentElement.setAttribute('data-theme', ...)`, then instantiates the MUI theme via `ThemeProvider`. **Never hardcode colors — always use `theme.palette.*`**.

Key palette tokens:
- `theme.palette.background.default` — page background
- `theme.palette.background.paper` — secondary/card background
- `theme.palette.text.primary` / `text.secondary` — body text
- `theme.palette.divider` — borders
- `theme.palette.primary.main` — accent cyan
- `theme.palette.primary.glow / border / alpha10 / alpha20 / scanLineBg` — cyan variants
- `theme.palette.custom.*` — mainHover, secondaryHover, tertiary, tertiaryText, tertiaryTextHover, accentText, accentTextHover, borderHover, main60

Global base styles (body, main, code, transitions, user-select) are in `MuiCssBaseline.styleOverrides` inside the theme factory.

### Styling conventions

- **`@mui/material/styles` styled** for component styles (each component has a co-located `styles.tsx`)
- **MUI Grid** (`@mui/material/Grid`) for layout — replaces React-Bootstrap Col/Row
- Shared layout primitives (`Container`, `Row`, `PageHeader`, `PageLead`, `BreadcrumbsNav`, `CardTitle`, `CustomTabs`, `CustomTab`) are in `src/app/_globalStyles.tsx` — use these instead of creating duplicates
- Keyframe animations are pre-defined in `src/theme/animations.ts` using `@emotion/react` keyframes
- SSR emotion cache is in `src/lib/emotionRegistry.tsx` (registered in layout.tsx)

### Security

`src/middleware.ts` blocks all non-GET/HEAD requests globally (405 for everything else). `next.config.ts` applies a strict CSP and other security headers to every route.

### Sitemap

`next-sitemap` generates `sitemap.xml` and `robots.txt` post-build using `next-sitemap.config.js`. Static assets served from `public/`.
