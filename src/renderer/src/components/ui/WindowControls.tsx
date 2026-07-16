import { Close, ExpandSquare4, Minus } from '@tailgrids/icons'

export function WindowControls(): React.JSX.Element {
  return (
    <div
      className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <button
        type="button"
        aria-label="minimize"
        onClick={() => {}}
        className="flex h-10 w-12 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
      >
        <Minus size={16} strokeWidth={2.3} />
      </button>

      <button
        type="button"
        aria-label="maximize"
        onClick={() => {}}
        className="flex h-10 w-12 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
      >
        <ExpandSquare4 size={14} strokeWidth={2.3} />
      </button>

      <button
        type="button"
        aria-label="close"
        onClick={() => {}}
        className="flex h-10 w-12 items-center justify-center text-slate-500 transition hover:bg-red-600 hover:text-white"
      >
        <Close size={18} strokeWidth={2.3} />
      </button>
    </div>
  )
}
