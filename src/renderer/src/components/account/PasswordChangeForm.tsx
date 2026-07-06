import { pause } from '@/constants'
import { useState, type FormEvent } from 'react'
import {
  Field,
  PasswordInput,
  PasswordStrength,
  SubmitButton,
  SuccessBadge
} from '../auth/AuthFormparts'

// Formulaires
import useForm from '@/composables/useForm'
import * as yup from 'yup'
import { useMeStore } from '@/stores/me.store'
import { useStore } from 'zustand'

export default function PasswordChangeForm(): React.JSX.Element {
  const { changePassword } = useStore(useMeStore)

  const formTemplate = useForm(
    // Schéma de validation Yup
    yup.object().shape({
      password: yup
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          'Le mot de passe doit contenir des chiffres et des lettres et un caractère spécial.'
        )
        .required('Le mot de passe est requis.'),
      newPassword: yup
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          'Le mot de passe doit contenir des chiffres et des lettres et un caractère spécial.'
        )
        .required('Le nouveau mot de passe est requis.'),
      confirmNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas.')
        .required('Veuillez confirmer votre mot de passe.')
    })
  )

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()

    setLoading(true)
    setSuccess(false)
    try {
      await pause(500)
      await changePassword(formTemplate.data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field
        label="Mot de passe actuel"
        htmlFor="password"
        error={formTemplate.errors.password?.toLocaleString()}
        small
      >
        <PasswordInput
          id="password"
          name="password"
          placeholder="••••••••"
          autoComplete="password"
          value={formTemplate.data.password}
          onChange={(v) => formTemplate.setData('password', v.target.value)}
          onBlur={() => formTemplate.validateField('password')}
          hasError={!!formTemplate.errors.password}
          disabled={loading}
        />
      </Field>

      <Field
        label="Nouveau mot de passe"
        htmlFor="new-password"
        error={formTemplate.errors.newPassword?.toLocaleString()}
        small
      >
        <PasswordInput
          id="new-password"
          name="new-password"
          placeholder="Minimum 8 caractères"
          autoComplete="new-password"
          value={formTemplate.data.newPassword}
          onChange={(v) => formTemplate.setData('newPassword', v.target.value)}
          onBlur={() => formTemplate.validateField('newPassword')}
          hasError={!!formTemplate.errors.newPassword}
          disabled={loading}
        />

        <PasswordStrength password={formTemplate.data.newPassword} />
      </Field>

      <Field
        label="Confirmer le mot de passe"
        htmlFor="confirm-new-password"
        error={formTemplate.errors.confirmNewPassword?.toLocaleString()}
        small
      >
        <PasswordInput
          id="confirm-new-password"
          name="confirm-new-password"
          placeholder="Répétez le mot de passe"
          autoComplete="confirm-new-password"
          value={formTemplate.data.confirmNewPassword}
          onChange={(v) => formTemplate.setData('confirmNewPassword', v.target.value)}
          onBlur={() => formTemplate.validateField('confirmNewPassword')}
          hasError={!!formTemplate.errors.confirmNewPassword}
          disabled={loading}
        />
      </Field>

      <div className="flex items-center gap-3">
        <SubmitButton loading={loading} label="Continuer" loadingLabel="Changer le mot de passe" />
        {success && <SuccessBadge message="Mot de passe mis à jour" />}
      </div>
    </form>
  )
}
