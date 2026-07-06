// services/auth.service.ts
import type { AxiosResponse } from 'axios'
import { request } from '@/helpers/request.helper'
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  SendOtpPayload,
  OtpResponse,
  VerifyOtpPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
  UpdateTeamPayload,
  UpdateTeamResponse
} from '@/types/auth.type'

// ─── Interface du service ────────────────────────────────────

export interface AuthServiceProps {
  login: (payload: LoginPayload) => Promise<AxiosResponse<LoginResponse>>
  register: (payload: RegisterPayload) => Promise<AxiosResponse<RegisterResponse>>
  updateTeam: (payload: UpdateTeamPayload) => Promise<AxiosResponse<UpdateTeamResponse>>
  sendOtp: (payload: SendOtpPayload) => Promise<AxiosResponse<OtpResponse>>
  verifyOtp: (payload: VerifyOtpPayload) => Promise<AxiosResponse<OtpResponse>>
  resetPassword: (payload: ResetPasswordPayload) => Promise<AxiosResponse<OtpResponse>>
  changePassword: (payload: ChangePasswordPayload) => Promise<AxiosResponse<OtpResponse>>
  logout: () => Promise<AxiosResponse>
}

// ─── Service ─────────────────────────────────────────────────

export default function authService(): AuthServiceProps {
  /**
   * POST /api/auth/login
   * { email, password } → { accessToken, user }
   */
  const login = async (payload: LoginPayload): Promise<AxiosResponse<LoginResponse>> => {
    return await request('/auth/login', {
      method: 'post',
      data: payload
    })
  }

  /**
   * POST /api/team/register
   * { teamName, username, email, password, confirmPassword }
   * → { accessToken, user, team }
   * Crée l'équipe + le compte CREATOR en une seule requête.
   */
  const register = async (payload: RegisterPayload): Promise<AxiosResponse<RegisterResponse>> => {
    return await request('/team/register', {
      method: 'post',
      data: payload
    })
  }

  /**
   * POST /api/auth/send-otp
   * { email, action: 'login' | 'reset' }
   * Envoie un OTP par email selon l'action demandée.
   */
  const sendOtp = async (payload: SendOtpPayload): Promise<AxiosResponse<OtpResponse>> => {
    return await request('/auth/send-otp', {
      method: 'post',
      data: payload
    })
  }

  /**
   * POST /api/auth/verify-otp
   * { email, code }
   * Vérifie le code OTP reçu par email (flow login).
   */
  const verifyOtp = async (payload: VerifyOtpPayload): Promise<AxiosResponse<OtpResponse>> => {
    return await request('/auth/verify-otp', {
      method: 'post',
      data: payload
    })
  }

  /**
   * POST /api/auth/reset-password
   * { email }
   * Déclenche l'envoi d'un OTP pour réinitialiser le mot de passe.
   */
  const resetPassword = async (
    payload: ResetPasswordPayload
  ): Promise<AxiosResponse<OtpResponse>> => {
    return await request('/auth/reset-password', {
      method: 'post',
      data: payload
    })
  }

  /**
   * POST /api/auth/change-password
   * { email, code, password, confirmPassword }
   * Vérifie l'OTP et applique le nouveau mot de passe.
   */
  const changePassword = async (
    payload: ChangePasswordPayload
  ): Promise<AxiosResponse<OtpResponse>> => {
    return await request('/auth/change-password', {
      method: 'post',
      data: payload
    })
  }

  /**
   * POST /api/auth/logout
   * Bearer token requis — invalide la session Redis (supprime le JTI).
   */
  const logout = async (): Promise<AxiosResponse> => {
    return await request('/auth/logout', {
      method: 'post'
    })
  }

  /**
   * PATCH /api/team
   * Bearer token requis — mets à jour les informations de la team
   */
  const updateTeam = async (
    payload: UpdateTeamPayload
  ): Promise<AxiosResponse<UpdateTeamResponse>> => {
    return await request('/team/update', {
      method: 'post',
      data: {
        name: payload.teamName,
        slug: payload.slug
      }
    })
  }

  return {
    login,
    register,
    updateTeam,
    sendOtp,
    verifyOtp,
    resetPassword,
    changePassword,
    logout
  }
}
