// types/log.type.ts
// Calé sur RequestLog (Prisma) + GetLogsDto (NestJS)

import type { RequestLog } from "@/types/nexusgate.type";

// ─── Paramètres de filtre ─────────────────────────────────────
// Miroir du GetLogsDto côté frontend

export interface GetLogsParams {
  serverIds?: string[];
  method?:    string;
  via?:       "cloud" | "tunnel";
  statusCode?: number;
  from?:      string; // ISO date string
  to?:        string; // ISO date string
  page?:      number;
  limit?:     number;
}

// ─── Réponse API ──────────────────────────────────────────────

export interface GetLogsResponse {
  success:    boolean;
  data:       RequestLog[];
  pagination: {
    total:           number;
    page:            number;
    limit:           number;
    pages:           number;
    hasNextPage:     boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    serverIds:  string[] | null;
    method:     string | null;
    via:        "cloud" | "tunnel" | null;
    statusCode: number | null;
    from:       string | null;
    to:         string | null;
  };
}