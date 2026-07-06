export default function ModalOverlay({
  onClose,
  children
}: {
  onClose: () => void
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
