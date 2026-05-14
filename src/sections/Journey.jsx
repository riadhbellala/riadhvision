import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: "01",
    tag: "Discovery",
    title: "You Share the Idea",
    description:
      "We start with a conversation. You tell me your vision, problem, and goals. I ask the right questions — about users, scope, and what success looks like.",
    detail: "30–60 min call · Free consultation",
    color: "#a1ebd4",
  },
  {
    step: "02",
    tag: "Planning",
    title: "I Map the Architecture",
    description:
      "Your idea becomes a technical plan: stack selection, database design, feature breakdown, and a project roadmap with clear milestones.",
    detail: "Tech spec · Timeline · Feature scope",
    color: "#7dd3fc",
  },
  {
    step: "03",
    tag: "Design",
    title: "UI & Experience First",
    description:
      "Before logic is written, the interface is designed. We define the look, feel, and flow — making sure it feels premium and intuitive, not just functional.",
    detail: "Wireframes · Design system · Component map",
    color: "#f9a8d4",
  },
  {
    step: "04",
    tag: "Development",
    title: "Building the Real Thing",
    description:
      "Frontend, backend, APIs, database — all built clean, modular, and scalable. Progress demos shared throughout. You're never left in the dark.",
    detail: "Bi-weekly demos · Clean code · Version controlled",
    color: "#fcd34d",
  },
  {
    step: "05",
    tag: "Testing",
    title: "Battle-Testing Everything",
    description:
      "Tested across devices, browsers, and edge cases. Performance optimized. Security hardened. A product that doesn't break in the real world.",
    detail: "QA · Performance audit · Cross-device",
    color: "#c4b5fd",
  },
  {
    step: "06",
    tag: "Launch",
    title: "From Local to Live",
    description:
      "Deployment, DNS, CI/CD — all handled. Your product goes live with zero downtime. I stay available post-launch for fixes, iteration, and growth.",
    detail: "Deployment · Handoff · Ongoing support",
    color: "#a1ebd4",
  },
];

const Journey = () => {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);

  useGSAP(() => {
    // Animate the SVG path drawing
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        },
      });
    }

    // Animate each step card
    gsap.utils.toArray(".process-step").forEach((step, i) => {
      const fromLeft = i % 2 === 0;
      gsap.fromTo(
        step,
        { opacity: 0, x: fromLeft ? -50 : 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
          },
        }
      );
    });

    // Animate the dots
    gsap.utils.toArray(".map-dot").forEach((dot) => {
      gsap.fromTo(
        dot,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: dot,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  // SVG winding path: zigzag between left and right nodes
  // Each step is ~200px apart vertically, nodes alternate at x=120 and x=480 in a 600px wide SVG
  const svgWidth = 600;
  const stepHeight = 200;
  const leftX = 110;
  const rightX = 490;

  const buildPath = () => {
    let d = `M ${leftX} 0`;
    steps.forEach((_, i) => {
      const y = i * stepHeight;
      const nextY = (i + 1) * stepHeight;
      const currentX = i % 2 === 0 ? leftX : rightX;
      const nextX = i % 2 === 0 ? rightX : leftX;

      if (i < steps.length - 1) {
        const midY = y + stepHeight / 2;
        // Smooth bezier curve to next node
        d += ` C ${currentX} ${midY}, ${nextX} ${midY}, ${nextX} ${nextY}`;
      }
    });
    return d;
  };

  const totalSvgHeight = (steps.length - 1) * stepHeight + 40;

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent text-white py-28 overflow-hidden"
    >
      {/* Section Header */}
      <div className="px-6 md:px-16 max-w-6xl mx-auto mb-24">
        <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-4">
          How I Work
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none uppercase">
            Idea
            <br />
            <span className="text-white/20">→ Product.</span>
          </h2>
          <p className="text-base md:text-lg text-white/40 font-light max-w-sm md:text-right leading-relaxed">
            Six clear steps. No surprises. From the first conversation to a live, production-ready product.
          </p>
        </div>
      </div>

      {/* Roadmap */}
      <div className="relative max-w-3xl mx-auto px-4">
        {/* SVG Path */}
        <svg
          className="absolute left-1/2 -translate-x-1/2 top-0 w-full pointer-events-none"
          viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ height: `${totalSvgHeight}px` }}
        >
          <path
            ref={pathRef}
            d={buildPath()}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            opacity="0.15"
          />
          {/* Animated colored path on top */}
          <path
            id="colored-path"
            d={buildPath()}
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="2"
            strokeDasharray="8 6"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="roadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a1ebd4" />
              <stop offset="50%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#c4b5fd" />
            </linearGradient>
          </defs>
        </svg>

        {/* Steps */}
        <div
          className="relative flex flex-col"
          style={{ gap: `${stepHeight - 80}px`, paddingTop: "20px", paddingBottom: "20px" }}
        >
          {steps.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={index}
                className={`process-step flex items-center gap-6 ${
                  isLeft ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Card */}
                <div className={`w-[calc(50%-40px)] ${isLeft ? "text-left" : "text-right"}`}>
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/25 transition-all duration-500 group relative overflow-hidden">
                    {/* Glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at ${isLeft ? "20%" : "80%"} 30%, ${item.color}20, transparent 70%)`,
                      }}
                    />

                    <span
                      className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border mb-3"
                      style={{
                        color: item.color,
                        borderColor: item.color + "40",
                        backgroundColor: item.color + "15",
                      }}
                    >
                      {item.tag}
                    </span>

                    <h3 className="text-lg md:text-xl font-bold tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-white/50 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className={`flex items-center gap-2 border-t border-white/5 pt-3 ${isLeft ? "" : "justify-end"}`}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] text-white/30">{item.detail}</span>
                    </div>
                  </div>
                </div>

                {/* Center Node */}
                <div className="map-dot flex-shrink-0 flex items-center justify-center relative z-10">
                  <div
                    className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-sm bg-black/60 backdrop-blur-sm"
                    style={{ borderColor: item.color, color: item.color, boxShadow: `0 0 20px ${item.color}40` }}
                  >
                    {item.step}
                  </div>
                </div>

                {/* Spacer opposite side */}
                <div className="w-[calc(50%-40px)]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-6xl mx-auto mt-16 px-6 md:px-16 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <p className="text-sm text-white/30 font-light whitespace-nowrap">
          Ready?{" "}
          <a
            href="mailto:riadh5726@gmail.com"
            className="text-white/60 hover:text-white underline underline-offset-4 transition-colors duration-200"
          >
            Let's start →
          </a>
        </p>
        <div className="h-px flex-1 bg-white/10" />
      </div>
    </section>
  );
};

export default Journey;
