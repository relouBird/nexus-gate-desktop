// services/log.service.ts
import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type { GetLogsParams, GetLogsResponse } from "@/types/logs.type";

// ─── Interface du service ─────────────────────────────────────

export interface LogServiceProps {
  getLogs: (params?: GetLogsParams) => Promise<AxiosResponse<GetLogsResponse>>;
}

// ─── Service ─────────────────────────────────────────────────

export default function logService(): LogServiceProps {
  /**
   * GET /configuration/logs
   * Paramètres optionnels :
   *   serverIds[], method, via, statusCode, from, to, page, limit
   * → { success, data, pagination, filters }
   */
  const getLogs = async (
    params?: GetLogsParams,
  ): Promise<AxiosResponse<GetLogsResponse>> => {
    // Construit les query params — on omet les valeurs undefined/vides
    const searchParams = new URLSearchParams();

    if (params?.serverIds?.length) {
      // ✅ Utilise .append() pour ajouter plusieurs fois
      params.serverIds.forEach((id) => {
        searchParams.append("serverIds", id);
      });
    }
    if (params?.method) searchParams.set("method", params.method);
    if (params?.via) searchParams.set("via", params.via);
    if (params?.statusCode)
      searchParams.set("statusCode", String(params.statusCode));
    if (params?.from) searchParams.set("from", params.from);
    if (params?.to) searchParams.set("to", params.to);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));

    return await request("/configuration/logs", {
      method: "get",
      params: searchParams,
    });
  };

  return { getLogs };
}
