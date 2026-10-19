// Infinite ribbon (adapted from the iconiq InfiniteRibbon: plain JSX, no `cn`
// helper, RiadhVision palette instead of yellow). A band of text that scrolls
// forever; `rotation` tilts the band, `reverse` flips the direction.
const ribbonAnimationStyles = `
@keyframes iconiq-infinite-ribbon {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes iconiq-infinite-ribbon-reverse {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
@media (prefers-reduced-motion: reduce) {
  .iconiq-infinite-ribbon-track { animation: none !important; }
}
`;

export function InfiniteRibbon({ repeat = 5, duration = 10, reverse = false, rotation = 0, children, className = "", style }) {
  const repeatCount = Math.max(1, Math.floor(repeat));
  const animationName = reverse ? "iconiq-infinite-ribbon-reverse" : "iconiq-infinite-ribbon";

  return (
    <div
      className={`w-full max-w-full overflow-hidden py-1 bg-snow text-deep ${className}`}
      style={{ transform: `rotate(${rotation}deg)`, ...style }}
    >
      <span className="sr-only">{children}</span>
      <div
        aria-hidden="true"
        className="iconiq-infinite-ribbon-track flex w-max whitespace-nowrap"
        style={{ animation: `${animationName} ${Math.max(0.1, duration)}s linear infinite` }}
      >
        {Array.from({ length: repeatCount * 2 }, function renderCopy(_, index) {
          return (
            <span className="mr-8 inline-block select-none" key={index}>
              {children}
            </span>
          );
        })}
      </div>
      <style>{ribbonAnimationStyles}</style>
    </div>
  );
}

export default InfiniteRibbon;
