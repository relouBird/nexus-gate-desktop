// Formulaires
import useForm from '@/composables/useForm'
import { pause } from '@/constants'
import { useState, type FormEvent } from 'react'
import * as yup from 'yup'
import { AuthInput, Field, SubmitButton, SuccessBadge } from '../auth/AuthFormparts'
import { useMeStore } from '@/stores/me.store'
import { useStore } from 'zustand'
import { useAuthStore } from '@/stores/auth.store'
import { useNotify } from '@/helpers/notifications.helper'

// ─── Formulaire username ──────────────────────────────────────

export default function UsernameChangeForm(): React.JSX.Element {
  const notify = useNotify()

  const { changeUsername, user } = useStore(useMeStore)
  const { setUser } = useStore(useAuthStore)

  // 🔹 Créer un formulaire réactif
  const formTemplate = useForm(
    // Schéma de validation Yup
    yup.object().shape({
      username: yup
        .string()
        .min(6, "Votre nom d'utilisateur doit avoir au moins 6 caractères")
        .matches(/^\S*$/, 'Les espaces ne sont pas autorisés')
        .required("Nom d'utilisateur requis.")
    }),
    {
      username: user?.username ?? ''
    }
  )

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()

    const isValid = await formTemplate.validate()

    if (!isValid) {
      return
    }
    if (formTemplate.data.username === user?.username) return
    setLoading(true)
    setSuccess(false)
    try {
      await pause(500)
      const data = await changeUsername({ username: formTemplate.data.username }, notify)
      setUser(data.data.user)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  const isDirty = formTemplate.data.username !== user?.username

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field
        label="Nom d'utilisateur"
        htmlFor="username"
        error={formTemplate.errors.username?.toLocaleString()}
        small
      >
        <AuthInput
          id="username"
          name="username"
          type="text"
          placeholder="ex: alice_martin"
          value={formTemplate.data.username}
          onChange={(v) => {
            formTemplate.setData('username', v.target.value)
            setSuccess(false)
          }}
          onBlur={() => formTemplate.validateField('username')}
          hasError={!!formTemplate.errors.username}
          disabled={loading}
        />
      </Field>
      <div className="flex items-center gap-3">
        <SubmitButton
          loading={loading}
          label="Enregistrer"
          loadingLabel="Changer le nom d'utilisateur"
        />
        {success && <SuccessBadge message="Nom d'utilisateur mis à jour" />}
        {!isDirty && !loading && !success && (
          <span className="text-xs text-gray-300">Aucune modification</span>
        )}
      </div>
    </form>
  )
}
