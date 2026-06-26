# RiadhVision Project Architecture Analysis

This document outlines the architecture, technology stack, and directory structure of the **RiadhVision** portfolio web application.

## 1. Technology Stack

- **Core**: React 19, Vite, React Router DOM
- **Styling**: Tailwind CSS v4, Vanilla CSS (for custom fonts and keyframes)
- **3D & WebGL**: `@react-three/fiber`, `@react-three/drei`, `three.js` (powers the "Universe" background with stars and sparkles)
- **Animations & Scrolling**: `framer-motion`, `gsap`, `lenis` (smooth scrolling), `react-scroll`, `react-fast-marquee`
- **Icons**: `@iconify/react`

## 2. Global Architecture

The application is a Single Page Application (SPA) utilizing React Router for navigation.

- **`App.jsx`**: The entry point. It wraps the entire application in a `ReactLenis` component for global smooth scrolling. Crucially, it sets up a global, fixed `Canvas` (the "Universe" component) that sits behind all routes. The `react-router-dom` `Router` wraps the individual page routes.
- **`index.css`**: Defines global styles, the global font family (`Amiamie` and `Amiamie-Round`), CSS variables, and utility classes (e.g., custom clip-paths, responsive text sizing).

## 3. Directory Structure

### `/src/constants/`
- **`index.js`**: The central data store. Contains arrays for `projects` (with rich descriptions, roles, tech stacks, and slugs for routing) and `servicesData` (detailing offerings).

### `/src/pages/`
- **`Home.jsx`**: The main landing page. Aggregates all the sections (`Hero`, `ServiceSummary`, `Works`, `Services`, `Journey`, `ContactSummary`, `Contact`) into a continuous scrollable experience.
- **`ProjectDetails.jsx`**: A dynamic route (`/project/:slug`) that fetches the project data from `constants` and displays a rich, cinematic breakdown of the project (Hero image, features, description, and next project navigation).

### `/src/sections/`
- **`Navbar.jsx`**: Fixed navigation for the site.
- **`Hero.jsx`**: The landing section.
- **`ServiceSummary.jsx` & `Services.jsx`**: Sections detailing what you do. `Services.jsx` features a horizontal scrolling effect triggered by vertical scroll.
- **`Works.jsx`**: The portfolio grid. Features a sticky left column with image previews that update based on GSAP ScrollTriggers as the right column scrolls.
- **`Journey.jsx`**: Likely a timeline or experience section.
- **`ContactSummary.jsx` & `Contact.jsx`**: The footer and call-to-action sections.

### `/src/components/`
- **`ServiceCard.jsx` & `ServiceFeature.jsx`**: Reusable UI components for displaying services.
- **`Robot.jsx`**: A 3D model component (likely loaded via `@react-three/drei`'s `useGLTF`).
- **`ScrollToTop.jsx`**: A React Router utility component that resets window scroll position to 0 on route changes.

## 4. Key Design Patterns

1. **Persistent 3D Background**: By rendering the `Canvas` inside `App.jsx` and outside the `Routes`, the 3D WebGL context is never destroyed during navigation. This creates a seamless transition between the Home page and Project pages.
2. **Component-Based Sections**: The Home page is highly modularized. Each major scroll block is a standalone section file.
3. **Scroll-Driven Animation**: Heavy usage of Framer Motion's `useScroll` and `useTransform` (seen in `Services.jsx`) alongside GSAP's `ScrollTrigger` (seen in `Works.jsx`) to create a cinematic, interactive feel.
4. **Data-Driven UI**: All content is mapped from the `constants` file rather than being hardcoded into the JSX, making content updates trivial.
