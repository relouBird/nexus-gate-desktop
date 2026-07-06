/** Grille SVG décorative en fond de la colonne branding */
export default function BrandingGridIcon() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Cercles de lumière ambiante */}
      <circle cx="30%" cy="40%" r="200" fill="white" opacity="0.03" />
      <circle cx="80%" cy="70%" r="150" fill="white" opacity="0.02" />
    </svg>
  );
}