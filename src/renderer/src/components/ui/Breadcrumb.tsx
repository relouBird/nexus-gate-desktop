import { NAV_ITEMS } from "@/constants/display/configuration.constant";
import type { IconType } from "@/types/configuration.type";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

export function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumb = useMemo(() => {
    let data: string[] = [];
    let link: string = "";
    let icon: IconType | null = null;
    const path = location.pathname;
    for (const group of NAV_ITEMS) {
      for (const child of group.children ?? []) {
        if (child.path && path.startsWith(child.path ?? "/")) {
          data = [group.label, child.label];
          link = `/${child.path}`;
          icon = child.icon ?? null;
        }
      }
    }
    return {
      data,
      icon,
      link,
    };
  }, [location.pathname]);
  return (
    <>
      <nav
        className="flex p-3 px-4 bg-neutral-secondary-medium border border-base-200 rounded-3xl"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <button
              onClick={() => {
                navigate(breadcrumb.link);
              }}
              className="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand"
            >
              {breadcrumb.icon && (
                <breadcrumb.icon size={16} className="me-1.5" />
              )}
              <span className="font-mono">{breadcrumb.data[0]}</span>
            </button>
          </li>
          <li aria-current="page">
            <div className="flex items-center space-x-1.5">
              <svg
                className="w-3.5 h-3.5 rtl:rotate-180 text-body"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9 5 7 7-7 7"
                />
              </svg>
              <span className="inline-flex items-center text-sm font-medium text-neutral-700/80">
                {breadcrumb.data[1]}
              </span>
            </div>
          </li>
        </ol>
      </nav>
    </>
  );
}
