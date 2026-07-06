// stores/auth.store.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AxiosResponse } from 'axios'
import meService from '@/services/me.service'
import type {
  ChangePasswordPayload,
  ChangeUsernamePayload,
  MeResponse,
  ChangePasswordResponse,
  ChangeUsernameResponse,
  DeleteAccountResponse
} from '@/types/me.type'
import type { NotifyFn } from '@/helpers/notifications.helper'
import type { NavigateFunction } from 'react-router'
import type { TeamModel, UserModel, UserRole } from '@/types/nexusgate.type'

// ─── État ────────────────────────────────────────────────────

type MeStoreState = {
  user: UserModel | null
  team: TeamModel | null
}

// ─── Actions ─────────────────────────────────────────────────

type MeStoreActions = {
  getMe: (notify?: NotifyFn) => Promise<AxiosResponse<MeResponse>>
  changeUsername: (
    payload: ChangeUsernamePayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<ChangeUsernameResponse>>
  changePassword: (
    payload: ChangePasswordPayload,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<ChangePasswordResponse>>
  deleteAccount: (
    notify?: NotifyFn,
    navigate?: NavigateFunction
  ) => Promise<AxiosResponse<DeleteAccountResponse>>

  reset: () => void

  setUser: (user: UserModel | null) => void
  setTeam: (team: TeamModel | null) => void
}

// ─── État initial ─────────────────────────────────────────────

const INITIAL_STATE: MeStoreState = {
  user: null,
  team: null
}

// ─── Store ────────────────────────────────────────────────────

export const useMeStore = create<MeStoreState & MeStoreActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // ── Register ─────────────────────────────────────────────
      getMe: async (notify) => {
        try {
          const service = meService()
          const response = await service.getMe()

          if (response.status === 200 || response.status === 201) {
            const { user, team } = response.data
            set({
              user,
              team
            })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de récuperer vos informations.',
            color: 'error',
            visible: true
          })
          console.error('Register failed:', response)
          throw error
        }
      },
      // ── Change Password  ──────────────────
      changePassword: async (payload, notify) => {
        try {
          const service = meService()
          const response = await service.changePassword(payload)

          if (response.status === 200 || response.status === 201) {
            const { user, team } = response.data
            set({
              user,
              team
            })
          }
          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? 'Impossible de changer votre mot de passe.',
            color: 'error',
            visible: true
          })
          console.error('Change password failed:', error)
          throw error
        }
      },

      // ── Change Username  ──────────────────
      changeUsername: async (payload, notify) => {
        try {
          const service = meService()
          const response = await service.changeUsername(payload)

          if (response.status === 200 || response.status === 201) {
            const { user, team } = response.data
            set({
              user,
              team
            })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? "Impossible de changer votre nom d'utilisateur.",
            color: 'error',
            visible: true
          })
          console.error('Change password failed:', error)
          throw error
        }
      },

      // ── Delete Account  ──────────────────
      deleteAccount: async (notify, navigate) => {
        try {
          const service = meService()
          const response = await service.deleteAccount()
          // Supprimer des informations utilisateurs
          console.log('SUPPRIMER DATA OF ====>', get().user?.email)
          // Mot de passe changé → on déconnecte pour forcer une reconnexion propre
          set({ ...INITIAL_STATE })

          notify?.({
            message: 'Compte supprimé avec success.',
            color: 'success',
            visible: true
          })

          if (navigate) {
            navigate('/auth/login')
          }

          return response
        } catch (error) {
          console.error('Change password failed:', error)

          notify?.({
            message: 'Impossible de Supprimer votre compte.',
            color: 'error',
            visible: true
          })
          throw error
        }
      },

      // ── Helpers Interne ──────────────────────────────────────
      reset: () => set({ ...INITIAL_STATE }),

      // ── Helpers ───────────────────────────────────────────────
      setUser: (user) => set({ user }),
      setTeam: (team) => set({ team })
    }),
    {
      name: 'me-storage',
      storage: createJSONStorage(() => sessionStorage) // Uses sessionStorage instead
    }
  )
)

// ─── Sélecteurs utilitaires (évite les re-renders inutiles) ──
export const selectUser = (s: MeStoreState): UserModel | null => s.user
export const selectTeam = (s: MeStoreState): TeamModel | null => s.team
export const selectRole = (s: MeStoreState): UserRole | null => s.user?.role ?? null
