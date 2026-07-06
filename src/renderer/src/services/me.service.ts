// services/auth.service.ts
import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type {
  ChangePasswordPayload,
  ChangeUsernamePayload,
  MeResponse,
  ChangePasswordResponse,
  ChangeUsernameResponse,
  DeleteAccountResponse,
} from "@/types/me.type";

// ─── Interface du service ────────────────────────────────────

export interface MeServiceProps {
  getMe: () => Promise<AxiosResponse<MeResponse>>;
  changeUsername: (
    payload: ChangeUsernamePayload,
  ) => Promise<AxiosResponse<ChangeUsernameResponse>>;
  changePassword: (
    payload: ChangePasswordPayload,
  ) => Promise<AxiosResponse<ChangePasswordResponse>>;
  deleteAccount: () => Promise<AxiosResponse<DeleteAccountResponse>>;
}

// ─── Service ─────────────────────────────────────────────────

export default function meService(): MeServiceProps {
  /**
   * GET /me/
   * { } → { user, team }
   */
  const getMe = async (): Promise<AxiosResponse<MeResponse>> => {
    return await request("/me", {
      method: "get",
    });
  };

  /**
   * POST /me/change-password
   * { password, newPassword, confirmNewPassword  } -> { user , team }
   * Change le mot de passe.
   */
  const changePassword = async (
    payload: ChangePasswordPayload,
  ): Promise<AxiosResponse<ChangePasswordResponse>> => {
    return await request("/me/change-password", {
      method: "post",
      data: payload,
    });
  };

  /**
   * POST /me/change-username
   * { username  } -> { user , team }
   * Change le nom d'utilisateur.
   */
  const changeUsername = async (
    payload: ChangeUsernamePayload,
  ): Promise<AxiosResponse<ChangeUsernameResponse>> => {
    return await request("/me/change-username", {
      method: "post",
      data: payload,
    });
  };

  /**
   * DELETE /me/delete-account
   * {   } -> { user , success }
   * Supprime le compte utilisateur
   */
  const deleteAccount = async (): Promise<
    AxiosResponse<DeleteAccountResponse>
  > => {
    return await request("/me/delete-account", {
      method: "delete",
      data: {},
    });
  };

  return {
    getMe,
    changeUsername,
    changePassword,
    deleteAccount,
  };
}
