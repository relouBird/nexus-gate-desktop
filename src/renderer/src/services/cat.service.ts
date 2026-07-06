import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type { ServiceProps } from "@/types/common.type";
import type { CatType } from "@/types/cat.type";

export default function catService(): ServiceProps<CatType> {
  /**
   * Creer un chat
   */
  const create = async (payload: CatType): Promise<AxiosResponse<CatType>> => {
    return await request(`/cats`, {
      method: "post",
      data: payload,
    });
  };

  /**
   * Mettre à jour un chat
   */
  const update = async (
    id: string,
    payload: CatType,
  ): Promise<AxiosResponse> => {
    return await request(`/cats/${id}/`, {
      method: "put",
      data: payload,
    });
  };

  const remove = async (id: string): Promise<AxiosResponse> => {
    return await request(`/cats/${id}/`, {
      method: "delete",
    });
  };

  const fetchAll = async (): Promise<AxiosResponse> => {
    return await request(`/cats`, {
      method: "get",
    });
  };

  const fetch = async (id: string): Promise<AxiosResponse> => {
    return await request(`/cats/${id}/`, {
      method: "get",
    });
  };

  return {
    create,
    update,
    remove,
    fetchAll,
    fetch,
  };
}
