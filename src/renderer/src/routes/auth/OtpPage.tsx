// pages/auth/OtpPage.tsx
import { useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { pause } from '@/constants'
import { OtpInput } from '@/components/auth/OtpInput'
import { SubmitButton } from '@/components/auth/AuthFormparts'
import { cn } from '@/utils/cn'
import { useIsMobile } from '@/composables/useIsMobile'
import { ChevronLeft, Envelope1, ErrorCircle1, Reload } from '@tailgrids/icons'
import { Spinner } from '@/components/ui/Spinner'
import ShieldIcon from '@/components/icons/ShieldIcon'
import { useResendTimer } from '@/composables/useResendTimer'
import { maskEmail } from '@/helpers'
import { useAuthStore } from '@/stores/auth.store'
import { useStore } from 'zustand'

// ─── Page ─────────────────────────────────────────────────────

export default function OtpPage(): React.JSX.Element {
  const { pendingEmail, verifyOtp, sendOtp } = useStore(useAuthStore)

  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()
  const otpLength = isMobile ? 4 : 6

  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const { seconds, canResend, reset: resetTimer } = useResendTimer() // CountDown par défaut 60 sécondes

  // Email masqué — sera fourni par le state de navigation ou l'authStore
  // ex: navigate('/login/otp', { state: { email: 'alice@...' } })
  const emailToMask = (location.state as string | null) ?? pendingEmail ?? ''
  const maskedEmail = maskEmail(emailToMask)

  const handleSubmit = useCallback(
    async (code = otp) => {
      if (loading) return
      if (code.length !== otpLength) {
        setError(`Entrez les ${otpLength} chiffres du code.`)
        return
      }
      setLoading(true)
      setError(null)
      try {
        // → POST /auth/otp/verify
        const response = await verifyOtp({ email: emailToMask, code })
        await pause(500)
        if (response.status == 201 || response.status == 200) {
          navigate('/')
        }
      } catch {
        setError('Code incorrect ou expiré. Vérifiez et réessayez.')
        setOtp('')
      } finally {
        setLoading(false)
      }
    },
    [otp, otpLength, loading, emailToMask, navigate, verifyOtp]
  )

  const handleOtpChange = (value: string): void => {
    setOtp(value)
    if (error) setError(null)
    if (value.length === otpLength) {
      handleSubmit(value)
    }
  }

  async function handleResend(): Promise<void> {
    if (!canResend || resendLoading) return
    setResendLoading(true)
    setResendSuccess(false)
    setError(null)

    try {
      // TODO: await authClient.sendOTP(email)
      // → POST /auth/otp/send
      await sendOtp({ email: emailToMask, action: 'login' })
      await pause(500)
      resetTimer()
      setResendSuccess(true)
      setOtp('')
      setTimeout(() => setResendSuccess(false), 4000)
    } catch {
      setError("Impossible d'envoyer le code. Réessayez.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── Icône + En-tête ── */}
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Shield icon animé */}
        <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center animate-pulse-slow">
          <ShieldIcon />
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold text-title-50 tracking-tight">Vérification</h1>
          <p className="text-sm text-foreground-soft-500">Entrez le code reçu par email</p>
          <p className="text-xs text-foreground-soft-500/50 font-mono flex items-center justify-center gap-1.5">
            <Envelope1 className="w-5 h-5" />
            {maskedEmail}
          </p>
        </div>
      </div>

      {/* ── OTP Input ── */}
      <div className="flex flex-col gap-3">
        <OtpInput
          length={otpLength}
          value={otp}
          onChange={handleOtpChange}
          hasError={!!error}
          disabled={loading}
          autoFocus
        />

        {/* Erreur */}
        {error && (
          <div role="alert" className="flex items-center justify-center gap-2 animate-shake">
            <ErrorCircle1 className="w-5 h-5 text-error-500" />
            <p className="text-sm text-error-500 text-center">{error}</p>
          </div>
        )}

        {/* Succès renvoi */}
        {resendSuccess && (
          <p className="text-sm text-primary-600 text-center flex items-center justify-center gap-1.5">
            <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M4.5 7l2 2L9.5 5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Nouveau code envoyé !
          </p>
        )}
      </div>

      {/* ── Bouton vérifier ── */}
      <SubmitButton loading={loading} label="Vérifier" loadingLabel="Vérification..." />

      {/* ── Renvoi + timer ── */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || resendLoading}
          className={cn(
            'flex items-center gap-1.5 text-sm font-medium transition-all',
            canResend
              ? 'text-primary-500 hover:text-primary-700 cursor-pointer'
              : 'text-foreground-soft-500/40 cursor-not-allowed'
          )}
        >
          {resendLoading ? (
            <Spinner size={'sm'} />
          ) : (
            <Reload className={cn('w-4 h-4', !canResend && 'opacity-40')} />
          )}
          {canResend ? 'Renvoyer le code' : `Renvoyer dans ${seconds}s`}
        </button>

        {/* Séparateur */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 h-px bg-base-200" />
          <span className="text-xs text-foreground-soft-500/40">ou</span>
          <div className="flex-1 h-px bg-base-200" />
        </div>

        <Link
          to="/auth/login"
          className="flex justify-center items-center text-sm text-foreground-soft-500 hover:text-title-50 transition-colors"
        >
          <span>
            <ChevronLeft className="w-4 h-4" />
          </span>
          <span>Retour à la connexion</span>
        </Link>
      </div>
    </div>
  )
}
