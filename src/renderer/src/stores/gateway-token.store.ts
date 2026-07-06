// stores/gateway-token.store.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AxiosResponse } from 'axios'
import gatewayTokenService from '@/services/gateway-token.service'
import type {
  CreateGatewayTokenResponse,
  GetGatewayTokensResponse,
  RemoveGatewayTokenResponse,
  CreateGatewayTokenPayload,
  RemoveGatewayTokenPayload
} from '@/types/gateway-token.type'
import type { NotifyFn } from '@/helpers/notifications.helper'
import type { GatewayToken } from '@/types/nexusgate.type'

// ─── État ────────────────────────────────────────────────────

type GatewayTokenStoreState = {
  token: GatewayToken | null
  tokens: GatewayToken[]
  total: number
}

// ─── Actions ─────────────────────────────────────────────────

type GatewayTokenStoreActions = {
  createToken: (
    payload: CreateGatewayTokenPayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<CreateGatewayTokenResponse>>

  getManyToken: (notify?: NotifyFn) => Promise<AxiosResponse<GetGatewayTokensResponse>>

  removeToken: (
    payload: RemoveGatewayTokenPayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<RemoveGatewayTokenResponse>>

  reset: () => void
  setToken: (token: GatewayToken | null) => void
  setTokens: (tokens: GatewayToken[]) => void
  setTotal: (total: number) => void
}

// ─── État initial ─────────────────────────────────────────────

const INITIAL_STATE: GatewayTokenStoreState = {
  token: null,
  tokens: [],
  total: 0
}

// ─── Store ────────────────────────────────────────────────────

export const useGatewayTokenStore = create<GatewayTokenStoreState & GatewayTokenStoreActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      createToken: async (payload, notify) => {
        try {
          const service = gatewayTokenService()
          const response = await service.createToken(payload)

          if (response.status === 200 || response.status === 201) {
            const created = response.data.token ?? null
            if (created) set({ token: created, tokens: [...get().tokens, created] })
          }

          notify?.({
            message: response.data?.message ?? 'Token créé avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de créer le token.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      getManyToken: async (notify) => {
        try {
          const service = gatewayTokenService()
          const response = await service.getManyToken()

          if (response.status === 200 || response.status === 201) {
            const tokens = response.data?.tokens ?? []
            const total = response.data?.total ?? tokens.length

            set({
              tokens,
              total
            })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de récupérer les tokens.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      removeToken: async (payload, notify) => {
        try {
          const service = gatewayTokenService()
          const response = await service.removeToken(payload)

          set((state) => ({
            tokens: state.tokens.filter((t) => t.id !== payload.id),
            token: state.token && state.token.id === payload.id ? null : state.token,
            total: Math.max(0, state.total - 1)
          }))

          notify?.({
            message: 'Token révoqué avec succès.',
            color: 'success',
            visible: true
          })

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de révoquer le token.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      reset: () => set({ ...INITIAL_STATE }),
      setToken: (token) => set({ token }),
      setTokens: (tokens) => set({ tokens, total: tokens.length }),
      setTotal: (total) => set({ total })
    }),
    {
      name: 'gateway-token-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

// ─── Sélecteurs ───────────────────────────────────────────────

export const selectToken = (s: GatewayTokenStoreState): GatewayToken | null => s.token
export const selectTokens = (s: GatewayTokenStoreState): GatewayToken[] => s.tokens
export const selectTotalTokens = (s: GatewayTokenStoreState): number => s.total
