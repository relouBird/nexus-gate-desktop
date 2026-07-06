// pages/auth/LoginPage.tsx
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { pause } from '@/constants'
import { Field, AuthInput, PasswordInput, SubmitButton } from '@/components/auth/AuthFormparts'
import { Envelope1, ErrorCircle1 } from '@tailgrids/icons'
import useForm from '@/composables/useForm'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth.store'
import { useStore } from 'zustand'

// ─── Page ─────────────────────────────────────────────────────

export default function LoginPage(): React.JSX.Element {
  // La store
  const { login: loginSession } = useStore(useAuthStore)

  const navigate = useNavigate()

  // 🔹 Créer un formulaire réactif
  const formT = useForm(
    // Schéma de validation Yup
    yup.object().shape({
      email: yup.string().email().required('Email Requis.'),
      password: yup
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]+$/,
          'Le mot de passe doit contenir des chiffres et des lettres et un caractère spécial.'
        )
        .required('Mot de Passe Requis.')
    })
  )
  const [loading, setLoading] = useState(false)
  const [finalError, setFinalError] = useState<string | undefined>(undefined)

  // Méthodes
  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setLoading(true)

    try {
      const isValid = await formT.validate()

      if (!isValid) {
        return
      }
      await pause(500)
      // Simuler un appel API
      console.log('DATAS ====>', formT.data)
      const res = await loginSession(formT.data, undefined, navigate)
      //   const res = await formT.submit(() => authStore.login(form.data));

      if (res?.status == 200 || res?.status == 201) {
        navigate('/')
      }

      formT.clear()
      formT.setData('password', '')

      console.log('Login:', formT.data)
    } catch (error) {
      setFinalError('Email ou mot de passe incorrect. Vérifiez vos identifiants.')
      console.log('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── En-tête ── */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold text-title-50 tracking-tight">Bon retour 👋</h1>
        <p className="text-sm text-foreground-soft-500">
          Connectez-vous pour accéder à votre espace NexusGate.
        </p>
      </div>

      {/* ── Erreur globale ── */}
      {finalError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-error-50 px-4 py-1.5 my-0"
        >
          <ErrorCircle1 className="w-5 h-5 text-error-500" />
          <p className="text-sm text-error-600">{finalError}</p>
        </div>
      )}

      {/* ── Formulaire ── */}
      <form onSubmit={handleLogin} noValidate className="flex flex-col gap-4 pt-0 mt-0">
        <Field label="Adresse email" htmlFor="email" error={formT.errors.email?.toLocaleString()}>
          <AuthInput
            id="email"
            type="email"
            name="email"
            placeholder="alice@techcorp.com"
            autoComplete="email"
            value={formT.data.email}
            onChange={(e) => {
              setFinalError(undefined)
              formT.setData('email', e.target.value)
            }}
            onBlur={() => formT.validateField('email')}
            hasError={!!formT.errors.email}
            leftIcon={<Envelope1 className="w-5 h-5" />}
            disabled={loading}
          />
        </Field>

        <Field
          label="Mot de passe"
          htmlFor="password"
          error={formT.errors.password?.toLocaleString()}
        >
          <PasswordInput
            id="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={formT.data.password}
            onChange={(e) => {
              setFinalError(undefined)
              formT.setData('password', e.target.value)
            }}
            onBlur={() => formT.validateField('password')}
            hasError={!!formT.errors.password}
            disabled={loading}
          />
        </Field>

        {/* Mot de passe oublié */}
        <div className="flex justify-end -mt-1">
          <Link
            to="/auth/forgot-password"
            className="text-xs text-primary-500 hover:text-primary-700 transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <SubmitButton loading={loading} label="Se connecter" loadingLabel="Connexion en cours..." />
      </form>

      {/* ── Footer ── */}
      <p className="text-center text-sm text-foreground-soft-500">
        Pas encore de compte ?{' '}
        <Link
          to="/auth/register"
          className="text-primary-500 font-medium hover:text-primary-700 transition-colors"
        >
          Créer une équipe
        </Link>
      </p>
    </div>
  )
}
