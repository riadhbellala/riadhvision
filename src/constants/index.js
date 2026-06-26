// index.js
export const servicesData = [
  {
    title: "Full-Stack Development",
    description:
      "From a fast landing page to a complex web application, I build complete digital products with clean architecture, optimized databases, and seamless UI — reliable at every layer.",
    items: [
      {
        title: "Backend Engineering",
        description: "(REST APIs, Node.js, Express, Auth Systems)",
      },
      {
        title: "Frontend Excellence",
        description: "(React, Vite, Tailwind CSS, Framer Motion)",
      },
      {
        title: "Database Design",
        description: "(MongoDB, SQL, Scalable Structures)",
      },
    ],
  },
  {
    title: "E-Commerce & SaaS Solutions",
    description:
      "From subscription workflows to multi-tenant systems, each product is engineered for performance and effortless management at any scale.",
    items: [
      {
        title: "E-commerce Platforms",
        description: "(Product Management, Cart, Checkout Flows)",
      },
      {
        title: "SaaS Architecture",
        description: "(Multi-tenant, Role Management, Billing)",
      },
      {
        title: "Admin Dashboards",
        description: "(Analytics, CRUD Systems, Automation)",
      },
    ],
  },
  {
    title: "Landing Pages & Vitrine Sites",
    description:
      "Premium showcase websites and high-converting landing pages that capture attention, build trust, and turn visitors into clients.",
    items: [
      {
        title: "Brand Experiences",
        description: "(Cinematic UI, Micro-interactions, Animations)",
      },
      {
        title: "Conversion Optimized",
        description: "(CTA Design, Performance, SEO Ready)",
      },
      {
        title: "Fully Responsive",
        description: "(Mobile-first, Cross-browser, Accessible)",
      },
    ],
  },
  {
    title: "UI/UX Design & Performance",
    description:
      "Through focused design thinking and performance audits, your product becomes faster, more intuitive, and easier to scale — without disrupting core functionality.",
    items: [
      {
        title: "UI/UX Design",
        description: "(Figma, Wireframing, Pixel-perfect Polish)",
      },
      {
        title: "Performance Audits",
        description: "(Core Web Vitals, Lighthouse, Rendering Analysis)",
      },
      {
        title: "Code Refactoring",
        description: "(Structure Cleanup, Best Practices, Optimization)",
      },
    ],
  },
];

export const projects = [
  {
    id: 1,
    name: "Athléte — Sports E-commerce Platform",
    slug: "athlete",
    year: "2024",
    role: "Full-Stack Developer",
    description:
      "A premium e-commerce platform for sports gear with product filtering, cart management, and a seamless checkout experience.",
    longDescription:
      "Athléte is a high-performance sports e-commerce platform built to deliver a frictionless shopping experience for sports enthusiasts. The platform features an intelligent product filtering system, real-time cart management, a multi-step checkout flow, and a fully responsive interface designed for speed and conversion. Every interaction was crafted to reflect the energy and precision of the athletic world.",
    highlights: [
      "Advanced product filtering with live search and category sorting",
      "Persistent cart management with real-time price updates",
      "Multi-step responsive checkout with validation",
      "Cinematic hero animations powered by Framer Motion",
    ],
    href: "https://athlete-gamma.vercel.app/",
    image: "/assets/projects/athlete1.webp",
    bgImage: "/assets/projects/athlete1.webp",
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Vite" },
      { id: 3, name: "Tailwind CSS" },
      { id: 4, name: "Framer Motion" },
    ],
  },
  {
    id: 2,
    name: "HYDRAME",
    slug: "hydrame",
    year: "2025",
    role: "Frontend Developer",
    description:
      "A sleek, modern web application showcasing the Hydrame brand with an interactive and responsive user experience.",
    longDescription:
      "HYDRAME is a brand-forward digital experience crafted to capture the essence of a modern lifestyle product. The site focuses on visual storytelling through smooth scroll animations, bold typography, and a carefully curated color palette. Every section is designed to keep the user engaged and drive them toward a clear call to action.",
    highlights: [
      "Immersive scroll-driven animations for brand storytelling",
      "Bold, editorial typography system for brand consistency",
      "Fully responsive layout with pixel-perfect mobile experience",
      "Optimized for fast loading with minimal asset footprint",
    ],
    href: "https://hydrame-theta.vercel.app/",
    image: "/assets/projects/hydrame.png",
    bgImage: "/assets/projects/hydrame.png",
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Vite" },
      { id: 3, name: "Tailwind CSS" },
      { id: 4, name: "Framer Motion" },
    ],
  },
  {
    id: 3,
    name: "SmartService DZ — Appointment SaaS",
    slug: "smartservice-dz",
    year: "2024",
    role: "Full-Stack Developer",
    description:
      "A modern SaaS platform for automated appointment booking and service management tailored for Algerian businesses.",
    longDescription:
      "SmartService DZ is an end-to-end SaaS platform that automates the appointment and service management lifecycle for Algerian businesses. It features a client-facing booking interface, a fully functional admin dashboard for managing schedules, customers, and analytics, and a secure authentication system. The platform was engineered with scalability in mind to support multiple business accounts simultaneously.",
    highlights: [
      "Real-time appointment scheduling with conflict detection",
      "Full admin dashboard with analytics and CRUD operations",
      "Secure JWT-based authentication and role management",
      "MongoDB-backed data layer built for multi-tenant scalability",
    ],
    href: "https://smartservice-dz.vercel.app/",
    image: "/assets/projects/smartservice.webp",
    bgImage: "/assets/projects/smartservice.webp",
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Node.js" },
      { id: 3, name: "MongoDB" },
      { id: 4, name: "Tailwind CSS" },
    ],
  },
  {
    id: 4,
    name: "Ronaldinho Store — Sneaker Destination",
    slug: "ronaldinho-store",
    year: "2024",
    role: "Frontend Developer",
    description:
      "The ultimate streetwear and premium sneaker destination. Experience street culture and exclusive sneaker drops.",
    longDescription:
      "Ronaldinho Store is a premium sneaker and streetwear e-commerce experience built to reflect the culture and identity of the brand. The interface is bold and immersive, with a clean product catalog, brand-focused editorial sections, and a seamless browsing experience. The design language draws inspiration from high-fashion retail and urban street culture.",
    highlights: [
      "Editorial-style product catalog with curated collections",
      "Immersive brand experience with cinematic hero section",
      "Optimized product grid with filtering and hover previews",
      "Consistent brand identity reflected across all UI components",
    ],
    href: "https://ronaldinho-store-tau.vercel.app",
    image: "/assets/projects/ronadlihno.webp",
    bgImage: "/assets/projects/ronadlihno.webp",
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Vite" },
      { id: 3, name: "Tailwind CSS" },
      { id: 4, name: "E-commerce" },
    ],
  },
  {
    id: 5,
    name: "Dopamine — Coffee Brand Experience",
    slug: "dopamine",
    year: "2024",
    role: "Full-Stack Developer",
    description:
      "A specialty coffee brand with a cinematic UI, interactive menu, order management, and a full checkout flow.",
    longDescription:
      "Dopamine is a specialty coffee brand digital experience designed to mirror the pleasure of a perfect cup. The platform features a rich, interactive menu system, a fully functional order and cart management system, and a checkout flow with animated transitions. GSAP-powered animations elevate every scroll and interaction into a sensory experience that reinforces the brand's identity.",
    highlights: [
      "GSAP & Framer Motion powered cinematic scroll animations",
      "Interactive menu with categories, filtering, and modals",
      "Full cart and checkout flow with order summary",
      "Dark, mood-setting UI that reinforces the brand identity",
    ],
    href: "https://dopamine-lemon.vercel.app/",
    image: "/assets/projects/dompaine.webp",
    bgImage: "/assets/projects/dompaine.webp",
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Framer Motion" },
      { id: 3, name: "GSAP" },
      { id: 4, name: "Tailwind CSS" },
    ],
  },
  {
    id: 6,
    name: "TriageFlow — Hospital Triage Dashboard",
    slug: "triageflow",
    year: "2025",
    role: "Full-Stack Developer",
    description:
      "A bilingual (Arabic/French) smart hospital triage dashboard for real-time patient prioritization and medical staff management.",
    longDescription:
      "TriageFlow is a mission-critical hospital triage management system built to assist medical staff in real-time patient prioritization. The dashboard is fully bilingual (Arabic & French), designed for fast-paced clinical environments where clarity and speed are essential. It features color-coded priority queues, patient record management, and staff assignment tools — all within a clean, accessible interface.",
    highlights: [
      "Real-time patient queue with color-coded priority levels",
      "Full Arabic & French bilingual interface with RTL support",
      "Staff role management and assignment system",
      "Clean, accessible UI optimized for clinical workflow speed",
    ],
    href: "#",
    image: "/assets/projects/triageflow.webp",
    bgImage: "/assets/projects/triageflow.webp",
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Dashboard" },
      { id: 3, name: "Healthcare" },
      { id: 4, name: "Bilingual" },
    ],
  },
];

export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/riadhvision/" },
  { name: "WhatsApp", href: "https://wa.me/213555711088" },
  { name: "GitHub", href: "https://github.com/riadhbellala" },
];
