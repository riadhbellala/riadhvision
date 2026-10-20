// One-page site: projects open the live website, and "Start a project" opens
// a WhatsApp chat with a ready message.
const WHATSAPP = "213555711088";

export function whatsapp(text = "Hi Riadh, I'd like to start a project with you.") {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export const START = whatsapp();

// Live site of a project, or null when it has none (internal / NDA work).
export function siteOf(project) {
  return project?.href && project.href !== "#" ? project.href : null;
}

// Props for an external link opening in a new tab.
export const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" };
