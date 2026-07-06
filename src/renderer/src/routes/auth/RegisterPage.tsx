// pages/auth/RegisterPage.tsx
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { pause } from '@/constants'
import {
  Field,
  AuthInput,
  PasswordInput,
  PasswordStrength,
  SubmitButton,
  AuthDivider
} from '@/components/auth/AuthFormparts'
import { StepIndicator } from '@/components/auth/AuthRegisterparts'
import {
  ChevronLeft,
  ChevronRight,
  Envelope1,
  ErrorCircle1,
  User2,
  UserMultiple4
} from '@tailgrids/icons'

// Formulaires
import useForm from '@/composables/useForm'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth.store'
import { useStore } from 'zustand'
import type { AxiosResponse } from 'axios'

// ─── Page ─────────────────────────────────────────────────────

export default function RegisterPage(): React.JSX.Element {
  // La store
  const { pendingEmail, register: registerTeam } = useStore(useAuthStore)

  // 🔹 Créer un formulaire réactif
  const formStep1 = useForm(
    // Schéma de validation Yup
    yup.object().shape({
      username: yup
        .string()
        .min(6, "Votre nom d'utilisateur doit avoir au moins 6 caractères")
        .matches(/^\S*$/, 'Les espaces ne sont pas autorisés')
        .required("Nom d'utilisateur requis."),
      teamName: yup
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
        .required('Le mot de passe est requis.')
    })
  )

  // 🔹 Créer un formulaire réactif
  const formStep2 = useForm(
    // Schéma de validation Yup
    yup.object().shape({
      email: yup.string().email().required('Email Requis.'),
      password: yup
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]+$/,
          'Le mot de passe doit contenir des chiffres et des lettres et un caractère spécial.'
        )
        .required('Le mot de passe est requis.'),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas.')
        .required('Veuillez confirmer votre mot de passe.')
    }),
    {
      email: pendingEmail ?? ''
    }
  )

  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [globalError, setGlobalError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  // Étape 1 → 2
  async function handleNextStep(e: FormEvent): Promise<void> {
    e.preventDefault()

    const isValid = await formStep1.validate()

    if (!isValid) {
      return
    }

    setStep(2)
  }

  // Soumission finale
  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()

    const isValid = await formStep2.validate()

    if (!isValid) {
      return
    }

    setLoading(true)

    try {
      await pause(1000)
      const res = await registerTeam({
        ...formStep1.data,
        ...formStep2.data
      })
      if (res?.status == 200 || res?.status == 201) {
        navigate('/auth/verification')
      }
    } catch (error) {
      const response = error as AxiosResponse
      setGlobalError(
        response.data?.message ??
          'Une erreur est survenue lors de la création du compte. Réessayez.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Slug preview : ce que le backend va générer
  const teamSlug = formStep1.data.teamName
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return (
    <div className="flex flex-col gap-7">
      {/* ── En-tête ── */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold text-title-50 tracking-tight">Créer votre équipe</h1>
        <p className="text-sm text-foreground-soft-500">
          Un compte CREATOR et une équipe, en une seule étape.
        </p>
      </div>

      {/* ── Stepper ── */}
      <StepIndicator current={step} />

      {/* ── Erreur globale ── */}
      {globalError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-error-50 px-4 py-3"
        >
          <ErrorCircle1 className="w-5 h-5 text-error-500" />
          <p className="text-sm text-error-600">{globalError}</p>
        </div>
      )}

      {/* ── Step 1 : Équipe & nom d'utilisateur ── */}
      {step === 1 && (
        <form onSubmit={handleNextStep} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <Field
              label="Nom de l'équipe"
              htmlFor="teamName"
              error={formStep1.errors.teamName?.toLocaleString()}
            >
              <AuthInput
                id="teamName"
                type="text"
                name="teamName"
                placeholder="ex: TechCorp"
                autoComplete="organization"
                value={formStep1.data.teamName}
                onChange={(e) => {
                  setGlobalError(undefined)
                  formStep1.setData('teamName', e.target.value)
                }}
                onBlur={() => formStep1.validateField('teamName')}
                hasError={!!formStep1.errors.teamName}
                leftIcon={<UserMultiple4 className="w-5 h-5" />}
              />
              {/* Slug preview */}
              {teamSlug && (
                <p className="text-xs text-foreground-soft-500/50 font-mono -mt-0.5">
                  nexusgate.io/
                  <span className="text-primary-500">{teamSlug}</span>
                  /…
                </p>
              )}
            </Field>

            <AuthDivider label="Votre compte administrateur" />

            <Field
              label="Nom d'utilisateur"
              htmlFor="username"
              error={formStep1.errors.username?.toLocaleString()}
            >
              <AuthInput
                id="username"
                type="text"
                name="username"
                placeholder="ex: alice_martin"
                autoComplete="username"
                value={formStep1.data.username}
                onChange={(e) => {
                  setGlobalError(undefined)
                  formStep1.setData('username', e.target.value)
                }}
                onBlur={() => formStep1.validateField('username')}
                hasError={!!formStep1.errors.username}
                leftIcon={<User2 className="w-5 h-5" />}
              />
            </Field>
          </div>

          <SubmitButton
            loading={false}
            label="Continuer"
            rightIcon={<ChevronRight className="w-5 h-5" />}
            loadingLabel=""
          />
        </form>
      )}

      {/* ── Step 2 : Email & mot de passe ── */}
      {step === 2 && (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <Field
              label="Adresse email"
              htmlFor="email"
              error={formStep2.errors.email?.toLocaleString()}
            >
              <AuthInput
                id="email"
                type="email"
                name="email"
                placeholder="alice@techcorp.com"
                autoComplete="email"
                value={formStep2.data.email}
                onChange={(e) => formStep2.setData('email', e.target.value)}
                onBlur={() => formStep2.validateField('email')}
                hasError={!!formStep2.errors.email}
                leftIcon={<Envelope1 className="w-5 h-5" />}
              />
            </Field>

            <Field
              label="Mot de passe"
              htmlFor="password"
              error={formStep2.errors.password?.toLocaleString()}
            >
              <PasswordInput
                id="password"
                name="password"
                placeholder="Minimum 8 caractères"
                autoComplete="new-password"
                value={formStep2.data.password}
                onChange={(e) => {
                  setGlobalError(undefined)
                  formStep2.setData('password', e.target.value)
                }}
                onBlur={() => formStep2.validateField('password')}
                hasError={!!formStep2.errors.password}
              />
              <PasswordStrength password={formStep2.data.password} />
            </Field>

            <Field
              label="Confirmer le mot de passe"
              htmlFor="confirmPassword"
              error={formStep2.errors.confirmPassword?.toLocaleString()}
            >
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Répétez le mot de passe"
                autoComplete="new-password"
                value={formStep2.data.confirmPassword}
                onChange={(e) => {
                  setGlobalError(undefined)
                  formStep2.setData('confirmPassword', e.target.value)
                }}
                onBlur={() => formStep2.validateField('confirmPassword')}
                hasError={!!formStep2.errors.confirmPassword}
              />
            </Field>
          </div>

          {/* Recap équipe */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 border border-primary-100">
            <svg
              viewBox="0 0 14 14"
              fill="none"
              className="w-3.5 h-3.5 text-primary-500 shrink-0"
              aria-hidden="true"
            >
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M5 7l1.5 1.5L9 5.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-xs text-primary-700">
              Équipe <span className="font-semibold">{formStep1.data.teamName}</span>
              {' · '}Compte CREATOR pour{' '}
              <span className="font-semibold font-mono">{formStep1.data.username}</span>
            </p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="ml-auto text-xs text-primary-500 hover:text-primary-700 underline underline-offset-2 shrink-0"
            >
              Modifier
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <SubmitButton
              loading={loading}
              label="Créer le compte"
              loadingLabel="Création en cours..."
              rightIcon={<ChevronRight className="w-5 h-5" />}
            />
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
              className="w-full flex justify-center items-center gap-1.5 text-sm text-foreground-soft-500 hover:text-title-50 transition-colors disabled:opacity-40 py-1 outline-none focus:outline-none"
            >
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
          </div>
        </form>
      )}

      {/* ── Footer ── */}
      <p className="text-center text-sm text-foreground-soft-500">
        Déjà un compte ?{' '}
        <Link
          to="/auth/login"
          className="text-primary-500 font-medium hover:text-primary-700 transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </div>
  )
}
