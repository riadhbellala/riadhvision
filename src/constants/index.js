// index.js
export const servicesData = [
  {
    title: "Full-Stack Development",
    description:
      "Complete web products, from database to interface, built clean and reliable.",
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
      "Online stores and SaaS platforms that stay fast and easy to manage as they grow.",
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
      "Premium websites and landing pages that build trust and turn visitors into clients.",
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
      "Clearer interfaces and faster products, without breaking what already works.",
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
  {
    title: "Mobile Apps",
    description: "iOS and Android apps that feel native, from one shared codebase.",
    items: [
      { title: "Cross-platform", description: "(React Native, Expo, iOS & Android)" },
      { title: "Native Feel", description: "(Smooth Gestures, Push Notifications)" },
      { title: "Store Launch", description: "(App Store & Google Play Publishing)" },
    ],
  },
  {
    title: "Custom CRM",
    description: "A CRM shaped around how your team sells, follows up and reports.",
    items: [
      { title: "Clients & Pipeline", description: "(Leads, Deals, Follow-ups)" },
      { title: "Automation", description: "(Reminders, Emails, Workflows)" },
      { title: "Reports", description: "(Dashboards, Exports, Team Roles)" },
    ],
  },
];

export const projects = [
  {
    id: "yashome",
    name: "YasHome — Real Estate Platform",
    slug: "yashome",
    category: "SaaS & Platforms",
    year: "2025",
    role: "Collaborator",
    description:
      "Algeria's premier real estate promotion platform — browse apartments, villas, and exclusive property projects with a modern, bilingual digital experience.",
    longDescription:
      "YasHome is Algeria's first dedicated real estate promotion platform, built to connect buyers with top-tier residential projects across the country. The platform features a curated property listing system, project showcase pages, and an immersive browsing experience in both French and Arabic. Every detail of the UI was designed to build trust and guide prospects through the discovery and contact journey, with smooth animations and a clean, premium aesthetic.",
    highlights: [
      "Curated property and project listing system",
      "Bilingual interface supporting French and Arabic",
      "Immersive project showcase pages with rich media",
      "SEO-optimized for the Algerian real estate market",
    ],
    href: "https://yas-home.com/fr",
    image: "/assets/projects/yas-home.com_fr.webp",
    bgImage: "/assets/projects/yas-home.com_fr.webp",
    frameworks: [
      { id: 1, name: "Next.js" },
      { id: 2, name: "Tailwind CSS" },
      { id: 3, name: "Bilingual" },
      { id: 4, name: "Real Estate" },
    ],
  },
  {

    id: 1,
    name: "FrigoClimat — Commercial Refrigeration & Fitout",
    slug: "frigoclimat",
    category: "Websites",
    year: "2025",
    role: "Frontend Developer",
    description:
      "A premium website for a French commercial refrigeration and shop-fitting specialist, showcasing their expertise in custom bakery, butchery, and restaurant equipment.",
    longDescription:
      "FrigoClimat (FCS) is a specialist in commercial refrigeration, custom shop-fitting, and professional kitchen equipment based in Île-de-France. The website was built to reflect over 20 years of expertise, presenting their services — from custom refrigerated display cases to full bakery and butchery fit-outs — in an elegant and accessible digital presence. The site features smooth animations, a projects gallery, and a structured service catalog optimized for local SEO.",
    highlights: [
      "Cinematic hero section with scroll-reveal animations",
      "Structured service catalog covering 7 professional trades",
      "Scrolling client and partner marquee showcasing 30+ brands",
      "Fully SEO-optimized with structured data and local business schema",
    ],
    href: "https://www.frigoclimat.fr/",
    image: "/assets/projects/frigoclimat.webp",
    bgImage: "/assets/projects/frigoclimat.webp",
    frameworks: [
      { id: 1, name: "Next.js" },
      { id: 2, name: "Tailwind CSS" },
      { id: 3, name: "Framer Motion" },
      { id: 4, name: "SEO" },
    ],
  },
  {
    id: "batioil",
    name: "Batioil — Premium Lubricants Brand",
    slug: "batioil",
    category: "E-commerce",
    year: "2025",
    role: "Full-Stack Developer",
    description:
      "A multilingual product catalog website for an Algerian premium engine oil brand, covering 6 vehicle categories from motorcycles to heavy industry.",
    longDescription:
      "Batioil is an Algerian lubricants brand backed by over 60 years of Turkish lubrication expertise, delivering certified engine oils for motorcycles, cars, trucks, heavy engines, factory equipment, and maritime applications. The website was built as a full multilingual product catalog (French, English, Arabic) with cinematic hero sections, a structured category grid, an interactive best-sellers slider, and an enterprise company page — all designed to position Batioil as a trusted, premium brand in the industrial market.",
    highlights: [
      "Full multilingual catalog in French, English, and Arabic",
      "6 product categories with dedicated landing pages",
      "Interactive best-sellers slider with technical specs",
      "Cinematic hero with animated product showcase",
    ],
    href: "https://batioil.com/en",
    image: "/assets/projects/batioil.com_en.webp",
    bgImage: "/assets/projects/batioil.com_en.webp",
    frameworks: [
      { id: 1, name: "Next.js" },
      { id: 2, name: "Tailwind CSS" },
      { id: 3, name: "Multilingual" },
      { id: 4, name: "E-commerce" },
    ],
  },
  {
    id: "pikbox",
    name: "PiKBOX® — Branding Agency Website",
    slug: "pikbox",
    category: "Websites",
    year: "2025",
    role: "Full-Stack Developer",
    description:
      "A full-featured agency website for Algeria's leading branding studio, with a dark cinematic aesthetic, multilingual support, and 4 specialized department pages.",
    longDescription:
      "PiKBOX® is Algeria's premier branding agency based in Batna, and this website was designed and built to match their bold, professional identity. The platform covers four distinct departments — BrandBox, PrintBox, SpaceBox, and E-Box — each with dedicated service pages. It features a dark, glassmorphic aesthetic, a dynamic portfolio section, a multilingual architecture (French, English, Arabic), and a client portal login. The site is built to convert visitors into clients, showcasing 60+ brand partnerships.",
    highlights: [
      "4-department architecture with dedicated service pages",
      "Multilingual support for French, English, and Arabic (RTL)",
      "Dynamic portfolio with client logo marquee and case studies",
      "Dark glassmorphic UI with cinematic scroll animations",
    ],
    href: "https://www.pikboxpro.com/",
    image: "/assets/projects/pikbox.webp",
    bgImage: "/assets/projects/pikbox.webp",
    frameworks: [
      { id: 1, name: "Next.js" },
      { id: 2, name: "Tailwind CSS" },
      { id: 3, name: "Multilingual" },
      { id: 4, name: "Branding" },
    ],
  },
  {
    id: 0,
    name: "Drivo — Multi-Tenant Car Rental SaaS",
    slug: "drivo",
    category: "SaaS & Platforms",
    year: "2026",
    role: "Full-Stack Developer",
    description:
      "A multi-tenant SaaS platform and desktop management app built for car rental agencies, featuring automated billing and contract generation.",
    longDescription:
      "Drivo is a comprehensive multi-tenant SaaS solution designed specifically for car rental agencies. It provides a powerful desktop management app for day-to-day operations, including vehicle tracking, bookings, and walk-in customer management. The platform features an automated billing and subscription enforcement system, multi-role access control, and instant native French rental contract generation, all backed by a robust and scalable architecture.",
    highlights: [
      "Desktop management app built with Electron and React",
      "Multi-tenant backend architecture with Supabase",
      "Automated subscription and billing enforcement system",
      "Instant native French rental contract generation",
    ],
    href: "#",
    image: "/assets/projects/drivo-pics/projectpic1.webp",
    bgImage: "/assets/projects/drivo-pics/projectpic1.webp",
    gallery: [
      "/assets/projects/drivo-pics/projectpic1.webp",
      "/assets/projects/drivo-pics/pic2.webp",
      "/assets/projects/drivo-pics/pic3.webp",
      "/assets/projects/drivo-pics/pic4.webp",
      "/assets/projects/drivo-pics/pic5.webp",
      "/assets/projects/drivo-pics/pic6.webp",
    ],
    frameworks: [
      { id: 1, name: "React" },
      { id: 2, name: "Electron" },
      { id: 3, name: "Node.js" },
      { id: 4, name: "Supabase" },
    ],
  },
  {

    id: 1,
    name: "Athléte — Sports E-commerce Platform",
    slug: "athlete",
    category: "E-commerce",
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
    category: "Websites",
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
    image: "/assets/projects/hydrame.webp",
    bgImage: "/assets/projects/hydrame.webp",
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
    category: "SaaS & Platforms",
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
    category: "E-commerce",
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
    id: 6,
    name: "TriageFlow — Hospital Triage Dashboard",
    slug: "triageflow",
    category: "SaaS & Platforms",
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
