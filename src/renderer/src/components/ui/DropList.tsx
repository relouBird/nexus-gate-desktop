// components/DropdownItem.tsx
import { useRef } from "react";
import { NavLink } from "react-router";
import type { NavItem } from "@/types/configuration.type";
import { cn } from "@/utils/cn";

export function DropListItem({
  item,
  stretched,
}: {
  item: NavItem;
  stretched?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="relative">
      <p
        className={cn(
          "flex items-center font-mono gap-1.5 px-1 py-2 rounded-lg text-xs font-medium transition-colors outline-none text-foreground-soft-500",
          stretched && "w-full justify-between",
        )}
      >
        {item.label.toLocaleUpperCase()}
      </p>

      <div>
        {item.children?.map((child, idx) => (
          <div key={child.path} className="focus:outline-none">
            {idx === 1 && <div className="h-px bg-base-200 mb-1" />}
            <NavLink
              to={child.path!}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2 gap-1.5 text-sm transition-colors outline outline-transparent focus:outline-primary-100 rounded-lg",
                  isActive
                    ? "text-primary-500 bg-primary-50 font-medium"
                    : "text-foreground-soft-500 hover:bg-background-soft-100 hover:text-title-50",
                )
              }
            >
              {child.icon && <child.icon size={20} className="shrink-0" />}
              {child.label}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}
