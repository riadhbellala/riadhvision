// Poster artwork for projects that have one (public/selected-works, 4:5);
// everything else falls back to the cropped site preview (public/assets/projects/thumbs).
const ARTWORK = {
  athlete: "/selected-works/athlete-artwork.webp",
  batioil: "/selected-works/batioil-artwork.webp",
  drivo: "/selected-works/drivo-artwork.webp",
  hydrame: "/selected-works/hydrame-artwork.webp",
  "ronaldinho-store": "/selected-works/ro10-portfolio-artwork.webp",
  yashome: "/selected-works/yashome-artwork.webp",
};

export function hasArtwork(project) {
  return Boolean(ARTWORK[project.slug]);
}

export function cover(project) {
  return ARTWORK[project.slug] || `/assets/projects/thumbs/${project.slug}.webp`;
}
