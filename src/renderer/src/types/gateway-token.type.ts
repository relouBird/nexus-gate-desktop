// types/gateway-token.type.ts
import type { GatewayToken } from "@/types/nexusgate.type";

// ─── Payloads ─────────────────────────────────────────────────

export interface CreateGatewayTokenPayload {
  name: string;
  scope?: string[];
}

export interface RemoveGatewayTokenPayload {
  id: string;
}

// ─── Responses ────────────────────────────────────────────────

export interface CreateGatewayTokenResponse {
  token?: GatewayToken;
  message?: string;
}

export interface GetGatewayTokensResponse {
  tokens?: GatewayToken[];
  total?: number;
  message?: string;
}

export interface RemoveGatewayTokenResponse {
  message?: string;
}