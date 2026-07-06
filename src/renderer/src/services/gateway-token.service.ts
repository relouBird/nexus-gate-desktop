// services/gateway-token.service.ts
import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type {
  CreateGatewayTokenResponse,
  GetGatewayTokensResponse,
  RemoveGatewayTokenResponse,
  CreateGatewayTokenPayload,
  RemoveGatewayTokenPayload,
} from "@/types/gateway-token.type";

// ─── Interface du service ────────────────────────────────────
export interface GatewayTokenServiceProps {
  createToken: (
    payload: CreateGatewayTokenPayload,
  ) => Promise<AxiosResponse<CreateGatewayTokenResponse>>;
  getManyToken: () => Promise<AxiosResponse<GetGatewayTokensResponse>>;
  removeToken: (
    payload: RemoveGatewayTokenPayload,
  ) => Promise<AxiosResponse<RemoveGatewayTokenResponse>>;
}

// ─── Service ─────────────────────────────────────────────────
export default function gatewayTokenService(): GatewayTokenServiceProps {
  /**
   * POST /gateway-tokens
   * { name, scope? } → { token, message }
   */
  const createToken = async (
    payload: CreateGatewayTokenPayload,
  ): Promise<AxiosResponse<CreateGatewayTokenResponse>> => {
    return await request("/configuration/gateway-tokens", {
      method: "post",
      data: payload,
    });
  };

  /**
   * GET /gateway-tokens
   * { } → { tokens, total, message }
   */
  const getManyToken = async (): Promise<
    AxiosResponse<GetGatewayTokensResponse>
  > => {
    return await request("/configuration/gateway-tokens", {
      method: "get",
    });
  };

  /**
   * DELETE /gateway-tokens/:id
   * { } → { message }
   */
  const removeToken = async (
    payload: RemoveGatewayTokenPayload,
  ): Promise<AxiosResponse<RemoveGatewayTokenResponse>> => {
    const { id } = payload;
    return await request(`/configuration/gateway-tokens/${id}`, {
      method: "delete",
    });
  };

  return {
    createToken,
    getManyToken,
    removeToken,
  };
}
