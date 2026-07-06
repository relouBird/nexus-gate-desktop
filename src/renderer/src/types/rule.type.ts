// types/rule.type.ts
import type { Rule } from "@/types/nexusgate.type";

// ─── Payloads ─────────────────────────────────────────────────

export interface CreateRulePayload {
  serverId: string;
  type: Rule["type"];
  condition: Record<string, unknown>;
  action: Rule["action"];
  priority?: number;
  isActive?: boolean;
}

export interface UpdateRulePayload {
  id: string;
  type?: Rule["type"];
  condition?: Record<string, unknown>;
  action?: Rule["action"];
  priority?: number;
  isActive?: boolean;
}

// ─── Responses ────────────────────────────────────────────────

export interface CreateRuleResponse {
  rule?: Rule;
  message?: string;
}

export interface GetRulesResponse {
  rules?: Rule[];
  total?: number;
  message?: string;
}

export interface GetRuleResponse {
  rule?: Rule;
  message?: string;
}

export interface UpdateRuleResponse {
  rule?: Rule;
  message?: string;
}

export interface DeleteRuleResponse {
  message?: string;
}

// Réponse pour la recherche globale
export interface GetAllRulesResponse {
  rules?: Rule[];
  total?: number;
  message?: string;
}
