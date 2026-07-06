// services/auth.service.ts
import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type {
  GetUserResponse,
  GetUsersResponse,
  CreateUserResponse,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserResponse,
  DeleteUserResponse,
} from "@/types/user.type";

// ─── Interface du service ────────────────────────────────────

export interface UserServiceProps {
  createUser: (
    payload: CreateUserPayload,
  ) => Promise<AxiosResponse<CreateUserResponse>>;
  getUser: (id: string) => Promise<AxiosResponse<GetUserResponse>>;
  getManyUser: () => Promise<AxiosResponse<GetUsersResponse>>;
  updateUser: (
    payload: UpdateUserPayload,
  ) => Promise<AxiosResponse<UpdateUserResponse>>;
  deleteUser: (id: string) => Promise<AxiosResponse<DeleteUserResponse>>;
}

// ─── Service ─────────────────────────────────────────────────

export default function userService(): UserServiceProps {
  /**
   * POST /users
   * { username, email, password, role } → { users, message }
   */
  const createUser = async (
    payload: CreateUserPayload,
  ): Promise<AxiosResponse<CreateUserResponse>> => {
    return await request("/users", {
      method: "post",
      data: payload,
    });
  };

  /**
   * GET /users/:id
   * { } → { user, message }
   */
  const getUser = async (
    id: string,
  ): Promise<AxiosResponse<GetUserResponse>> => {
    return await request(`/users/${id}`, {
      method: "get",
    });
  };

  /**
   * GET /users
   * { } → { users, team, total, success }
   */
  const getManyUser = async (): Promise<AxiosResponse<GetUsersResponse>> => {
    return await request("/users", {
      method: "get",
    });
  };

  /**
   * UPDATE /users/:id
   * { username, email, password, role } → { users, team, success }
   */
  const updateUser = async (
    payload: UpdateUserPayload,
  ): Promise<AxiosResponse<UpdateUserResponse>> => {
    const { id, ...restpayload } = payload;

    return await request(`/users/${id}`, {
      method: "patch",
      data: restpayload,
    });
  };

  /**
   * UPDATE /users/:id
   * {  } → { users, team, success }
   */
  const deleteUser = async (
    id: string,
  ): Promise<AxiosResponse<DeleteUserResponse>> => {
    return await request(`/users/${id}`, {
      method: "delete",
    });
  };

  return {
    createUser,
    getUser,
    getManyUser,
    updateUser,
    deleteUser,
  };
}
