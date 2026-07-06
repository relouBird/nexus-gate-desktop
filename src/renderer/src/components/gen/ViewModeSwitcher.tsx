// components/common/ViewModeSwitcher.tsx

import { DashboardSquare1, MusicList2 } from "@tailgrids/icons";

import { VIEW_MODE } from "@/types/index";

interface ViewModeSwitcherProps {
  value: VIEW_MODE;
  onChange: (mode: VIEW_MODE) => void;
  label?: string;
}

export function ViewModeSwitcher({
  value,
  onChange,
  label = "Affichage",
}: ViewModeSwitcherProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-text-secondary whitespace-nowrap">
        {label}
      </span>

      <div className="relative flex items-center p-1 rounded-xl border border-slate-300 bg-background-soft-100">
        {/* Background animé */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-background-50 shadow-sm transition-all duration-300 ease-out ${
            value === VIEW_MODE.GRID ? "translate-x-full" : "translate-x-0"
          }`}
        />

        <button
          type="button"
          title="Vue liste"
          onClick={() => onChange(VIEW_MODE.LIST)}
          className={`relative z-10 flex items-center gap-2 h-9 px-4 rounded-lg transition-all duration-200 ${
            value === VIEW_MODE.LIST
              ? "text-primary-500"
              : "text-text-tertiary hover:text-title-50"
          }`}
        >
          <MusicList2 size={16} />
          <span className="text-xs font-medium">Liste</span>
        </button>

        <button
          type="button"
          title="Vue grille"
          onClick={() => onChange(VIEW_MODE.GRID)}
          className={`relative z-10 flex items-center gap-2 h-9 px-4 rounded-lg transition-all duration-200 ${
            value === VIEW_MODE.GRID
              ? "text-primary-500"
              : "text-text-tertiary hover:text-title-50"
          }`}
        >
          <DashboardSquare1 size={16} />
          <span className="text-xs font-medium">Grille</span>
        </button>
      </div>
    </div>
  );
}
