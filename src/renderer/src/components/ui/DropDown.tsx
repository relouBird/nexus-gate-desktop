// components/DropdownItem.tsx
import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import type { NavItem } from "@/types/configuration.type";
import { cn } from "@/utils/cn";
import { ChevronDown } from "@tailgrids/icons";

export function DropdownItem({
  item,
  stretched,
}: {
  item: NavItem;
  stretched?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isActive = item.children?.some((c) =>
    location.pathname.startsWith(c.path ?? "/"),
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors outline-none",
          isActive
            ? "text-primary-500 bg-primary-50"
            : "text-foreground-soft-500 hover:text-title-50 hover:bg-background-soft-100",
          stretched && "w-full justify-between",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full rounded-xl border border-base-200 bg-background-50 shadow-lg py-1 z-50">
          {item.children?.map((child, idx) => (
            <div key={child.path}>
              {idx === 1 && <div className="my-1 h-px bg-base-200" />}
              <NavLink
                to={child.path!}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-2 text-sm transition-colors",
                    isActive
                      ? "text-primary-500 bg-primary-50 font-medium"
                      : "text-foreground-soft-500 hover:bg-background-soft-100 hover:text-title-50",
                  )
                }
              >
                {child.label}
              </NavLink>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
