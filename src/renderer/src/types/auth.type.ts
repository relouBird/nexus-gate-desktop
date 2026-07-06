// types/auth.type.ts

import type { UserModel, TeamModel, UserStatus } from "./nexusgate.type";

// ─── Payloads (requêtes) ──────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  teamName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateTeamPayload {
  teamName: string;
  slug: string;
}

export interface SendOtpPayload {
  email: string;
  action: "login" | "reset";
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface ChangePasswordPayload {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

// ─── Réponses (API) ───────────────────────────────────────────

export interface RegisterResponse {
  user: UserModel;
  team: TeamModel;
  status: UserStatus;
  accessToken: string;
  refreshToken: string;
}

export interface UpdateTeamResponse {
  team: TeamModel;
  success: boolean;
}

export type LoginResponse = RegisterResponse;

export interface OtpResponse {
  message: string;
}

export interface SendOtpResponse {
  sent: string;
}
