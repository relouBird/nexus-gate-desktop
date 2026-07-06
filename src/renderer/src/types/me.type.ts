// types/auth.type.ts

import type { UserModel, TeamModel } from "./nexusgate.type";

// ─── Payloads (requêtes) ──────────────────────────────────────

export interface ChangePasswordPayload {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangeUsernamePayload {
  username: string;
}

// ─── Réponses (API) ───────────────────────────────────────────

export interface MeResponse {
  user: UserModel;
  team: TeamModel;
}

export type ChangeUsernameResponse = MeResponse;
export type ChangePasswordResponse = MeResponse;

export interface DeleteAccountResponse {
  user: UserModel;
  success: boolean;
}
