import { WindowControls } from '@/components/ui/WindowControls'

// Logo
import logo from '@/assets/logo.png'

export function TitleBar(): React.JSX.Element {
  return (
    <header
      className="flex h-11 items-center justify-between border-b border-slate-200 bg-[#0C5978] px-3 text-white"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div
        className="flex items-center gap-2 font-semibold"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <img src={logo} title="Logo Image" className="h-5 w-5" />
        <span>Nexus Gate</span>
      </div>

      <WindowControls />
    </header>
  )
}
