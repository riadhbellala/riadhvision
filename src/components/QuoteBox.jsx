import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Icon } from "@iconify/react/dist/iconify.js";

const quotes = [
  {
    text: (
      <p>
        “ Great software is built <br />
        when a <span className="text-gold">developer learns</span>
        <br />
        to <span className="italic">think clearly</span> before
        <br />
        <span className="font-[600]">typing anything</span>. ” <br />
        <span className="text-base opacity-70">— Kent Beck</span>
      </p>
    ),
  },
  {
    text: (
      <p>
        “ A true engineer writes <br />
        <span className="font-[600]">simple solutions</span>
        <br />
        to{" "}<span className="italic">problems that once</span> <br />
        seemed <span className="text-gold">impossible</span>. ” <br />
        <span className="text-sm opacity-70">— Martin Fowler</span>
      </p>
    ),
  },
  {
    text: (
      <p>
        “ The best code feels like <br />
        <span className="font-[600]">a quiet conversation</span>
        <br />
        <span className="italic">where every line</span>{" "}knows
        <br />
        it&apos;s <span className="text-gold">purpose</span>. ” <br />
        <span className="text-sm opacity-70">— Robert C. Martin</span>
      </p>
    ),
  },
  {
    text: (
      <p>
        “ Good engineers reduce <br />
        <span className="font-[600]">complex ideas</span>
        <br />
        <span className="italic">into systems</span>{" "}that work
        <br />
        with <span className="text-gold">elegance</span>. ” <br />
        <span className="text-sm opacity-70">— Linus Torvalds</span>
      </p>
    ),
  },
  {
    text: (
      <p>
        “ Engineering is art that <br />
        <span className="font-[600]">solves real problems</span>
        <br />
        with{" "}<span className="italic">logic shaped </span>
        <br />
        into{" "}<span className="text-gold">structure</span>. ” <br />
        <span className="text-sm opacity-70">— Bjarne Stroustrup</span>
      </p>
    ),
  },
];

const QuoteBox = () => {
    const icon = "mdi:arrow-bottom-right";
  const quoteRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(Math.random() * quotes.length)
  );

  const fadeIn = () => {
    gsap.fromTo(
      quoteRef.current,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  };

  const fadeOut = (onComplete) => {
    gsap.to(quoteRef.current, {
      autoAlpha: 0,
      y: -10,
      duration: 0.5,
      ease: "power3.inOut",
      onComplete,
    });
  };

  const showNewQuote = () => {
    fadeOut(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * quotes.length);
      } while (nextIndex === currentIndex);

      setCurrentIndex(nextIndex);
      fadeIn();
    });
  };

  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div
        ref={quoteRef}
        className="overflow-hidden font-extralight text-center contact-text-responsive px-4"
      >
        {quotes[currentIndex].text}
      </div>

      <button
        onClick={showNewQuote}
        className="mt-8 px-6 py-2 rounded-full border border-black/20 hover:border-transparent hover:bg-white hover:text-black transition-all duration-500 flex justify-center items-center gap-3 hover:gap-5 cursor-pointer"
      >
        Next Quote <Icon icon={icon} className="-rotate-45" />
      </button>
    </div>
  );
};

export default QuoteBox;
