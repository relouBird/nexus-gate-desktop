export default function KeyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ? className : "w-4 h-4"}
      aria-hidden="true"
    >
      <circle cx="6" cy="7" r="3.5" />
      <path d="M9 9.5l5 5M12 10l2 2" />
    </svg>
  );
}
