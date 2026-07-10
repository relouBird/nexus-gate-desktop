// services/server.service.ts
import type { AxiosResponse } from 'axios'
import { request } from '@/helpers/request.helper'
import type {
  CreateServerResponse,
  GetServersResponse,
  GetServerResponse,
  UpdateServerResponse,
  DeleteServerResponse,
  TokenAuthServerResponse,
  RevokeServerResponse,
  GrantServerResponse,
  CreateServerPayload,
  UpdateServerPayload,
  TokenAuthServerPayload,
  RevokeServerPayload,
  GrantServerPayload,
  SetServerHeaderPayload,
  SetHeaderServerResponse,
  ToggleTunnelServerPayload,
  ToggleTunnelServerResponse
} from '@/types/server.type'

// ─── Interface du service ────────────────────────────────────
export interface ServerServiceProps {
  createServer: (payload: CreateServerPayload) => Promise<AxiosResponse<CreateServerResponse>>
  getManyServer: () => Promise<AxiosResponse<GetServersResponse>>
  getServer: (id: string) => Promise<AxiosResponse<GetServerResponse>>
  updateServer: (payload: UpdateServerPayload) => Promise<AxiosResponse<UpdateServerResponse>>
  deleteServer: (id: string) => Promise<AxiosResponse<DeleteServerResponse>>
  tokenAuthServer: (
    payload: TokenAuthServerPayload
  ) => Promise<AxiosResponse<TokenAuthServerResponse>>
  toggleTunnelServer: (
    payload: ToggleTunnelServerPayload
  ) => Promise<AxiosResponse<ToggleTunnelServerResponse>>
  setServerHeader: (
    payload: SetServerHeaderPayload
  ) => Promise<AxiosResponse<SetHeaderServerResponse>>
  revokeServer: (payload: RevokeServerPayload) => Promise<AxiosResponse<RevokeServerResponse>>
  grantServer: (payload: GrantServerPayload) => Promise<AxiosResponse<GrantServerResponse>>
}

// ─── Service ─────────────────────────────────────────────────
export default function serverService(): ServerServiceProps {
  /**
   * POST /configuration/servers
   * { name, url?, type? } → { server, message }
   */
  const createServer = async (
    payload: CreateServerPayload
  ): Promise<AxiosResponse<CreateServerResponse>> => {
    return await request('/configuration/servers', {
      method: 'post',
      data: payload
    })
  }

  /**
   * GET /configuration/servers
   * { } → { servers, total, message }
   */
  const getManyServer = async (): Promise<AxiosResponse<GetServersResponse>> => {
    return await request('/configuration/servers', {
      method: 'get'
    })
  }

  /**
   * GET /configuration/servers/:id
   * { } → { server, message }
   */
  const getServer = async (id: string): Promise<AxiosResponse<GetServerResponse>> => {
    return await request(`/configuration/servers/${id}`, {
      method: 'get'
    })
  }

  /**
   * PATCH /configuration/servers/:id
   * { name?, url?, type? } → { server, message }
   */
  const updateServer = async (
    payload: UpdateServerPayload
  ): Promise<AxiosResponse<UpdateServerResponse>> => {
    const { id, ...restPayload } = payload
    return await request(`/configuration/servers/${id}`, {
      method: 'patch',
      data: restPayload
    })
  }

  /**
   * DELETE /configuration/servers/:id
   * { } → { message }
   */
  const deleteServer = async (id: string): Promise<AxiosResponse<DeleteServerResponse>> => {
    return await request(`/configuration/servers/${id}`, {
      method: 'delete'
    })
  }

  /**
   * PATCH /configuration/servers/:id/token-auth
   * { requireToken } → { server, message }
   */
  const tokenAuthServer = async (
    payload: TokenAuthServerPayload
  ): Promise<AxiosResponse<TokenAuthServerResponse>> => {
    const { id, ...restPayload } = payload
    return await request(`/configuration/servers/${id}/token-auth`, {
      method: 'patch',
      data: restPayload
    })
  }

  /**
   * PATCH /configuration/servers/:id/token-auth
   * { requireToken } → { server, message }
   */
  const toggleTunnelServer = async (
    payload: ToggleTunnelServerPayload
  ): Promise<AxiosResponse<ToggleTunnelServerResponse>> => {
    const { id, ...restPayload } = payload
    return await request(`/configuration/servers/${id}/toggle-tunnel`, {
      method: 'patch',
      data: restPayload
    })
  }

  /**
   * PATCH /configuration/servers/:id/token-auth
   * { requireToken } → { server, message }
   */
  const setServerHeader = async (
    payload: SetServerHeaderPayload
  ): Promise<AxiosResponse<SetHeaderServerResponse>> => {
    const { id, ...restPayload } = payload
    return await request(`/configuration/servers/${id}/set-headers`, {
      method: 'patch',
      data: restPayload
    })
  }

  /**
   * POST /configuration/servers/:id/revoke
   * { } → { message }
   */
  const revokeServer = async (
    payload: RevokeServerPayload
  ): Promise<AxiosResponse<RevokeServerResponse>> => {
    const { id } = payload
    return await request(`/configuration/servers/${id}/revoke`, {
      method: 'post'
    })
  }

  /**
   * POST /configuration/servers/:id/grant
   * { userIds } → { server, message }
   */
  const grantServer = async (
    payload: GrantServerPayload
  ): Promise<AxiosResponse<GrantServerResponse>> => {
    const { id, ...restPayload } = payload
    return await request(`/configuration/servers/${id}/grant`, {
      method: 'post',
      data: restPayload
    })
  }

  return {
    createServer,
    getManyServer,
    getServer,
    updateServer,
    deleteServer,
    tokenAuthServer,
    toggleTunnelServer,
    setServerHeader,
    revokeServer,
    grantServer
  }
}
