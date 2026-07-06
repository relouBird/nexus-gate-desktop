// ─── Formulaire slug ──────────────────────────────────────────

import { useState, type FormEvent } from 'react'
import { AuthInput, SubmitButton, SuccessBadge } from '../auth/AuthFormparts'
import type { TeamModel } from '@/types/nexusgate.type'
import { pause } from '@/constants'
import { FieldGroup } from './UtilsParam'
import { cn } from '@/utils/cn'
import { toSlug } from '@/helpers/server.helper'
import { Globe2, InfoTriangle } from '@tailgrids/icons'

// Formulaires
import useForm from '@/composables/useForm'
import * as yup from 'yup'

export function TeamSlugForm({
  team,
  onUpdate
}: {
  team: TeamModel
  onUpdate: (name: string) => Promise<void>
}): React.JSX.Element {
  // 🔹 Créer un formulaire réactif
  const formTemplate = useForm(
    // Schéma de validation Yup
    yup.object().shape({
      slug: yup
        .string()
        .trim()
        .required('Le slug est requis.')
        .min(2, 'Minimum 2 caractères.')
        .max(40, 'Maximum 40 caractères.')
        .matches(/^[a-z0-9-]+$/, 'Minuscules, chiffres et tirets uniquement.')
        .test(
          'no-leading-trailing-dash',
          'Ne peut pas commencer ou finir par un tiret.',
          (val) => !val || (!val.startsWith('-') && !val.endsWith('-'))
        )
    }),
    {
      slug: team.slug ?? ''
    }
  )

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  function handleChange(v: string): void {
    let cleaned = toSlug(v)
    // 2. Correction : Si l'utilisateur tape un tiret à la fin, on le préserve
    if (v.endsWith('-') && !cleaned.endsWith('-')) {
      cleaned += '-'
    }
    formTemplate.setData('slug', cleaned)
    setSuccess(false)
    setShowConfirm(false)
  }

  async function handleSubmitClick(e: FormEvent): Promise<void> {
    e.preventDefault()
    const isValid = await formTemplate.validate()

    if (!isValid) {
      return
    }
    if (formTemplate.data.slug === team.slug) return
    setShowConfirm(true)
  }

  async function confirmChange(): Promise<void> {
    setShowConfirm(false)
    setLoading(true)
    try {
      await pause(1000)
      setSuccess(true)
      await onUpdate(formTemplate.data.slug.trim())
      setTimeout(() => setSuccess(false), 4000)
    } finally {
      setLoading(false)
    }
  }

  const isDirty = formTemplate.data.slug !== team.slug

  return (
    <form onSubmit={handleSubmitClick} className="flex flex-col gap-4">
      <FieldGroup
        label="Slug de l'équipe"
        htmlFor="team-slug"
        error={formTemplate.errors.slug?.toLocaleString()}
        hint="Identifiant unique dans les URLs de gateway. Uniquement minuscules, chiffres et tirets."
      >
        <AuthInput
          id="team-slug"
          value={formTemplate.data.slug}
          mono
          onChange={(v) => {
            handleChange(v.target.value)
          }}
          onBlur={() => formTemplate.validateField('slug')}
          placeholder="ex: techcorp"
          hasError={!!formTemplate.errors.slug}
          disabled={loading}
        />
      </FieldGroup>

      {/* Preview URL */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg">
        <Globe2 className="text-gray-500" size={16} />
        <span className="text-xs font-mono text-gray-400">
          nexusgate.io/
          <span className={cn('font-semibold', isDirty ? 'text-indigo-500' : 'text-gray-600')}>
            {formTemplate.data.slug || '…'}
          </span>
          /{'{server}/{path}'}
        </span>
      </div>

      {/* Avertissement changement slug */}
      {isDirty && !formTemplate.errors.slug && (
        <div className="flex items-start gap-2.5 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-lg">
          <InfoTriangle className="text-amber-500" size={21} />
          <p className="text-xs text-amber-700 leading-relaxed">
            Changer le slug modifie toutes vos URLs de gateway. Les intégrations existantes devront
            être mises à jour.
          </p>
        </div>
      )}

      {/* Modale de confirmation inline */}
      {showConfirm && (
        <div className="flex flex-col gap-3 px-4 py-4 bg-white border border-red-100 rounded-xl">
          <p className="text-sm font-medium text-gray-800">Confirmer le changement de slug ?</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Le slug <span className="font-mono font-semibold text-gray-700">{team.slug}</span> sera
            remplacé par{' '}
            <span className="font-mono font-semibold text-indigo-600">
              {formTemplate.data.slug}
            </span>
            . Toutes les URLs de gateway seront immédiatement modifiées.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={confirmChange}
              className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
            >
              Confirmer
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {!showConfirm && (
        <div className="flex items-center gap-3">
          <SubmitButton
            loading={loading}
            loadingLabel="Mise à jour en cours..."
            disabled={!isDirty}
            label="Mettre à jour le slug"
          />
          {success && <SuccessBadge message="Slug mis à jour" />}
          {!isDirty && !loading && !success && (
            <span className="text-xs text-gray-300">Aucune modification</span>
          )}
        </div>
      )}
    </form>
  )
}
