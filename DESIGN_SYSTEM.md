# Design System

Tokens live in `src/index.css` inside a Tailwind v4 `@theme` block, so every token is also a utility class (`bg-navy`, `rounded-md`, `shadow-sm`, `ease-out-expo`, …).

## Colors

Only **3 brand colors**. Every other shade is produced with Tailwind opacity modifiers (`text-navy/80`, `border-navy/10`, `bg-navy/[0.04]`). Never introduce a new hue.

| Token | Value | Utility examples | Role |
|---|---|---|---|
| `--color-base` | `#F4F8FB` | `bg-base` | Page and card background |
| `--color-navy` | `#003152` | `text-navy`, `bg-navy`, `border-navy/10` | Headings, text, buttons, dark sections |
| `--color-accent` | `#ADDFF1` | `bg-accent`, `text-accent` (navy sections only) | Highlights |
| `--color-error` | `#C2410C` | `text-error` | **Form validation messages only** |

### 60 / 30 / 10 (by visual area)

- **Base — 60%**: page background, cards.
- **Navy — 30%**: headings, buttons, and full dark sections such as Services and Contact/Footer.
- **Accent — 10%**: fills and highlights.

### Opacity scale

| Use | Class |
|---|---|
| Body text | `text-navy/80` |
| Muted text | `text-navy/70`. **Never below 70% for text.** |
| Borders | `border-navy/10` |
| Hover backgrounds | `hover:bg-navy/[0.04]` |

### Accent rules

- On the **light base**, accent is **never** used for text, icons or borders. It may only be a **fill** with navy text (e.g. `bg-accent text-navy`).
- On **navy sections**, accent is allowed for text, icons and details.
- Links and focus states on light backgrounds use **navy**.

## Typography

| Token | Value |
|---|---|
| `--font-sans` | `"Amiamie", system-ui, sans-serif`: all UI text |
| `--font-hand` | `"Caveat", cursive`: **handwritten annotations only** (`font-hand`) |
| `--font-mono` | `"JetBrains Mono"` 400: **"ticket print" only** (`font-mono`): route labels, gate numbers and meta lines such as `ORN → ANYWHERE`, `idea → launch`, `gate 01`. Never for body or UI text. |

Type scale (`@utility` classes, so responsive variants work, e.g. `md:text-h1`):

| Class | Size | Line height | Weight | Tracking |
|---|---|---|---|---|
| `text-display` | `clamp(2.5rem, 5vw, 4rem)` | 1.05 | 400 | -0.035em |
| `text-h1` | `clamp(2rem, 4vw, 3rem)` | 1.1 | 400 | -0.03em |
| `text-h2` | `clamp(1.75rem, 3vw, 2.5rem)` | 1.15 | 400 | -0.025em |
| `text-h3` | `1.5rem` | 1.25 | 400 | -0.015em |
| `text-h4` | `1.25rem` | 1.3 | 400 | -0.01em |
| `text-body-lg` | `1.125rem` | 1.6 | 400 | n/a |
| `text-body` | `1rem` | 1.6 | 400 | n/a |
| `text-small` | `0.875rem` | 1.5 | 400 | n/a |
| `text-eyebrow` | `0.75rem` | 1 | 500 (renders 400) | 0.2em, uppercase |

> Amiamie ships 300 / 400 / 900 only, so headings use weight **400**.
> ⚠️ `text-base` is the **base colour** (`color: #F4F8FB`), not Tailwind's 16px font size. For body size use `text-body`.

## Radius

| Token | Value | Utility |
|---|---|---|
| `--radius-xs` | 4px | `rounded-xs` |
| `--radius-sm` | 8px | `rounded-sm` |
| `--radius-md` | 12px | `rounded-md` |
| `--radius-lg` | 16px | `rounded-lg` |
| `--radius-xl` | 24px | `rounded-xl` |

**Nested elements use a smaller radius than their parent** (e.g. a `rounded-xl` card holds `rounded-md` buttons).

## Shadows

| Token | Value |
|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,49,82,0.06)` |
| `--shadow-md` | `0 8px 24px rgba(0,49,82,0.08)` |
| `--shadow-lg` | `0 24px 48px rgba(0,49,82,0.12)` |

## Motion

| Token | Value | Utility |
|---|---|---|
| `--ease-out-expo` | `cubic-bezier(0.22, 1, 0.36, 1)` | `ease-out-expo` |

## Components

- **Cards**: `bg-base border border-navy/10 shadow-sm` (or `shadow-md`). **No white.**
- **Glass tickets** (navbar, ticket button): glass fills use the base colour, `rgba(244,248,251,0.55)`, or accent for stubs, `rgba(173,223,241,0.55)`. Over navy panels the glass turns navy, `rgba(0,49,82,0.55)`, with base text. **Exception:** pure white is allowed *only* for the 1px glass edge highlight (`rgba(255,255,255,0.95)`) on light backgrounds.
- **Links / focus on light**: navy.
- **Error**: only for form validation messages.

## Global defaults (`@layer base`)

- `html, body { background: base; color: navy/80; font-family: var(--font-sans) }`
- `h1–h6 { color: navy }`
- `:focus-visible { outline: 2px solid navy; outline-offset: 2px }`
- `::selection { background: accent; color: navy }`
- `.bg-navy :focus-visible { outline-color: base }`: focus stays visible inside navy sections

## Section themes

| Theme | Background | Headings | Body | Muted | Borders | Buttons |
|---|---|---|---|---|---|---|
| Light (default) | `bg-base` | `text-navy` | `text-navy/80` | `text-navy/70` | `border-navy/10` | `bg-navy text-base` / `bg-accent text-navy` |
| Navy (Services, ContactSummary, Footer) | `bg-navy` | `text-base` | `text-base/80` | `text-base/70` | `border-base/10` | `bg-accent text-navy` |

On navy, accent is allowed for icons, links and small details. Headings inside navy sections need an explicit `text-base`, because the global default makes headings navy.

Large text (40px and up) may go down to `text-navy/55` (3.4:1). Everything else stays at 70% or above.

## Contrast on base (`#F4F8FB`)

| Foreground | Ratio | WCAG AA |
|---|---|---|
| navy | 12.6:1 | ✓ |
| navy/80 | 7.0:1 | ✓ |
| navy/70 | 5.2:1 | ✓ (minimum for text) |
| navy/60 | 3.9:1 | ✗ for text, so don't use it for text |
| navy/55 | 3.4:1 | ✓ large text (≥ 24px, or ≥ 18.5px bold) only |
| navy on accent | 9.4:1 | ✓ |
| base/70 on navy | 6.9:1 | ✓ |
| base/60 on navy | 5.5:1 | ✓ |
| accent on navy | 9.4:1 | ✓ |
| base on navy | 12.6:1 | ✓ |

## Migration notes

- Legacy tokens (`--color-primary`, `--color-DarkLava`, `--color-SageGray`, `--color-gold`, `--font-amiamie`, `--font-amiamie-round`, `--font-caveat`) and the custom `@utility` classes are kept until components are migrated.
- `--radius-md/lg/xl` and `--font-sans` reuse Tailwind's built-in names, so existing `rounded-md` (6→12px), `rounded-lg` (8→16px), `rounded-xl` (12→24px) and `font-sans` classes already pick up the new values.
