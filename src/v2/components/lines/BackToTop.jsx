import { useLenis } from "lenis/react";

/** "[ BACK TO TOP ]" label that scrolls to the top with Lenis. */
function BackToTop() {
  const lenis = useLenis();
  function handleClick() {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <button type="button" onClick={handleClick} className="text-label text-deep hover:opacity-70 cursor-pointer">
      [ BACK TO TOP ]
    </button>
  );
}

export default BackToTop;
