export default function ServerRackIcon({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Rack enclosure */}
      <rect x="2" y="2" width="20" height="20" rx="2" />
      {/* Unité 1 */}
      <rect x="4" y="4.5" width="16" height="4" rx="1" />
      <circle cx="7" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      <line x1="10" y1="5.5" x2="17" y2="5.5" strokeWidth={1} />
      <line x1="10" y1="7.5" x2="14" y2="7.5" strokeWidth={1} />
      {/* Unité 2 */}
      <rect x="4" y="10" width="16" height="4" rx="1" />
      <circle cx="7" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <line x1="10" y1="11" x2="17" y2="11" strokeWidth={1} />
      <line x1="10" y1="13" x2="14" y2="13" strokeWidth={1} />
      {/* Unité 3 */}
      <rect x="4" y="15.5" width="16" height="4" rx="1" />
      <circle cx="7" cy="17.5" r="0.8" fill="currentColor" stroke="none" />
      <line x1="10" y1="16.5" x2="17" y2="16.5" strokeWidth={1} />
      <line x1="10" y1="18.5" x2="14" y2="18.5" strokeWidth={1} />
    </svg>
  );
}
