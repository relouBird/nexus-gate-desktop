import { pause } from '@/constants'
import { useState, type FormEvent } from 'react'
import type { TeamModel } from '@/types/nexusgate.type'
import { FieldGroup } from './UtilsParam'
import { AuthInput, SubmitButton, SuccessBadge } from '../auth/AuthFormparts'

export default function TeamNameForm({
  team,
  onUpdate
}: {
  team: TeamModel
  onUpdate: (name: string) => Promise<void>
}): React.JSX.Element {
  const [name, setName] = useState(team.name)
  const [error, setError] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [touched, setTouched] = useState(false)

  function validate(v: string): string | undefined {
    if (!v.trim()) return 'Le nom est requis.'
    if (v.trim().length < 2) return 'Minimum 2 caractères.'
    if (v.trim().length > 50) return 'Maximum 50 caractères.'
    return undefined
  }

  function handleBlur(): void {
    setTouched(true)
    setError(validate(name))
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()
    setTouched(true)
    const err = validate(name)
    if (err) {
      setError(err)
      return
    }
    if (name.trim() === team.name) return
    setLoading(true)
    setSuccess(false)
    try {
      await pause(500)
      await onUpdate(name.trim())
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  const isDirty = name.trim() !== team.name

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldGroup
        label="Nom de l'équipe"
        htmlFor="team-name"
        error={error}
        hint="Visible par tous les membres de l'équipe."
      >
        <AuthInput
          id="team-name"
          value={name}
          onChange={(v) => {
            setName(v.target.value)
            if (touched) setError(validate(v.target.value))
            setSuccess(false)
          }}
          onBlur={handleBlur}
          placeholder="ex: TechCorp"
          hasError={!!error}
          disabled={loading}
        />
      </FieldGroup>

      <div className="flex items-center gap-3">
        <SubmitButton
          label="Enregistrer"
          loadingLabel="Enregistrement..."
          loading={loading}
          disabled={!isDirty}
        />
        {success && <SuccessBadge message="Nom de l'équipe mis à jour" />}
        {!isDirty && !loading && !success && (
          <span className="text-xs text-gray-300">Aucune modification</span>
        )}
      </div>
    </form>
  )
}
