// ClientBentoResponsive.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projotnoTea from "/assets/clients/projotno_tea.jpg";
import axisway from "/assets/clients/axisway.jpg";
import pulseFitness from "/assets/clients/pulse_fitness.jpg";
import playwearBD from "/assets/clients/playwearBD.jpg";
import interaid from "/assets/clients/interaid.jpg";
import puppetbrush from "/assets/clients/puppetbrush.jpg";
import qahaf from "/assets/clients/qahaf.jpg";
import retrofino from "/assets/clients/retrofino.jpg";
import sikder_foundation from "/assets/clients/sikder_foundation.jpg";
import treatosBD from "/assets/clients/treatosBD.jpg";
import posterOne from "/assets/posters/poster-1.jpg";
import posterTwo from "/assets/posters/poster-2.jpg";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER_LOGOS = [
  projotnoTea,
  axisway,
  playwearBD,
  interaid,
  puppetbrush,
  qahaf,
  retrofino,
  sikder_foundation,
  treatosBD,
  pulseFitness,
];

const LogoCell = ({ logo, borderClasses = "" }) => {
  return (
    <div
      className={`w-full aspect-square flex justify-center items-center relative ${borderClasses} overflow-hidden`}
    >
      <img src={logo} alt="client logo" className={`absolute object-cover`} />
    </div>
  );
};

export default function ClientsLogo() {
  const itemsRef = useRef([]);
  const containerRef = useRef(null);
  const text = `From startups to global teams, I build 
  tools that ship. Solving real problems  
  with precision and clarity.`;
  useEffect(() => {
    const nodes = itemsRef.current.filter(Boolean);
    if (!nodes.length) return;

    gsap.fromTo(
      nodes,
      { autoAlpha: 0, scale: 0.85 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="w-full pt-5 md:pt-10 lg:pt-16">
      <div className="">
        {/* Header */}
        <AnimatedHeaderSection
          subTitle={"Brands i've Worked With"}
          title={"Clients"}
          text={text}
          textColor={"text-black"}
          withScrollTrigger={true}
        />

        {/* Bento Grid - Desktop*/}
        <div className="mt-10 px-4 md:px-10">
          <div className="hidden lg:grid grid-cols-3">
            <div className="grid grid-cols-2">
              <LogoCell
                logo={PLACEHOLDER_LOGOS[0]}
                borderClasses="border-r border-b"
              />
              <LogoCell logo={PLACEHOLDER_LOGOS[1]} borderClasses="border-b" />
              <div className="col-span-2 aspect-square flex justify-center items-center pr-8 pt-8">
                <img
                  src={posterOne}
                  alt="poster one"
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 border-x">
              <LogoCell
                logo={PLACEHOLDER_LOGOS[2]}
                borderClasses="border-r border-b"
              />
              <LogoCell logo={PLACEHOLDER_LOGOS[3]} borderClasses="border-b" />
              <LogoCell
                logo={PLACEHOLDER_LOGOS[4]}
                borderClasses="border-r border-b"
              />
              <LogoCell logo={PLACEHOLDER_LOGOS[5]} borderClasses="border-b" />
              <LogoCell logo={PLACEHOLDER_LOGOS[6]} borderClasses="border-r" />
              <LogoCell logo={PLACEHOLDER_LOGOS[7]} height="h-6.5" />
            </div>
            <div className="grid grid-cols-2">
              <div className="col-span-2 aspect-square flex justify-center items-center border-b pl-8 pb-8 overflow-hidden">
                <img
                  src={posterTwo}
                  alt="poster two"
                  className="w-full h-full"
                />
              </div>
              <LogoCell logo={PLACEHOLDER_LOGOS[8]} borderClasses="border-r" />

              <LogoCell logo={PLACEHOLDER_LOGOS[9]} />
            </div>
          </div>
        </div>

        {/* Bento Grid - Tablet*/}
        <div className="mt-10 px-4 md:px-10">
          <div className="hidden md:grid lg:hidden grid-cols-3">
            <LogoCell
              logo={PLACEHOLDER_LOGOS[0]}
              borderClasses="border-r border-b"
            />
            <LogoCell
              logo={PLACEHOLDER_LOGOS[1]}
              borderClasses="border-r border-b"
            />
            <LogoCell logo={PLACEHOLDER_LOGOS[2]} borderClasses="border-b" />

            <div className="col-span-2 aspect-square flex justify-center items-center pr-8 py-8 border-b border-r">
              <img src={posterOne} alt="poster one" className="w-full h-full" />
            </div>
            <div className="grid grid-cols-1">
              <LogoCell logo={PLACEHOLDER_LOGOS[3]} borderClasses="border-b" />
              <LogoCell logo={PLACEHOLDER_LOGOS[4]} borderClasses="border-b" />
            </div>
            <LogoCell
              logo={PLACEHOLDER_LOGOS[5]}
              borderClasses="border-r border-b"
            />
            <LogoCell
              logo={PLACEHOLDER_LOGOS[6]}
              borderClasses="border-r border-b"
            />
            <LogoCell logo={PLACEHOLDER_LOGOS[7]} borderClasses="border-b" />
            <div className="grid grid-cols-1">
              <LogoCell logo={PLACEHOLDER_LOGOS[8]} borderClasses="border-b" />
              <LogoCell logo={PLACEHOLDER_LOGOS[9]} />
            </div>
            <div className="col-span-2 aspect-square flex justify-center items-center pl-8 pt-8 border-l">
              <img src={posterTwo} alt="poster two" className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Bento Grid - Mobile*/}
        <div className="mt-10 px-4 md:px-10">
          <div className="md:hidden grid grid-cols-3">
            <LogoCell logo={PLACEHOLDER_LOGOS[0]} borderClasses="border-r" />
            <LogoCell logo={PLACEHOLDER_LOGOS[1]} borderClasses="border-r" />
            <LogoCell logo={PLACEHOLDER_LOGOS[2]} />

            <div className="col-span-3 aspect-square flex justify-center items-center p-5 border-y">
              <img src={posterOne} alt="poster one" className="w-full h-full" />
            </div>
            <LogoCell logo={PLACEHOLDER_LOGOS[3]} borderClasses="border-r" />
            <LogoCell logo={PLACEHOLDER_LOGOS[4]} borderClasses="border-r" />
            <LogoCell logo={PLACEHOLDER_LOGOS[5]} height="h-8" />
            <LogoCell
              logo={PLACEHOLDER_LOGOS[6]}
              borderClasses="border-t border-r"
            />
            <LogoCell
              logo={PLACEHOLDER_LOGOS[7]}
              borderClasses="border-t border-r"
            />
            <LogoCell logo={PLACEHOLDER_LOGOS[8]} borderClasses="border-t" />
          </div>
        </div>
      </div>
    </section>
  );
}
