export function ShieldRuleIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 2L3 5.5v4.5c0 4.1 3 7.8 7 8.7 4-1 7-4.6 7-8.7V5.5L10 2z" />
      <path d="M7 10l2 2 4-4" />
    </svg>
  );
}
