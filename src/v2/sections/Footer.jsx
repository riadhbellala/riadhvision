import { useLenis } from "lenis/react";
import GlassIcon from "../components/GlassIcon";
import { socials } from "../../constants";

const LINKS = [
  { label: "About", target: "#manifesto" },
  { label: "Services", target: "#services" },
  { label: "Work", target: "#work" },
  { label: "Process", target: "#process" },
  { label: "Contact", target: "#contact" },
];

// The same frosted sheet as the hero, so the page opens and closes on glass.
const SHEET = {
  background:
    "linear-gradient(160deg, rgba(242,245,251,0.10), rgba(242,245,251,0.03)), rgba(7,10,22,0.35)",
  border: "1px solid rgba(242,245,251,0.2)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
};

// 12 — Footer: one compact glass sheet, the hero's bookend. Brand and links on
// top, credit, email and back-to-top below.
function Footer() {
  const lenis = useLenis();

  function go(event) {
    event.preventDefault();
    const target = event.currentTarget.getAttribute("href");
    if (lenis) lenis.scrollTo(target);
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }

  function top() {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer
      id="footer"
      data-tone="dark"
      className="relative z-10 px-3 pb-28 md:px-4 md:pb-28"
    >
      <div className="rounded-[32px] px-6 py-8 md:px-12 md:py-10" style={SHEET}>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <GlassIcon name="logo" size={56} alt="" />
            <div>
              <p className="text-h4 text-snow">RiadhVision</p>
              <p className="text-small text-ice">
                Websites and web apps, designed and built in Algeria.
              </p>
            </div>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {LINKS.map(function renderLink(link) {
                return (
                  <li key={link.target}>
                    <a
                      href={link.target}
                      onClick={go}
                      className="text-body text-snow/85 hover:text-snow transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-snow/15 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-small text-ice">
          <p>© 2026 RiadhVision. Based in Algeria.</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <a
                href="mailto:riadh5726@gmail.com"
                className="hover:text-snow transition-colors"
              >
                riadh5726@gmail.com
              </a>
            </li>
            {socials.map(function renderSocial(s) {
              return (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-snow transition-colors"
                  >
                    {s.name}
                  </a>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={top}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-pill bg-snow/10 border border-snow/20 text-snow transition-[background-color,transform] duration-200 ease-out hover:bg-snow/20 active:scale-[0.97]"
              >
                Back to top
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M8 14V2M3 7l5-5 5 5" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
