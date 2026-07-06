// types/server.type.ts
import type { Server, ServerType } from "@/types/nexusgate.type";

// ─── Payloads ─────────────────────────────────────────────────

export interface CreateServerPayload {
  name: string;
  url?: string;
  type?: ServerType;
}

export interface UpdateServerPayload {
  id: string;
  name?: string;
  url?: string;
  type?: ServerType;
}

export interface TokenAuthServerPayload {
  id: string;
  requireToken: boolean;
}

export interface SetServerHeaderPayload {
  id: string;
  headers: Record<string, string>;
}

export interface RevokeServerPayload {
  id: string;
}

export interface GrantServerPayload {
  id: string;
  userIds: string[];
}

// ─── Responses ────────────────────────────────────────────────

export interface CreateServerResponse {
  server?: Server;
  message?: string;
}

export interface GetServersResponse {
  servers?: Server[];
  total?: number;
  message?: string;
}

export interface GetServerResponse {
  server?: Server;
  users: {
    id: string;
    username: string;
  }[];
  message?: string;
}

export interface UpdateServerResponse {
  server?: Server;
  message?: string;
}

export interface DeleteServerResponse {
  message?: string;
}

export interface TokenAuthServerResponse {
  server?: Server;
  message?: string;
}

export interface SetHeaderServerResponse {
  server?: Server;
  message?: string;
}

export interface RevokeServerResponse {
  server?: Server;
  users: [];
  message?: string;
}

export interface GrantServerResponse {
  server?: Server;
  users: {
    id: string;
    username: string;
  }[];
  message?: string;
}
