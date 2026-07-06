export default function ServerIcon({
  className = "w-4 h-4",
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
      <rect x="2" y="3" width="20" height="5" rx="1.5" />
      <rect x="2" y="10" width="20" height="5" rx="1.5" />
      <rect x="2" y="17" width="20" height="5" rx="1.5" />
      <circle cx="6" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="6" cy="19.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
