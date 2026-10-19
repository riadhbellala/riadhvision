// eslint-disable-next-line no-unused-vars
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
const VIEW = { once: true, amount: 0.8 };

/**
 * Text-editor selection on a word or phrase (after the "No one knows" and
 * "your brand deserves better content" posters): a glass highlight sweeps
 * across it, then two handles with round knobs and an optional toolbar
 * (e.g. ["Copy", "Paste"]) appear. Drawn once, when it comes into view.
 * Reduced motion: shown complete.
 */
export function Selected({ children, delay = 0, toolbar }) {
  const reduce = useReducedMotion();
  return (
    <span data-selected className="relative inline-block whitespace-nowrap">
      <motion.span
        aria-hidden
        className="absolute inset-x-[-0.06em] inset-y-[0.04em] rounded-[0.1em] bg-glow/45 origin-left"
        initial={{ scaleX: reduce ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEW}
        transition={{ duration: 0.7, ease: EASE, delay }}
      />
      <motion.span
        aria-hidden
        className="absolute inset-x-[-0.06em] inset-y-[0.04em]"
        initial={{ opacity: reduce ? 1 : 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEW}
        transition={{ duration: 0.3, delay: delay + 0.6 }}
      >
        <span className="absolute left-0 inset-y-0 w-[2px] bg-snow">
          <span className="absolute -top-[0.16em] left-1/2 -translate-x-1/2 w-[0.16em] h-[0.16em] min-w-2 min-h-2 rounded-full bg-glow ring-2 ring-snow" />
        </span>
        <span className="absolute right-0 inset-y-0 w-[2px] bg-snow">
          <span className="absolute -bottom-[0.16em] left-1/2 -translate-x-1/2 w-[0.16em] h-[0.16em] min-w-2 min-h-2 rounded-full bg-glow ring-2 ring-snow" />
        </span>
      </motion.span>
      {toolbar && (
        <motion.span
          aria-hidden
          className="absolute left-1/2 bottom-[calc(100%+0.25em)] -translate-x-1/2 hidden md:inline-flex rounded-[10px] overflow-hidden bg-ink/90 border border-snow/15 text-[14px] font-normal tracking-normal normal-case leading-none shadow-[0_8px_24px_rgba(7,10,22,0.4)]"
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.4, ease: EASE, delay: delay + 0.75 }}
        >
          {toolbar.map(function renderTool(tool, i) {
            return (
              <span key={tool} className={`px-3 py-2 text-snow ${i ? "border-l border-snow/15" : ""}`}>
                {tool}
              </span>
            );
          })}
        </motion.span>
      )}
      <span className="relative">{children}</span>
    </span>
  );
}

/**
 * A small tilted tag stuck onto a heading (after the "Who we are" poster): a
 * target dot and a few words. It pops in with a spring when seen, then keeps
 * swaying gently (.tag-sway in index.css; still with reduced motion). Place it
 * with className (absolute position).
 */
export function Tag({ children, rotate = -6, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`absolute z-10 hidden md:block ${className}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEW}
      transition={{ type: "spring", stiffness: 380, damping: 22, delay: delay + 0.4 }}
    >
      <span
        className="tag-sway inline-flex items-center gap-2 rounded-pill bg-snow text-deep px-3.5 py-1.5 text-[14px] font-medium tracking-normal normal-case leading-none whitespace-nowrap shadow-[0_8px_24px_rgba(7,10,22,0.35)]"
        style={{ "--tag-r": `${rotate}deg`, animationDelay: `${delay * 2}s` }}
      >
        <span className="grid place-items-center w-4 h-4 rounded-full border-2 border-royal">
          <span className="w-1.5 h-1.5 rounded-full bg-royal" />
        </span>
        {children}
      </span>
    </motion.span>
  );
}

export default Selected;
