import { Link } from "react-router-dom";
import GlassIcon from "./GlassIcon";

const EASE = "ease-[cubic-bezier(0.65,0,0.35,1)]";

/**
 * Primary call to action with a rolling glass lens. A snow capsule carries the
 * label; a glass orb, a little taller than the capsule so it bulges out of its
 * outline, sits on the left end with a 3D icon inside. On hover the orb rolls
 * across the label to the right end (one full turn), the label slides over to
 * make room, and the text blurs behind the glass as it passes. Pressing
 * squeezes it. Reduced motion: no roll, the orb simply sits on the right.
 * Renders a router Link for `to`, a plain anchor for `href`.
 */
// Sizes: md for the page, sm for the navbar.
const SIZES = {
  md: {
    tag: "h-14 pl-[76px] pr-8 hover:pl-8 hover:pr-[76px]",
    text: "text-[17px]",
    orb: "left-[-6px] group-hover:left-[calc(100%-62px)] w-[68px] h-[68px]",
    icon: "w-[84px] h-[84px]",
  },
  sm: {
    tag: "h-11 pl-[58px] pr-5 hover:pl-5 hover:pr-[58px]",
    text: "text-[15px]",
    orb: "left-[-4px] group-hover:left-[calc(100%-48px)] w-[52px] h-[52px]",
    icon: "w-[64px] h-[64px]",
  },
};

function OrbButton({ children, to, href, icon = "arrow", size = "md", className = "", ...rest }) {
  const z = SIZES[size] || SIZES.md;
  const Tag = to ? Link : "a";
  const target = to ? { to } : { href };

  return (
    <Tag
      {...target}
      {...rest}
      className={`group relative inline-flex items-center ${z.tag} rounded-pill bg-snow text-deep outline-none transition-[padding,transform] duration-500 ${EASE} active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-snow focus-visible:ring-offset-4 focus-visible:ring-offset-royal motion-reduce:transition-none shadow-[inset_0_1px_0_#fff,inset_0_-5px_12px_rgba(36,72,201,0.14),0_14px_36px_rgba(7,10,22,0.3)] ${className}`}
    >
      <span data-orb-label className={`${z.text} font-medium tracking-[-0.01em] whitespace-nowrap`}>{children}</span>

      {/* The glass lens: bulges past the capsule, rolls along it on hover. */}
      <span
        aria-hidden
        data-orb
        className={`absolute top-1/2 -translate-y-1/2 ${z.orb} rounded-full grid place-items-center rotate-0 group-hover:rotate-[360deg] transition-[left,rotate] duration-500 ${EASE} motion-reduce:transition-none`}
        style={{
          background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.75), rgba(201,216,244,0.35) 45%, rgba(36,72,201,0.28))",
          WebkitBackdropFilter: "blur(3px) saturate(160%)",
          backdropFilter: "blur(3px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.8)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.9), inset 0 -8px 16px rgba(36,72,201,0.3), 0 10px 24px rgba(7,10,22,0.3)",
        }}
      >
        {/* The art is bigger than the orb (it has empty margins), so centre it absolutely. */}
        <GlassIcon
          name={icon}
          size={84}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${z.icon} max-w-none`}
        />
      </span>
    </Tag>
  );
}

export default OrbButton;
