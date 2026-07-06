import { formatNumber } from '@/helpers'

export default function StatCard({
  label,
  value,
  sub,
  subVariant = 'neutral',
  icon
}: {
  label: string
  value: string | number
  sub?: string
  subVariant?: 'success' | 'warning' | 'danger' | 'neutral'
  icon: React.ReactNode
}): React.JSX.Element {
  const subColors = {
    success: 'text-green-600',
    warning: 'text-amber-600',
    danger: 'text-red-500',
    neutral: 'text-gray-400'
  }
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
        <span className="text-gray-300">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900 leading-none">
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
        {sub && <p className={`text-xs mt-1.5 ${subColors[subVariant]}`}>{sub}</p>}
      </div>
    </div>
  )
}
