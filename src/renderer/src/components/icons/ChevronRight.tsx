export default function ChevronRight({
  className = "w-4 h-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
    >
      <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
