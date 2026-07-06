// config/navigation.ts

import type { FC, SVGProps } from "react";

export type IconType = FC<SVGProps<SVGSVGElement> & { size?: number }>;
export type NavItem = {
  label: string; // Nom affiché dans le menu
  path?: string; // Chemin pour les liens directs (optionnel si children)
  icon?: IconType; // Icône à afficher (optionnel)
  children?: NavItem[]; // Sous-éléments pour un menu déroulant
};

export const VIEW_MODE = {
  GRID: "grid",
  LIST: "list",
} as const;

export type VIEW_MODE = (typeof VIEW_MODE)[keyof typeof VIEW_MODE];

export type Tab = { label: string; value: string };

export interface TabActions<T> extends Tab {
  action: (data: T) => boolean;
}
