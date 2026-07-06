export default function ModalHeader({
  title,
  icon,
  onClose
}: {
  title: string
  icon: React.ReactNode
  onClose: () => void
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="Fermer"
      >
        <svg
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="w-3.5 h-3.5"
        >
          <path d="M3 3l8 8M11 3l-8 8" />
        </svg>
      </button>
    </div>
  )
}
