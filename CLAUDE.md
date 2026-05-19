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

The design system uses **CSS custom properties** (not MUI or Tailwind). Theme variables are defined in `src/app/globals.css` under `:root[data-theme="dark"]` and `:root[data-theme="light"]`. `ThemeContext` (`src/context/ThemeContext.tsx`) sets the `data-theme` attribute on `<html>`. Use `var(--main)`, `var(--main-text)`, `var(--border)`, etc. in all styled components — never hardcode colors.

### Styling conventions

- **styled-components** for component styles (each component has a co-located `styles.tsx`)
- **React-Bootstrap + Bootstrap 5** for layout primitives (Container, Row, Col)
- Shared layout primitives (`Container`, `Row`, `PageHeader`, `PageLead`, `BreadcrumbsNav`, `CardTitle`, `CustomTabs`) are in `src/app/_globalStyles.tsx` — use these instead of creating duplicates

### Security

`src/middleware.ts` blocks all non-GET/HEAD requests globally (405 for everything else). `next.config.ts` applies a strict CSP and other security headers to every route.

### Sitemap

`next-sitemap` generates `sitemap.xml` and `robots.txt` post-build using `next-sitemap.config.js`. Static assets served from `public/`.
