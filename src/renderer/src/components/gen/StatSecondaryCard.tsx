import { cn } from '@/utils/cn'

export interface StatSecondaryCardProps {
  icon: React.ReactNode
  iconColor?: string
  label: string
  value: string | number
  valueColor?: string
  subValue?: string
  subValueColor?: string
}

export default function StatSecondaryCard({
  icon,
  iconColor = 'bg-gray-50 text-gray-400',
  label,
  value,
  valueColor,
  subValue
}: StatSecondaryCardProps): React.JSX.Element {
  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
            iconColor && iconColor
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p
            className={cn(
              'text-lg font-semibold ',
              valueColor ? `text-${valueColor}-500` : 'text-gray-800'
            )}
          >
            {value}
            <span className="text-xs font-normal text-gray-400 ml-1">{subValue}</span>
          </p>
        </div>
      </div>
    </>
  )
}
