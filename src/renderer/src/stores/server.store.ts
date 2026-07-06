// stores/server.store.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AxiosResponse } from 'axios'
import serverService from '@/services/server.service'
import type {
  GetServerResponse,
  GetServersResponse,
  CreateServerResponse,
  CreateServerPayload,
  UpdateServerPayload,
  UpdateServerResponse,
  DeleteServerResponse,
  TokenAuthServerResponse,
  TokenAuthServerPayload,
  RevokeServerResponse,
  RevokeServerPayload,
  GrantServerResponse,
  GrantServerPayload,
  SetServerHeaderPayload
} from '@/types/server.type'
import type { NotifyFn } from '@/helpers/notifications.helper'
import type { Server } from '@/types/nexusgate.type'

// ─── État ────────────────────────────────────────────────────

type ServerStoreState = {
  server: Server | null
  servers: Server[]
  total: number
}

// ─── Actions ─────────────────────────────────────────────────

type ServerStoreActions = {
  createServer: (
    payload: CreateServerPayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<CreateServerResponse>>

  getServer: (id: string, notify?: NotifyFn) => Promise<AxiosResponse<GetServerResponse>>

  getManyServer: (notify?: NotifyFn) => Promise<AxiosResponse<GetServersResponse>>

  updateServer: (
    payload: UpdateServerPayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<UpdateServerResponse>>

  deleteServer: (id: string, notify?: NotifyFn) => Promise<AxiosResponse<DeleteServerResponse>>

  tokenAuthServer: (
    payload: TokenAuthServerPayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<TokenAuthServerResponse>>

  setServerHeader: (
    payload: SetServerHeaderPayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<TokenAuthServerResponse>>

  revokeServer: (
    payload: RevokeServerPayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<RevokeServerResponse>>

  grantServer: (
    payload: GrantServerPayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<GrantServerResponse>>

  reset: () => void
  setServer: (server: Server | null) => void
  setServers: (servers: Server[]) => void
  setTotal: (total: number) => void
}

// ─── État initial ─────────────────────────────────────────────

const INITIAL_STATE: ServerStoreState = {
  server: null,
  servers: [],
  total: 0
}

// ─── Store ────────────────────────────────────────────────────

export const useServerStore = create<ServerStoreState & ServerStoreActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      createServer: async (payload, notify) => {
        try {
          const service = serverService()
          const response = await service.createServer(payload)

          if (response.status === 200 || response.status === 201) {
            const created = response.data.server ?? null
            if (created) set({ server: created, servers: [...get().servers, created] })
          }

          notify?.({
            message: response.data?.message ?? 'Serveur créé avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de créer le serveur.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      getServer: async (id, notify) => {
        try {
          const service = serverService()
          const response = await service.getServer(id)

          if (response.status === 200 || response.status === 201) {
            const server = response.data?.server ?? null
            set({ server })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de récupérer le serveur.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      getManyServer: async (notify) => {
        try {
          const service = serverService()
          const response = await service.getManyServer()

          if (response.status === 200 || response.status === 201) {
            const servers = response.data?.servers ?? []
            const total = response.data?.total ?? servers.length

            set({
              servers,
              total
            })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de récupérer les serveurs.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      updateServer: async (payload, notify) => {
        try {
          const service = serverService()
          const response = await service.updateServer(payload)

          if (response.status === 200 || response.status === 201) {
            const updated = response.data?.server ?? null
            if (updated)
              set({
                server: updated,
                servers: get().servers.map((x) => (x.id === updated.id ? updated : x))
              })
          }

          notify?.({
            message: response.data?.message ?? 'Serveur modifié avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de modifier le serveur.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      deleteServer: async (id, notify) => {
        try {
          const service = serverService()
          const response = await service.deleteServer(id)

          set((state) => ({
            servers: state.servers.filter((s) => s.id !== id),
            server: state.server && state.server.id === id ? null : state.server,
            total: Math.max(0, state.total - 1)
          }))

          notify?.({
            message: 'Serveur supprimé avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de supprimer le serveur.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      tokenAuthServer: async (payload, notify) => {
        try {
          const service = serverService()
          const response = await service.tokenAuthServer(payload)

          if (response.status === 200 || response.status === 201) {
            const updated = response.data?.server ?? null
            if (updated)
              set({
                server: updated,
                servers: get().servers.map((x) => (x.id === updated.id ? updated : x))
              })
          }

          notify?.({
            message:
              response.data?.message ?? 'Authentification par token mise à jour avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message:
              response.data?.message ?? "Impossible de mettre à jour l'authentification par token.",
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      setServerHeader: async (payload, notify) => {
        try {
          const service = serverService()
          const response = await service.setServerHeader(payload)

          if (response.status === 200 || response.status === 201) {
            const updated = response.data?.server ?? null
            if (updated)
              set({
                server: updated,
                servers: get().servers.map((x) => (x.id === updated.id ? updated : x))
              })
          }

          notify?.({
            message:
              response.data?.message ?? 'Authentification par token mise à jour avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message:
              response.data?.message ?? "Impossible de mettre à jour l'authentification par token.",
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      revokeServer: async (payload, notify) => {
        try {
          const service = serverService()
          const response = await service.revokeServer(payload)

          notify?.({
            message: 'Accès révoqué avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? "Impossible de révoquer l'accès.",
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      grantServer: async (payload, notify) => {
        try {
          const service = serverService()
          const response = await service.grantServer(payload)

          if (response.status === 200 || response.status === 201) {
            const updated = response.data?.server ?? null
            if (updated)
              set({
                server: updated,
                servers: get().servers.map((x) => (x.id === updated.id ? updated : x))
              })
          }

          notify?.({
            message: response.data?.message ?? 'Accès accordé avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? "Impossible d'accorder l'accès.",
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      reset: () => set({ ...INITIAL_STATE }),
      setServer: (server) => set({ server }),
      setServers: (servers) => set({ servers, total: servers.length }),
      setTotal: (total) => set({ total })
    }),
    {
      name: 'server-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

// ─── Sélecteurs ───────────────────────────────────────────────

export const selectServer = (s: ServerStoreState): Server | null => s.server
export const selectServers = (s: ServerStoreState): Server[] => s.servers
export const selectTotalServers = (s: ServerStoreState): number => s.total
