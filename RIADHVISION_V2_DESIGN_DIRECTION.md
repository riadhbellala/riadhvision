# RiadhVision v2 — "Aura"

> Design direction for the `redesign-v2` branch.
> Main style: **Zeronode** (grainy auras, glass pills, Swiss type, poster panels).
> Second layer: **fluted glass stripes & glass textures**.
> Accents: dark ink gradient sections, sparse 3D crystal icons, editorial details.

---

## 1. Concept

Your work as an **aura**: ideas start as soft light and take shape.

**Tagline:** "Where ideas take shape."

**Motion metaphor:** blur → sharp, diffuse → defined. Elements arrive soft and come into focus.

**Mood:** calm, intelligent, futuristic, human. Light-led, airy, premium, restrained.

---

## 2. Style hierarchy

| Weight | Layer | Source |
|---|---|---|
| **70%** | Grainy auras, glass pills, Swiss typography, poster panels, blurred human silhouette, tiny logomark | **Zeronode (main reference)** |
| **20%** | Fluted glass stripes, glass textures, frosted panels | Stripes / curtain / glass references |
| **10%** | Dark ink gradient sections, sparse 3D crystal icons, corner labels, counters, annotation lines | Other references |

**Not used:** word-tile magnifier hero, silk ribbons as a main element, geometric half-circles, heavy glows, neon.

---

## 3. Color palette

All 7 colors come from the palette image (dark navy core → royal blue band → icy white glow). **All are kept** and available for backgrounds and gradients.

| Token | Hex | Description | Role |
|---|---|---|---|
| `ink` | `#070A16` | Black-navy core of the image | Dark sections, deepest shadows |
| `ink-2` | `#0E1430` | Lifted dark blue | Panels and cards on dark |
| `deep` | `#132A7A` | Dark edge of the blue band | Aura depth, headings on light |
| `royal` | `#2448C9` | Saturated blue band | **Brand blue**: auras, pills, labels on light, active states |
| `glow` | `#5B83E8` | Blue lighting up | Aura transitions, glass rims, links on dark |
| `ice` | `#C9D8F4` | Pale blue haze | Light sections, highlights, text on dark |
| `white` | `#F2F5FB` | Brightest corner | Light base, text on dark, specular highlights |

### Master gradient (the palette image itself)
`ink → deep → royal → glow → ice → white`

### Usage rules
- **Light sections (most of the page):** `white` / `ice` base, auras in `royal → deep → glow`.
  - Headings: `deep` · Labels and pills text: `royal` · Body: `deep` at 80%.
- **Dark sections (1–2 only, for depth):** the `ink` gradient (palette image), auras in `deep → royal → glow → ice`.
  - Headings and body: `white` / `ice` · Links and small accents: `glow`.
- `royal` on dark is for **shapes and light only**, never small text (low contrast).
- Every gradient carries **grain** (see Materials).

---

## 4. Typography

### Fonts
| Role | Font | Notes |
|---|---|---|
| Primary (everything) | **Aeonik** | Commercial license required (CoType). Free fallback: **Satoshi** or **General Sans** (Fontshare). |
| Accent (rare) | **Instrument Serif Italic** | Free (Google Fonts). One accent word in a few headlines only. |

Weights: Light 300 (hero display), Regular 400 (statements, body), Medium 500 (labels, buttons).

### Scale
| Style | Size | Weight / Case | Tracking | Use |
|---|---|---|---|---|
| Display | `clamp(3rem, 7vw, 6.5rem)` | Light, mixed case | `-0.04em` | Hero only |
| Statement | `clamp(1.75rem, 3.5vw, 3rem)` | Regular, **UPPERCASE** | `0.02em` | Section statements (Zeronode style) |
| H3 | 24px | Regular | `-0.01em` | Cards, items |
| Body | 16–18px | Regular | 0 | Paragraphs, line-height 1.6 |
| Small | 14px | Regular | 0 | Meta, buttons |
| Label | 11–12px | Medium, UPPERCASE | `0.14em` | Corner labels, counters, pill text |

Principle: **quiet Swiss typography**. Short statements, lots of air, the visuals carry the emotion.

---

## 5. Materials

1. **Aura** — large blurred shapes in the palette (orb, horizon, silhouette) with grain. Slowly breathing (gentle scale/position drift), subtly attracted to the cursor on desktop.
2. **Grain** — fine noise on every gradient (SVG `feTurbulence` or noise texture, ~6–10% opacity).
3. **Glass pill** — the signature component: frosted fill (`white` 8–12%), `backdrop-filter: blur(12px)`, 1px light border (`white` 35%), inner top highlight.
4. **Frosted panel** — larger glass surfaces: blur 24px, 1px border, soft shadow tinted with `deep`.
5. **Fluted glass** — vertical ribs that turn an aura into soft stripes (repeating gradient + blur, or SVG displacement on desktop). Used for frames, panels and the footer.
6. **Blurred silhouette** — real photography (Riadh) turned into a grainy cobalt duotone and heavily blurred.
7. **Crystal icons** — 3D frosted-glass icons, max one per section (see §9).

---

## 6. Components

- **Glass pill** — name tags, values, chips, CTAs.
- **Glass pill button** — label + `→`, primary action.
- **Outline arrow pill** — empty pill with a long arrow `⟶`, secondary action.
- **Glass input** — pill-shaped input (Focus Engine).
- **Poster panel** — tall composition (≈ 4:5), aura background, optional white text block below.
- **Corner labels** — small uppercase text in section corners.
- **Counter** — `01/06` in label style.
- **Logomark** — small mark at the bottom of panels, as a signature.
- **Annotation line** — thin line + node dots linking labels (used sparingly).

---

## 7. Motion

- Entrance: `opacity 0 → 1` + `blur(12px) → 0` + slight `y` (12–24px), 0.8s, ease `cubic-bezier(0.22, 1, 0.36, 1)`.
- Auras: slow breathing loops (8–14s), cursor attraction on desktop only.
- Fluted glass: content behind sharpens / clears on hover or scroll focus.
- No bounces, spins or flashy effects.
- `prefers-reduced-motion`: static auras, no blur transitions.
- Mobile: lighter blurs, fewer animated layers, static grain.

---

## 8. Page structure

The page is **one long painted artwork** (`PageArtwork`) behind transparent sections. Each section sits on its own part of it; boundaries are painted blends (~36vh), never hard edges. Text stays out of the blend zones.

| # | Section | id | Tone | Base → light shapes (mood) | Content |
|---|---|---|---|---|---|
| 01 | **Hero — "Aura"** | `hero` | dark | ink · diagonal royal → glow band (−15°), ice glow bottom-left widening into a ~160vw light horizon that opens into Manifesto | Display "Where ideas take shape.", glass pill "RIADHVISION", corner labels, logomark |
| 02 | **Manifesto — "The Figure"** | `manifesto` | light | snow · royal/glow horizon blobs rising from the bottom, behind the pills | Blurred silhouette + "I build where design and engineering meet." + 3 value pills (Clarity, Performance, Intelligence) |
| 03 | **Services** | `services` | dark (blue) | deep · ice highlights on the left and right edges | Stacked glass pills with crystal icons |
| 04 | **Work — "Posters"** | `work` | dark | ink-2 · 2 low-opacity glow shapes behind the content | Tall poster panels, counters |
| 05 | **Before / After** | `before-after` | light | ice · horizon curve opening from ink-2 into ice across Work → Before/After | "From rough to refined." — 16:9 comparison with a draggable glass lens |
| 06 | **Focus Engine (AI)** | `focus-engine` | dark | ink · one centred royal orb (~50vw) | Glass input "Describe your idea." → AI poster card |
| 07 | **Process — "Through the Glass"** | `process` | light | ice · the orb's light spreading into ice across the boundary; fluted glass | Discover → Design → Build → Launch |
| 08 | **Testimonials** | `testimonials` | dark (blue) | deep · soft wide royal aura | Glass cards |
| 09 | **Trust** | `trust` | dark | ink · 4–6 thin horizontal royal → glow light streaks in the lower half (motion blur) | "Real projects. Real results." — tech stack row, project names row; corners "Built with care." / "Trusted across industries." |
| 10 | **Now** | `now` | light | snow | Glass panel: building / Oran time / availability |
| 11 | **Contact — "Begin"** | `contact` | light | ice · large grainy cobalt poster orb (deep core, royal → glow → ice edges) | "Let's begin." + Email, WhatsApp, Start a project |
| 12 | **Footer** | `footer` | dark | fades into ink; fluted glass | Giant "RIADHVISION" wordmark, logomark, links |

**Tones:** dark = snow statements, ice/80 body, ice/70 labels, light glass. Light = deep statements, deep/80 body, royal labels, glass tinted `rgba(19,42,122,0.06)` with a deep/20 border.

**Navbar links:** Work · Services · Process · Contact.

---|---|---|---|
| 1 | **Hero — "Aura"** | Light aura | Full-screen poster: big grainy cobalt aura, glass pill "RIADHVISION" floating over it, "WHERE IDEAS TAKE SHAPE." in small uppercase, logomark at the bottom, corner labels ("FULL-STACK DEVELOPER" / "ORAN — WORLDWIDE"). Aura breathes and leans toward the cursor. |
| 2 | **Manifesto — "The Figure"** | Split panel | Top: Riadh's photo as a blurred grainy cobalt silhouette. Bottom: white block with "I BUILD WHERE DESIGN AND ENGINEERING MEET." + short paragraph + logomark. Silhouette sharpens slightly on scroll. |
| 3 | **Values — "Three Pills"** | Horizon aura | Staggered glass pills: "Clarity", "Performance", "Intelligence". Hover expands into one sentence. |
| 4 | **Services** | Light aura | Stack of glass pills, one per service, each with a crystal icon. Click expands: details, timeline, starting price. |
| 5 | **Work — "Posters"** | Tinted auras | Each project = tall poster panel with its own aura; screenshot seen through a fluted glass frame that clears on hover; name in a glass pill; counter `01/06`. Horizontal scroll (desktop), swipe (mobile). |
| 6 | **Process — "Through the Glass"** | Fluted glass wall | Steps (Discover → Design → Build → Launch) are blurred shapes behind vertical ribs; the step in focus sharpens through the glass as you scroll. |
| 7 | **Focus Engine (AI)** | **Dark** — ink gradient | Glass input: "DESCRIBE YOUR IDEA." The Groq backend returns a poster card: project type, features, timeline, budget, and "Start this project" (pre-fills `/start`). |
| 8 | **Testimonials** | Soft aura | Glass cards (avatar pill + quote) floating over the aura. |
| 9 | **Now** | Light | Small glass panel: currently building, local time in Oran, availability, reply time. |
| 10 | **Contact — "Begin"** | Full aura | "LET'S BEGIN." + glass pills: email, WhatsApp, Start a project (`/start`). |
| 11 | **Footer** | Fluted glass | Giant "RIADHVISION" wordmark seen through fluted glass, logomark, links. |

**Rhythm:** mostly light, with the dark Focus Engine section as the deep moment in the middle of the page.

---

## 9. Crystal icon system

### Rules
- **Material:** clear frosted glass, thick rounded edges, soft bevel, subtle refraction.
- **Light:** soft studio light from the top-left; cobalt light passing through; small white specular highlights.
- **Camera:** three-quarter view, tilted ~15°, centered, identical for every icon.
- **Shape:** simple, bold silhouette, readable at 64px. No small details.
- **Colors:** only blue, white and clear glass.
- **Output:** 1:1, 2048px → export WebP at 512px and 1024px.
- **Usage:** sparing — hero logomark, services, Focus Engine, contact.

### Master prompt (replace `{ICON}` and `{BACKGROUND}`)

```
A single 3D icon of a {ICON}, made of clear frosted glass with thick rounded edges and a soft bevel, subtle inner refraction, soft cobalt blue light passing through it (#2448C9) with periwinkle highlights (#5B83E8), small crisp white specular highlights on the top-left edges, soft diffused studio lighting from the top-left, three-quarter view tilted 15 degrees, centered with generous empty space, simple bold minimal silhouette, premium product render, Cinema 4D / Octane style, on a solid flat {BACKGROUND} background, no ground shadow, no other objects, no text, square 1:1.
```

`{BACKGROUND}`:
- Light sections: `very light icy white (#F2F5FB)`
- Dark section: `deep navy-black (#070A16)`

**Negative prompt:** text, letters, logos, extra objects, plastic, cartoon, colors other than blue and white, busy details, room reflections, ground plane.

**Consistency:** once one icon is perfect, use it as the **style reference image** for every other icon.

### Icon list
| Section | `{ICON}` | Background |
|---|---|---|
| Hero / brand | your logo mark (attach logo as reference) | light |
| Services — Web development | browser window | light |
| Services — E-commerce | shopping bag | light |
| Services — SaaS / dashboards | stacked layers | light |
| Services — UI/UX design | pen nib | light |
| Services — Performance | speedometer gauge | light |
| Focus Engine (AI) | speech bubble with a small sparkle | dark |
| Now | clock | light |
| Contact | paper plane | light |
| CTA | arrow pointing right | light |

---

## 10. Technical notes

- **Stack:** React + Vite + Tailwind v4 (`@theme` tokens), Framer Motion / GSAP, Lenis (synced with ScrollTrigger).
- **Performance:** CSS/SVG for grain and stripes; optimized WebP for icons and photos; lighter effects on mobile.
- **Readability:** text always sits on calm zones (solid light blocks, `ink`, or the soft edge of an aura) — never on busy glass or stripes.
- **Accessibility:** WCAG AA contrast, visible focus states (`royal` on light, `ice` on dark), `prefers-reduced-motion` respected.

---

## 11. Build order

1. Design system setup (tokens, fonts, grain / glass / fluted utilities)
2. Hero — "Aura"
3. Manifesto + Values
4. Services
5. Work — "Posters"
6. Process — "Through the Glass"
7. Focus Engine (AI)
8. Testimonials + Now
9. Contact + Footer
10. Polish, performance, mobile
