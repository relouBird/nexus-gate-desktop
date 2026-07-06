// pages/auth/ResetPasswordPage.tsx
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { pause } from '@/constants'
import {
  Field,
  PasswordInput,
  PasswordStrength,
  SubmitButton,
  AuthDivider
} from '@/components/auth/AuthFormparts'
import { OtpInput } from '@/components/auth/OtpInput'
import { cn } from '@/utils/cn'
import { useIsMobile } from '@/composables/useIsMobile'
import {
  CheckCircle1,
  ChevronLeft,
  ChevronRight,
  Envelope1,
  ErrorCircle1,
  Shield1Check,
  XmarkCircle
} from '@tailgrids/icons'

// Formulaires
import useForm from '@/composables/useForm'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth.store'
import { useStore } from 'zustand'

type PageState = 'form' | 'success'

// ─── Page ─────────────────────────────────────────────────────

export default function ResetPasswordPage(): React.JSX.Element {
  const { pendingEmail, changePassword } = useStore(useAuthStore)

  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()
  const otpLength = isMobile ? 4 : 6

  // Email transmis depuis ForgotPasswordPage via navigate state
  const emailFromState = (location.state as { email?: string } | null)?.email ?? ''

  // 🔹 Créer un formulaire réactif
  const formTemplate = useForm(
    // Schéma de validation Yup
    yup.object().shape({
      email: yup.string().email().required('Email Requis.'),
      otp: yup
        .string()
        .required('Le code OTP est requis.')
        .matches(/^\d+$/, 'Le code OTP doit contenir uniquement des chiffres.')
        .min(isMobile ? 3 : 4, 'Le code OTP est incomplet.') // Ajustez à 6 selon votre backend
        .max(isMobile ? 4 : 6, 'Le code OTP est trop long.'),
      password: yup
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]+$/,
          'Le mot de passe doit contenir des chiffres et des lettres.'
        )
        .required('Le mot de passe est requis.'),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas.')
        .required('Veuillez confirmer votre mot de passe.')
    }),
    {
      email: (location.state as { email?: string } | null)?.email ?? pendingEmail ?? ''
    }
  )
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | undefined>(undefined)

  const [pageState, setPageState] = useState<PageState>('form')

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()

    const isValid = await formTemplate.validate()

    if (!isValid) {
      return
    }

    setLoading(true)
    try {
      // Le backend devra vérifier l'OTP puis mettre à jour le mot de passe.
      // Actuellement, /auth/otp/verify + une future route PATCH /auth/users/password
      await changePassword({
        email: formTemplate.data.email,
        password: formTemplate.data.password,
        confirmPassword: formTemplate.data.confirmPassword,
        code: formTemplate.data.otp
      })
      await pause(500)
      setPageState('success')
    } catch {
      setGlobalError('Code invalide ou expiré. Vérifiez le code et réessayez.')
      formTemplate.setData('otp', '')
    } finally {
      setLoading(false)
    }
  }

  // ── État : succès ─────────────────────────────────────────────
  if (pageState === 'success') {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Icône succès */}
          <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center">
            <Shield1Check className="w-8 h-8 text-primary-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold text-title-50 tracking-tight">
              Mot de passe modifié !
            </h1>
            <p className="text-sm text-foreground-soft-500">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous
              connecter.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/auth/login')}
          className="w-full flex justify-center items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-all focus:outline-none focus:ring-2 focus:ring-primary-300/60"
        >
          <span>Se connecter</span>
          <span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    )
  }

  // ── État : formulaire ─────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8">
      {/* ── En-tête ── */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold text-title-50 tracking-tight">
          Nouveau mot de passe
        </h1>
        <p className="text-sm text-foreground-soft-500">
          Entrez le code reçu par email et choisissez un nouveau mot de passe.
        </p>
        {emailFromState && (
          <p className="text-xs text-foreground-soft-500/50 font-mono flex items-center gap-1.5 mt-0.5">
            <Envelope1 className="w-5 h-5" />
            {emailFromState}
          </p>
        )}
      </div>

      {/* ── Erreur globale ── */}
      {globalError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-error-200 bg-error-50 px-4 py-3"
        >
          <ErrorCircle1 className="w-5 h-5 text-error-500" />
          <p className="text-sm text-error-600">{globalError}</p>
        </div>
      )}

      {/* ── Formulaire ── */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* Section OTP */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground-soft-500">
              Code de vérification
            </span>
            <Link
              to="/auth/forgot-password"
              className="text-xs text-primary-500 hover:text-primary-700 transition-colors"
            >
              Renvoyer un code
            </Link>
          </div>

          <OtpInput
            length={otpLength}
            value={formTemplate.data.otp}
            onChange={(val) => {
              setGlobalError(undefined)
              formTemplate.setData('otp', val)
            }}
            hasError={!!formTemplate.errors.otp}
            disabled={loading}
            autoFocus
          />

          {!!formTemplate.errors.otp && (
            <p className="text-xs text-error-500 text-center" role="alert">
              {formTemplate.errors.otp.toLocaleString()}
            </p>
          )}
        </div>

        {/* Séparateur */}
        <AuthDivider label="Nouveau mot de passe" />

        {/* Champs mot de passe */}
        <div className="flex flex-col gap-4">
          <Field
            label="Nouveau mot de passe"
            htmlFor="password"
            error={formTemplate.errors.password?.toLocaleString()}
          >
            <PasswordInput
              id="password"
              name="password"
              placeholder="Minimum 8 caractères"
              autoComplete="new-password"
              value={formTemplate.data.password}
              onChange={(e) => {
                setGlobalError(undefined)
                formTemplate.setData('password', e.target.value)
              }}
              onBlur={() => formTemplate.validateField('password')}
              hasError={!!formTemplate.errors.password}
              disabled={loading}
            />
            <PasswordStrength password={formTemplate.data.password} />
          </Field>

          <Field
            label="Confirmer le mot de passe"
            htmlFor="confirmPassword"
            error={formTemplate.errors.confirmPassword?.toLocaleString()}
          >
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Répétez le mot de passe"
              autoComplete="new-password"
              value={formTemplate.data.confirmPassword}
              onChange={(e) => {
                setGlobalError(undefined)
                formTemplate.setData('confirmPassword', e.target.value)
              }}
              onBlur={() => formTemplate.validateField('confirmPassword')}
              hasError={!!formTemplate.errors.confirmPassword}
              disabled={loading}
            />
          </Field>
        </div>

        {/* Indicateur de correspondance */}
        {formTemplate.data.password && formTemplate.data.confirmPassword && (
          <div
            className={cn(
              'flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-colors',
              formTemplate.data.password === formTemplate.data.confirmPassword
                ? 'text-primary-700 bg-primary-50 border-primary-100'
                : 'text-error-600 bg-error-50 border-error-100'
            )}
          >
            {formTemplate.data.password === formTemplate.data.confirmPassword ? (
              <>
                <CheckCircle1 className="w-5 h-5" />
                Les mots de passe correspondent
              </>
            ) : (
              <>
                <XmarkCircle className="w-5 h-5" />
                Les mots de passe ne correspondent pas
              </>
            )}
          </div>
        )}

        <SubmitButton
          loading={loading}
          label="Réinitialiser le mot de passe"
          loadingLabel="Réinitialisation..."
        />
      </form>

      {/* ── Footer ── */}
      <Link
        to="/auth/login"
        className="flex justify-center items-center gap-1.5 text-center text-sm text-foreground-soft-500 hover:text-title-50 transition-colors"
      >
        <span>
          <ChevronLeft className="w-4 h-4" />
        </span>
        <span>Retour à la connexion</span>
      </Link>
    </div>
  )
}
