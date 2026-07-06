// services/rule.service.ts
import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type {
  CreateRuleResponse,
  GetRulesResponse,
  GetRuleResponse,
  UpdateRuleResponse,
  DeleteRuleResponse,
  GetAllRulesResponse,
  CreateRulePayload,
  UpdateRulePayload,
} from "@/types/rule.type";

// ─── Interface du service ────────────────────────────────────
export interface RuleServiceProps {
  createRule: (
    payload: CreateRulePayload,
  ) => Promise<AxiosResponse<CreateRuleResponse>>;
  getManyRule: (
    serverId: string,
  ) => Promise<AxiosResponse<GetRulesResponse>>;
  getAllRules: () => Promise<AxiosResponse<GetAllRulesResponse>>;
  getRule: (id: string) => Promise<AxiosResponse<GetRuleResponse>>;
  updateRule: (
    payload: UpdateRulePayload,
  ) => Promise<AxiosResponse<UpdateRuleResponse>>;
  deleteRule: (id: string) => Promise<AxiosResponse<DeleteRuleResponse>>;
}

// ─── Service ─────────────────────────────────────────────────
export default function ruleService(): RuleServiceProps {
  /**
   * POST /configuration/servers/:serverId/rules
   * { type, condition, action, priority?, isActive? } → { rule, message }
   */
  const createRule = async (
    payload: CreateRulePayload,
  ): Promise<AxiosResponse<CreateRuleResponse>> => {
    const { serverId, ...restPayload } = payload;
    return await request(`/configuration/servers/${serverId}/rules`, {
      method: "post",
      data: restPayload,
    });
  };

  /**
   * GET /configuration/servers/:serverId/rules
   * { } → { rules, total, message }
   */
  const getManyRule = async (
    serverId: string,
  ): Promise<AxiosResponse<GetRulesResponse>> => {
    return await request(`/configuration/servers/${serverId}/rules`, {
      method: "get",
    });
  };

  /**
   * GET /configuration/rules
   * { } → { rules, total, message }
   * Route globale pour récupérer toutes les règles
   */
  const getAllRules = async (): Promise<AxiosResponse<GetAllRulesResponse>> => {
    return await request("/configuration/rules", {
      method: "get",
    });
  };

  /**
   * GET /configuration/rules/:id
   * { } → { rule, message }
   */
  const getRule = async (
    id: string,
  ): Promise<AxiosResponse<GetRuleResponse>> => {
    return await request(`/configuration/rules/${id}`, {
      method: "get",
    });
  };

  /**
   * PATCH /configuration/rules/:id
   * { type?, condition?, action?, priority?, isActive? } → { rule, message }
   */
  const updateRule = async (
    payload: UpdateRulePayload,
  ): Promise<AxiosResponse<UpdateRuleResponse>> => {
    const { id, ...restPayload } = payload;
    return await request(`/configuration/rules/${id}`, {
      method: "patch",
      data: restPayload,
    });
  };

  /**
   * DELETE /configuration/rules/:id
   * { } → { message }
   */
  const deleteRule = async (
    id: string,
  ): Promise<AxiosResponse<DeleteRuleResponse>> => {
    return await request(`/configuration/rules/${id}`, {
      method: "delete",
    });
  };

  return {
    createRule,
    getManyRule,
    getAllRules,
    getRule,
    updateRule,
    deleteRule,
  };
}