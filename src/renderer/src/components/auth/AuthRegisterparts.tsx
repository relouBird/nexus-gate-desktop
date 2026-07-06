// ─── Step Dot ───────────────────────────────────────────

import { Check } from '@tailgrids/icons'

export function StepDot({
  number,
  active,
  done,
  label
}: {
  number: number
  active: boolean
  done: boolean
  label: string
}): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
          done
            ? 'bg-primary-500 text-white'
            : active
              ? 'bg-primary-50 border-2 border-primary-500 text-primary-600'
              : 'bg-base-100 border border-base-200 text-foreground-soft-500/50'
        }`}
        aria-current={active ? 'step' : undefined}
      >
        {done ? <Check /> : number}
      </div>
      <span
        className={`text-xs whitespace-nowrap transition-colors ${active || done ? 'text-primary-600 font-medium' : 'text-foreground-soft-500/40'}`}
      >
        {label}
      </span>
    </div>
  )
}

// ─── Step indicator ───────────────────────────────────────────

export function StepIndicator({ current }: { current: 1 | 2 }): React.JSX.Element {
  return (
    <div className="flex items-center gap-2" aria-label="Étape de création du compte">
      <StepDot number={1} active={current === 1} done={current > 1} label="Votre équipe" />
      <div
        className={`flex-1 h-px transition-colors duration-300 ${current > 1 ? 'bg-primary-400' : 'bg-slate-200'}`}
      />
      <StepDot number={2} active={current === 2} done={false} label="Votre compte" />
    </div>
  )
}
