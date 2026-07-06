// stores/auth.store.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AxiosResponse } from 'axios'
import authService from '@/services/auth.service'
import type {
  LoginPayload,
  RegisterPayload,
  SendOtpPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
  LoginResponse,
  RegisterResponse,
  UpdateTeamResponse,
  UpdateTeamPayload
} from '@/types/auth.type'
import type { NotifyFn } from '@/helpers/notifications.helper'
import type { NavigateFunction } from 'react-router'
import type { UserModel, UserStatus } from '@/types/nexusgate.type'

// ─── État ────────────────────────────────────────────────────

type AuthStoreState = {
  user: UserModel | null
  accessToken: string | null
  status: UserStatus
  pendingEmail: string | null
}

// ─── Actions ─────────────────────────────────────────────────

type AuthStoreActions = {
  /** POST /api/team/register — crée l'équipe + compte CREATOR */
  register: (payload: RegisterPayload) => Promise<AxiosResponse<RegisterResponse>>
  updateTeam: (
    payload: UpdateTeamPayload,
    navigate?: NavigateFunction,
    notify?: NotifyFn
  ) => Promise<AxiosResponse<UpdateTeamResponse>>
  login: (
    payload: LoginPayload,
    notify?: NotifyFn,
    navigate?: NavigateFunction
  ) => Promise<AxiosResponse>
  sendOtp: (payload: SendOtpPayload) => Promise<AxiosResponse>
  verifyOtp: (payload: VerifyOtpPayload) => Promise<AxiosResponse>
  resetPassword: (payload: ResetPasswordPayload) => Promise<AxiosResponse>
  changePassword: (payload: ChangePasswordPayload) => Promise<AxiosResponse>
  logout: (notify?: NotifyFn, navigate?: NavigateFunction) => Promise<AxiosResponse>
  setUser: (user: UserModel | null) => void
  setAccessToken: (token: string | null) => void
  setPendingEmail: (email: string | null) => void
  reset: () => void
}

// ─── État initial ─────────────────────────────────────────────

const INITIAL_STATE: AuthStoreState = {
  user: null,
  accessToken: null,
  status: 'unauthenticated',
  pendingEmail: null
}

// ─── Store ────────────────────────────────────────────────────

export const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // ── Register ─────────────────────────────────────────────
      register: async (payload: RegisterPayload) => {
        try {
          const service = authService()
          const response: AxiosResponse<RegisterResponse> = await service.register(payload)

          if (response.status === 200 || response.status === 201) {
            const { accessToken, user, status } = response.data
            set({
              user,
              accessToken,
              status,
              pendingEmail: user.email
            })
          }

          return response
        } catch (error) {
          const response = error as AxiosResponse
          console.error('Register failed:', response)
          throw error
        }
      },

      // ── Login ─────────────────────────────────────────────────
      login: async (payload, notify, navigate) => {
        try {
          const service = authService()
          const response: AxiosResponse<LoginResponse> = await service.login(payload)

          if (response.status === 200 || response.status === 201) {
            const { accessToken, user, status } = response.data

            // Si le backend retourne directement un token → authentifié
            if (accessToken) {
              set({
                user,
                accessToken,
                status,
                pendingEmail: null
              })
            } else {
              // Pas de token → OTP requis (le backend a envoyé l'OTP)
              set({
                status: 'unauthenticated',
                pendingEmail: payload.email
              })
            }
            notify?.({
              message: 'Connexion réussie....',
              color: 'success',
              visible: true
            })
          }
          return response
        } catch (error) {
          const response = error as AxiosResponse

          if (response.status == 403 && navigate) {
            navigate('/auth/verification')
          }
          // Pas de token → OTP requis (le backend a envoyé l'OTP)
          set({
            status: 'unauthenticated',
            pendingEmail: payload.email
          })
          console.error('Login failed:', error)
          throw error
        }
      },

      // ── Send OTP ──────────────────────────────────────────────
      sendOtp: async (payload: SendOtpPayload) => {
        try {
          const service = authService()
          const response = await service.sendOtp(payload)
          // Garde l'email en store pour l'étape verify
          set({ pendingEmail: payload.email, status: 'unauthenticated' })

          return response
        } catch (error) {
          console.error('Send OTP failed:', error)
          throw error
        }
      },

      // ── Verify OTP ────────────────────────────────────────────
      verifyOtp: async (payload: VerifyOtpPayload) => {
        try {
          const service = authService()
          const response = await service.verifyOtp(payload)
          // OTP vérifié — on considère l'utilisateur authentifié.
          // Note : si le backend retourne un token ici, ajuste cette action.
          set({ status: 'authenticated', pendingEmail: null })

          return response
        } catch (error) {
          console.error('Verify OTP failed:', error)
          throw error
        }
      },

      // ── Reset Password (demande OTP) ──────────────────────────
      resetPassword: async (payload: ResetPasswordPayload) => {
        try {
          const service = authService()
          const response = await service.resetPassword(payload)
          set({ pendingEmail: payload.email })

          return response
        } catch (error) {
          console.error('Reset password failed:', error)
          throw error
        }
      },

      // ── Change Password (OTP + nouveau mdp) ──────────────────
      changePassword: async (payload: ChangePasswordPayload) => {
        try {
          const service = authService()
          const response = await service.changePassword(payload)
          // Mot de passe changé → on déconnecte pour forcer une reconnexion propre
          set({ ...INITIAL_STATE })

          return response
        } catch (error) {
          console.error('Change password failed:', error)
          throw error
        }
      },

      // ── Logout ────────────────────────────────────────────────
      logout: async (notify, navigate) => {
        try {
          let response: AxiosResponse = {} as AxiosResponse
          // On appelle l'API seulement si on a un token actif
          if (get().accessToken) {
            const service = authService()
            response = await service.logout()
          }
          notify?.({
            message: 'Déconnexion reussis',
            color: 'success',
            visible: true
          })
          return response
        } catch (error) {
          // On reset le store même si l'appel échoue (token expiré, réseau, etc.)
          console.error('Logout API call failed:', error)
          notify?.({
            message: 'Oups, votre déconnexion a eu un soucis.',
            color: 'error',
            visible: true
          })
          throw error
        } finally {
          set({ ...INITIAL_STATE, pendingEmail: get().user?.email })
          if (navigate) {
            navigate('/auth/login')
          }
        }
      },

      // ── Update Team ───────────────────────────────────────────
      async updateTeam(payload, navigate, notify) {
        try {
          const service = authService()
          const response = await service.updateTeam(payload)
          return response
        } catch (error) {
          const response = error as AxiosResponse
          notify?.({
            message: response.data?.message ?? "Impossible de mettre à jour l'equipe.",
            color: 'error',
            visible: true
          })
          if (response.status == 401) {
            if (navigate) {
              navigate('/auth/login')
            }
          }
          console.error('Change password failed:', error)
          throw error
        }
      },

      // ── Helpers ───────────────────────────────────────────────
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setPendingEmail: (email) => set({ pendingEmail: email }),
      reset: () => set({ ...INITIAL_STATE })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage) // Uses sessionStorage instead
    }
  )
)

// ─── Sélecteurs utilitaires (évite les re-renders inutiles) ──

export const selectUser = (s: AuthStoreState): UserModel | null => s.user
export const selectAccessToken = (s: AuthStoreState): string | null => s.accessToken
export const selectAuthStatus = (s: AuthStoreState): UserStatus => s.status
export const selectPendingEmail = (s: AuthStoreState): string | null => s.pendingEmail
export const selectIsAuth = (s: AuthStoreState): boolean => s.status === 'authenticated'
export const selectRole = (s: AuthStoreState): string | null => s.user?.role ?? null
