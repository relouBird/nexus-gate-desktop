export function LogServerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className ? className : "size-5"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Server */}
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <rect x="3" y="14" width="18" height="6" rx="2" />

      {/* LEDs */}
      <circle cx="7" cy="7" r="0.7" fill="currentColor" />
      <circle cx="7" cy="17" r="0.7" fill="currentColor" />

      {/* Logs */}
      <path d="M11 7h6" />
      <path d="M11 17h6" />
    </svg>
  );
}
