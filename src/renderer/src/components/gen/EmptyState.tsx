import type { JSX } from 'react'

export interface EmptyStateProps {
  message: string
  icon: JSX.Element
}

export default function EmptyState({ message, icon }: EmptyStateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center bg-white border border-slate-200 rounded-xl">
      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-slate-100 flex items-center justify-center text-gray-300">
        {icon}
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}
