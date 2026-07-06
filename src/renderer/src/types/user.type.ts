import type { AccessPolicy, TeamModel, UserModel } from "./nexusgate.type";

export type UserCreateRole = "ADMIN" | "CLIENT";

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  role: UserCreateRole;
  accessPolicy: AccessPolicy;
}

export interface UpdateUserPayload {
  id: string;
  username?: string;
  email: string;
  password?: string;
  role: UserCreateRole;
  accessPolicy: AccessPolicy;
}

// ─── Réponses (API) ───────────────────────────────────────────

// Ajouter un message pour plus de clarté
export interface CreateUserResponse {
  user: UserModel;
  message: string;
}

// UN seul user
export interface GetUserResponse {
  user: UserModel;
  team: TeamModel;
  success: boolean;
}

// Ajouter le total pour GetUsers (paginé)
export interface GetUsersResponse {
  users: UserModel[];
  team: TeamModel;
  total: number;
  page: number;
  limit: number;
  success: boolean;
}

// Modification
export interface UpdateUserResponse {
  user: UserModel;
  message?: string;
}

// Ajouter la date pour Delete/Update
export interface DeleteUserResponse {
  user: UserModel;
  success: boolean;
  deletedAt: string;
}
