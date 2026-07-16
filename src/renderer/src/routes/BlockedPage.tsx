// components/auth/BlockedPage.tsx
import { useNavigate } from 'react-router'

import { useStore } from 'zustand'
import { useAuthStore } from '@/stores/auth.store'
import { useMeStore } from '@/stores/me.store'
import { pause } from '@/constants'
import { useNotify } from '@/helpers/notifications.helper'
import { useState } from 'react'
import { Spinner } from '@/components/ui/Spinner'

export default function BlockedPage(): React.JSX.Element {
  const navigate = useNavigate()
  const notify = useNotify()

  const { user: me, reset } = useStore(useMeStore)
  const { logout } = useStore(useAuthStore)

  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await pause(500)
      reset()
      await logout(notify, navigate)
    } catch (error) {
      console.log('ERREUR ===>', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-[70vh] bg-slate-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Accès non autorisé</h2>
          <p className="text-sm text-slate-500 mb-4">
            Les comptes de type <span className="font-medium text-error-500">CLIENT</span>{' '}
            n&apos;ont pas accès à cette plateforme.
          </p>
          {me && (
            <p className="text-xs text-slate-400 mb-6">
              Connecté en tant que : {me.email || me.username}
            </p>
          )}
          <div className="w-full flex justify-center">
            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-2.5 flex items-center justify-center gap-1.5 bg-red-600 text-white rounded-lg hover:bg-error-400 transition-colors font-medium text-sm"
            >
              {isLoading && <Spinner size={'sm'} />}
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
