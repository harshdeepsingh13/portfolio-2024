# Logo Redesign + Animation

**Date:** 2026-05-19  
**Status:** Approved

## Goal

Replace the FontAwesome `faCode` icon in the header Logo component with an inline SVG that matches the favicon (`public/favicon.svg`). Add a sequential animation sequence: SVG elements draw in on mount, then the user's name types out with a blinking text cursor.

## Favicon Design (reference)

The favicon is a terminal-style mark with three elements:

- `>` **prompt** — thin strokes, dim color (`#dedee1` dark / `#71717a` light)
- `h` **letterform** — bold cyan strokes (`#38bdf8` dark / `#0284c7` light), composed of a vertical stem + arch-and-right-leg path
- `_` **cursor block** — filled cyan rect

The header logo renders the same SVG at `28×28 px` (viewBox `0 0 32 32`), using `theme.palette.primary.main` for the cyan elements and `theme.palette.divider` (or equivalent dim color) for the prompt.

## Animation Sequence

Plays **once on mount**. After completion, both cursors idle-blink indefinitely.

| Delay | Duration | What |
|-------|----------|------|
| 0.1 s | 0.25 s | `>` prompt pops in (opacity 0→1 + slight scale) |
| 0.35 s | 0.35 s | `h` stem draws in via `stroke-dashoffset` |
| 0.7 s | 0.4 s | `h` arch draws in via `stroke-dashoffset` |
| 1.1 s | 0.1 s | `_` cursor pops in, then blinks at 1 s step-end |
| 1.3 s | ~1.1 s | Name types out at 75 ms/char via `setInterval` |
| done | ∞ | SVG cursor + text cursor both blink |

## Files Changed

### `src/components/Logo/index.tsx`

- Remove `faCode` FontAwesome import and `FontAwesomeIcon` usage.
- Render an inline SVG matching the favicon (color via `theme.palette`).
- Add `useEffect` typewriter: `useState("")` for displayed name, `setInterval` at 75 ms/char starting at 1300 ms delay after mount.
- Render `<TextCursor />` after the typed name (always visible; blinking via CSS).

### `src/components/Logo/styles.tsx`

Add styled components:

- **`LogoSvg`** — `styled("svg")` wrapper, houses the CSS keyframe animation classes for `.prompt`, `.h-stem`, `.h-arch`, `.svg-cursor` elements.
- **`TextCursor`** — `styled("span")` matching hero's `TypewriterCursor` but sized for header font (`height: "1em"`, `width: "2px"`). Uses the existing `blink` keyframe from `src/theme/animations.ts`.
- Update **`LogoWrapper`** to use `flexbox` (`display: flex; align-items: center; gap: 8px`) to align SVG and name text.

### Keyframe animations (defined in `styles.tsx`, not `animations.ts`)

These are local to the Logo component and don't belong in the global animations file:

- `drawStem` — `stroke-dashoffset` 17→0
- `drawArch` — `stroke-dashoffset` 35→0
- `popIn` — `opacity 0→1 + scale(0.5)→scale(1)`

Reuse `blink` imported from `src/theme/animations.ts`.

## Out of Scope

- No changes to `Header/index.tsx` or `Header/styles.tsx`
- No changes to `src/theme/animations.ts`
- No changes to the favicon itself
- No light/dark color switching logic beyond using `theme.palette.*` (MUI handles this automatically)
