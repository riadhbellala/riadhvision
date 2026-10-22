// The projects the site shows. Some stay in constants but are hidden from the
// interface for now (by slug).
import { projects as all } from "../../constants";

const HIDDEN = new Set(["frigoclimat", "pikbox"]);

export const projects = all.filter((p) => !HIDDEN.has(p.slug));
