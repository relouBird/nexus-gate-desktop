import type { AxiosResponse } from "axios";

export interface ResponsePagination<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type ServiceProps<T = unknown> = {
  fetchAll?: (query: Record<string, unknown>) => Promise<AxiosResponse<ResponsePagination<T>>>;
  fetch?: (id :string,query: Record<string, unknown>) => Promise<AxiosResponse<T>>;
  find?: (model: Record<string, unknown>, query: Record<string, unknown>) => Promise<AxiosResponse<T>>;
  
  create?: (payload: T) => Promise<AxiosResponse<T>>;
  update?: (id:string, payload: T) => Promise<AxiosResponse<T>>;
  remove?: (id: string, query: Record<string, unknown>) => Promise<AxiosResponse<T>>;

  [key: string]: unknown;
};