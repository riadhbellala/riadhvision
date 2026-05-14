import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const About = () => {
  const text = `Crafting impactful digital experiences that
    blend design, technology, and
    strategy.`;
  const aboutText = `I'm Riadh Bellala, a passionate full-stack developer and digital strategist who believes that great ideas deserve exceptional execution. With a background in building scalable web applications, eCommerce platforms, and marketing solutions, I help startups and businesses bring their visions to life — pixel by pixel, line by line.

  My work blends clean, modern aesthetics with performance-driven functionality. Whether it's designing an intuitive user interface, optimizing a campaign funnel, or automating a workflow, I focus on delivering results that matter.

  When I'm not coding or creating, you'll find me exploring new tech trends, experimenting with animations, or refining UI/UX flows to the last detail.`;
  const imgRef = useRef(null);
  useGSAP(() => {
    gsap.to("#about", {
      scale: 0.95,
      scrollTrigger: {
        trigger: "#about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
        markers: false,
      },
      ease: "power1.inOut",
    });

    gsap.set(imgRef.current, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.to(imgRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 2,
      ease: "power4.out",
      scrollTrigger: { trigger: imgRef.current },
    });
  });
  return (
    <section id="about" className="min-h-screen bg-black rounded-b-4xl">
      <AnimatedHeaderSection
        subTitle={"Craft in Details, Strength in Structure."}
        title={"About"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      <div className="flex flex-col items-center justify-between gap-16 px-4 md:px-10 pb-16 text-xl font-light tracking-wide lg:flex-row-reverse md:text-2xl lg:text-3xl text-white/60">
        <img
          ref={imgRef}
          src="images/riadh.webp"
          alt="riadh photo"
          className="rounded-xl w-full lg:w-2/5"
        />
        <AnimatedTextLines text={aboutText} className={"w-full text-lg"} lineGap="pb-5 last:pb-0"/>
      </div>
    </section>
  );
};

export default About;
