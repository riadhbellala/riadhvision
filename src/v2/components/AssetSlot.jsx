/**
 * Placeholder for a future asset: a dashed box naming what goes here.
 * Size it with className (width, height or aspect ratio). Its colours follow
 * the section tone (see .asset-slot in index.css), and a soft fill keeps the
 * label on a calm surface over any part of the artwork.
 */
function AssetSlot({ label, className = "", ...rest }) {
  return (
    <div {...rest} className={`asset-slot flex items-center justify-center p-4 text-center rounded-card border border-dashed ${className}`}>
      <span className="text-label">ASSET: {label}</span>
    </div>
  );
}

export default AssetSlot;
