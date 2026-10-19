import { FILES } from "./icons";

const DIR = "/icons-webp/";

/**
 * One 3D glass icon by name (see FILES). Decorative by default (empty alt).
 * `float` gives it a slow idle bob,
 * off with reduced motion (.glass-float in index.css).
 */
function GlassIcon({
  name,
  size = 96,
  float = false,
  alt = "",
  className = "",
  style,
}) {
  const file = FILES[name] || FILES.layers;
  return (
    <img
      src={DIR + file}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading="lazy"
      decoding="async"
      draggable="false"
      className={`select-none pointer-events-none object-contain ${float ? "glass-float" : ""} ${className}`}
      style={style}
    />
  );
}

export default GlassIcon;
