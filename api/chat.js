const PORTFOLIO_CONTEXT = `# Portfolio Context: Briefing Document

Hello! If you're a new assistant helping me with my portfolio or projects, this document contains everything you need to know about me, what I do, and how I work.

## Who I Am
- **Name:** Bellala Dhia Eddine
- **Location:** Algeria (Based on my contact number: +213)
- **Education:** Licence in Computer Science
- **Experience:** Full-Stack Developer
- **Availability:** Open to freelance work and new opportunities.

## My Skills
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, GSAP, 3D/WebGL (Three.js, React Three Fiber)
- **Backend:** Node.js, Express, MongoDB
- **Architecture & Design:** REST APIs, Auth Systems, UI/UX Design (Figma, Pixel-perfect Polish), Performance Audits (Core Web Vitals)

## Projects I've Built

1. **Athléte — Sports E-commerce Platform**
   - **What it does:** A premium e-commerce platform for sports gear with product filtering, cart management, and a seamless checkout experience.
   - **Tech Used:** React, Vite, Tailwind CSS, Framer Motion.
   - **My Role:** Full-Stack Developer (2024).

2. **HYDRAME**
   - **What it does:** A sleek, modern web application showcasing the Hydrame lifestyle brand with an interactive and responsive user experience.
   - **Tech Used:** React, Vite, Tailwind CSS, Framer Motion.
   - **My Role:** Frontend Developer (2025).

3. **SmartService DZ — Appointment SaaS**
   - **What it does:** A modern SaaS platform for automated appointment booking and service management tailored for Algerian businesses.
   - **Tech Used:** React, Node.js, MongoDB, Tailwind CSS.
   - **My Role:** Full-Stack Developer (2024).

4. **Ronaldinho Store — Sneaker Destination**
   - **What it does:** The ultimate streetwear and premium sneaker destination. Experience street culture and exclusive sneaker drops.
   - **Tech Used:** React, Vite, Tailwind CSS, E-commerce integrations.
   - **My Role:** Frontend Developer (2024).

5. **Dopamine — Coffee Brand Experience**
   - **What it does:** A specialty coffee brand with a cinematic UI, interactive menu, order management, and a full checkout flow.
   - **Tech Used:** React, Framer Motion, GSAP, Tailwind CSS.
   - **My Role:** Full-Stack Developer (2024).

6. **TriageFlow — Hospital Triage Dashboard**
   - **What it does:** A bilingual (Arabic/French) smart hospital triage dashboard for real-time patient prioritization and medical staff management.
   - **Tech Used:** React, Dashboard UI, Healthcare integrations, Bilingual support.
   - **My Role:** Full-Stack Developer (2025).

## Services I Offer
- **Full-Stack Development:** Building complete digital products from backend REST APIs (Node.js/MongoDB) to Frontend Excellence (React/Tailwind).
- **E-Commerce & SaaS Solutions:** Creating product management systems, checkout flows, multi-tenant architectures, and admin dashboards.
- **Landing Pages & Vitrine Sites:** Designing cinematic brand experiences, optimized for conversion, speed, and mobile responsiveness.
- **UI/UX Design & Performance:** Figma wireframing, code refactoring, and performance audits (Lighthouse, Core Web Vitals).

## Timelines & Deadlines
- **Vitrine Site / Portfolio:** 10 days
- **E-commerce Site:** 12 to 20 days
- **Custom System:** 20 days to 1 month
- **MVP (Minimum Viable Product):** 1 to 3 months
- **SaaS Platform:** Starts from 2 months

## Pricing
- **Vitrine Site / Portfolio:** starting at 30000da
- **E-commerce Site:** starting at 45000da
- **Custom System:** starting at 90000da
- **MVP:** starting at 300000da
- **SaaS Platform:** starting at 120000da
*(Note: Pricing depends heavily on the project's complexity. Feel free to contact me for a custom quote!)*

## Languages I Speak
- English
- French
- Arabic

## How to Contact Me
- **WhatsApp:** https://wa.me/213555711088
- **Instagram:** @riadhvision (https://www.instagram.com/riadhvision/)
- **GitHub:** riadhbellala (https://github.com/riadhbellala)
- **Email:** riadh5726@gmail.com

## Frequently Asked Questions (FAQ)

- **Do you handle both design and development?**
  Yes! I handle the full process — from UI/UX design in Figma to pixel-perfect frontend code and a robust backend. You get everything in one place.

- **Do you offer maintenance after the project is finished?**
  Absolutely, I'll make sure everything is running smoothly before I hand it over. If anything comes up after delivery, I've got you covered.

- **How do we communicate during a project?**
  However works best for you — WhatsApp, email, Discord, whatever you're comfortable with. I'm always reachable.

- **Do you require a deposit before starting?**
  Yes, a small deposit of 30% of the total price is required to get started. The rest is paid upon delivery.

- **Do you provide the domain and hosting?**
  Depending on the project — if you'd like me to handle hosting and the domain for you, that's totally doable but comes at an extra cost.

- **Can you provide the source code?**
  Yes of course! If you want full ownership of the source code, that's available as an add-on.

- **Do you have a team?**
  I work independently, which means direct communication and full focus on your project. For larger projects that need extra hands, I can bring in trusted collaborators.`;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Parse incoming request body
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Prepare the system prompt
    const systemPrompt = `You are a friendly personal assistant embedded in Riadh's portfolio website. You speak like a real human — warm, natural, and conversational. Answer questions about Riadh based only on the context provided. If you don't know something, say so honestly and suggest contacting Riadh directly. Never make up information. Context: ${PORTFOLIO_CONTEXT}`;

    // Construct the messages array for the Groq API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call the Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      return res.status(500).json({ error: 'Failed to fetch response from AI provider.' });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // Return the response
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
