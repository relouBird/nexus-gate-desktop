import { pause } from '@/constants'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Spinner } from '../ui/Spinner'

export default function DeleteTeamComponent({ teamName }: { teamName: string }): React.JSX.Element {
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const canDelete = confirm === teamName

  async function handleDelete(): Promise<void> {
    if (!canDelete) return
    setLoading(true)
    try {
      await pause(2000)
      // TODO: await teamService.delete()
      // RPC: team.delete → puis logout
      navigate('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-red-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-red-100 bg-red-50/60">
        <h2 className="text-sm font-semibold text-red-700">Zone de danger</h2>
        <p className="text-xs text-red-400 mt-0.5">Ces actions sont irréversibles</p>
      </div>
      <div className="px-5 py-5 flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Dissoudre l&apos;équipe</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            Supprime l&apos;équipe, tous ses membres, serveurs, tokens et règles de façon
            permanente. Cette action ne peut pas être annulée.
          </p>
        </div>

        <div className="flex items-end gap-3">
          {/* Confirmation par saisie du nom */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="confirm-delete" className="text-xs text-gray-500">
              Saisissez <span className="font-semibold font-mono text-gray-700">{teamName}</span>{' '}
              pour confirmer
            </label>
            <input
              id="confirm-delete"
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={teamName}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-mono text-gray-800 focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100 transition"
            />
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={!canDelete || loading}
            className="flex w-fit text-nowrap items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-500"
          >
            {loading && <Spinner size={'sm'} />}
            {loading ? 'Dissolution en cours...' : "Dissoudre l'équipe"}
          </button>
        </div>
      </div>
    </div>
  )
}
