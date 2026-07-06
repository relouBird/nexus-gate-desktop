// pages/auth/ForgotPasswordPage.tsx
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { pause } from '@/constants'
import { Field, AuthInput, SubmitButton } from '@/components/auth/AuthFormparts'
// Formulaires
import useForm from '@/composables/useForm'
import * as yup from 'yup'

// Les icones
import { ChevronLeft, Envelope1, ErrorCircle1 } from '@tailgrids/icons'
import MailSentIcon from '@/components/icons/MailSentIcon'
import ChevronRight from '@/components/icons/ChevronRight'
import { useAuthStore } from '@/stores/auth.store'
import { useStore } from 'zustand'

// ─── États de la page ─────────────────────────────────────────

type PageState = 'form' | 'sent'

// ─── Page ─────────────────────────────────────────────────────

export default function ForgotPasswordPage(): React.JSX.Element {
  const { pendingEmail, resetPassword } = useStore(useAuthStore)

  const navigate = useNavigate()
  const [pageState, setPageState] = useState<PageState>('form')
  const [globalError, setGlobalError] = useState<string | undefined>()

  // 🔹 Créer un formulaire réactif
  const form = useForm(
    // Schéma de validation Yup
    yup.object().shape({
      email: yup.string().email().required('Email Requis.')
    }),
    {
      email: pendingEmail ?? ''
    }
  )
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()
    const isValid = await form.validate()

    if (!isValid) {
      return
    }
    setLoading(true)
    setGlobalError(undefined)
    try {
      // → POST /auth/otp/send
      await resetPassword({ email: form.data.email })
      await pause(500)

      setPageState('sent')
    } catch {
      setGlobalError("Impossible d'envoyer le code. Vérifiez l'email et réessayez.")
    } finally {
      setLoading(false)
    }
  }

  function handleGoToReset(): void {
    // Passe l'email via state de navigation pour pré-remplir la page reset
    navigate('/auth/reset-password', { state: form.data.email })
  }

  // ── État : code envoyé ────────────────────────────────────────
  if (pageState === 'sent') {
    return (
      <div className="flex flex-col gap-8">
        {/* Icône succès */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center">
            <MailSentIcon />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold text-title-50 tracking-tight">Code envoyé !</h1>
            <p className="text-sm text-foreground-soft-500">
              Un code de réinitialisation a été envoyé à
            </p>
            <p className="text-sm font-semibold text-title-50 font-mono">{form.data.email}</p>
          </div>
        </div>

        {/* Deux options */}
        <div className="flex flex-col gap-3">
          {/* Option principale : aller sur la page reset */}
          <button
            type="button"
            onClick={handleGoToReset}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-300/60 focus:ring-offset-1"
          >
            <span>Réinitialiser le mot de passe</span>
            <span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>

          {/* Option secondaire : retour login */}
          <Link
            to="/auth/login"
            className="w-full flex justify-center items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground-soft-500 border border-base-200 bg-background-soft-50 hover:bg-background-soft-100 hover:text-title-50 transition-all text-center focus:outline-none focus:ring-2 focus:ring-base-300/40"
          >
            <span>
              <ChevronLeft className="w-4 h-4" />
            </span>
            <span>Retour à la connexion</span>
          </Link>
        </div>

        {/* Note explicative */}
        <div className="flex items-start gap-2.5 rounded-xl border border-base-200 bg-background-soft-50 px-4 py-3">
          <ErrorCircle1 className="w-5 h-5 text-foreground-soft-500/50" />
          <p className="text-xs text-foreground-soft-500 leading-relaxed">
            Le code est valable
            <span className="font-medium text-title-50"> 5 minutes</span>. Si vous ne recevez rien,
            vérifiez vos spams ou{' '}
            <button
              type="button"
              onClick={() => setPageState('form')}
              className="text-primary-500 underline underline-offset-2 hover:text-primary-700 transition-colors"
            >
              réessayez
            </button>
            .
          </p>
        </div>
      </div>
    )
  }

  // ── État : formulaire ─────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8">
      {/* ── En-tête ── */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold text-title-50 tracking-tight">
          Mot de passe oublié ?
        </h1>
        <p className="text-sm text-foreground-soft-500">
          Entrez votre email. On vous envoie un code pour réinitialiser votre mot de passe.
        </p>
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
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field label="Adresse email" htmlFor="email" error={form.errors.email?.toLocaleString()}>
          <AuthInput
            id="email"
            type="email"
            name="email"
            placeholder="alice@techcorp.com"
            autoComplete="email"
            autoFocus
            value={form.data.email}
            onChange={(e) => {
              setGlobalError(undefined)
              form.setData('email', e.target.value)
            }}
            onBlur={() => form.validateField('email')}
            hasError={!!form.errors.email}
            disabled={loading}
            leftIcon={<Envelope1 className="w-5 h-5" />}
          />
        </Field>

        <SubmitButton loading={loading} label="Envoyer le code" loadingLabel="Envoi en cours..." />
      </form>

      {/* ── Options secondaires ── */}
      <div className="flex flex-col gap-3">
        {/* Option : j'ai déjà un code */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-foreground-soft-500">Vous avez déjà un code ?</span>
          <button
            type="button"
            onClick={() => navigate('/auth/reset-password', { state: form.data.email })}
            className="flex justify-center items-center gap-1.5 text-sm text-primary-500 font-medium hover:text-primary-700 transition-colors"
          >
            <span>Réinitialiser</span>
            <span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>

        {/* Option : retour login */}
        <div className="flex items-center justify-center">
          <Link
            to="/auth/login"
            className="flex justify-center items-center text-sm text-foreground-soft-500 hover:text-title-50 transition-colors gap-1"
          >
            <span>
              <ChevronLeft className="w-4 h-4" />
            </span>
            <span>Retour à la connexion</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
