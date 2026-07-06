// Définition des types d'événements (optionnel, mais recommandé)
export type SeoMetaOptions = {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  forcePrefix?: boolean;
};

export const CRUD_ACTION = {
  CREATE: "create",
  UPDATE: "update",
  READ: "read",
} as const;

export type CRUD_ACTION = (typeof CRUD_ACTION)[keyof typeof CRUD_ACTION];

export const VIEW_MODE = {
  GRID: "grid",
  LIST: "list",
} as const;

export type VIEW_MODE = (typeof VIEW_MODE)[keyof typeof VIEW_MODE];

export type Tab = { label: string; value: string };

export interface TabActions<T> extends Tab {
  action: (data: T) => boolean;
}
