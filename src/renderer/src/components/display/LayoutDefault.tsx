import { Navigate, Outlet } from 'react-router'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useAuthStore } from '@/stores/auth.store'
import { useStore } from 'zustand'
import { useEffect, useRef, useState } from 'react'
import { useNotify } from '@/helpers/notifications.helper'
import { useMeStore } from '@/stores/me.store'
import { Reload } from '@tailgrids/icons'

export function LayoutDefault(): React.JSX.Element {
  const notify = useNotify()

  const { getMe } = useStore(useMeStore)
  const [isLoading, setIsLoading] = useState(false)

  const loaded = useRef(false)

  // Remplacez cette condition par votre vraie logique d'authentification (ex: token dans localStorage)
  const { accessToken } = useStore(useAuthStore)

  // AU chargement de la page
  useEffect(() => {
    if (loaded.current) return

    async function fetchData(): Promise<void> {
      setIsLoading(true)
      try {
        await getMe(notify)
      } catch (error) {
        console.log('Failed to fetch settings:', String(error))
      } finally {
        setIsLoading(false)
      }
    }

    loaded.current = true

    if (accessToken) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!accessToken) {
    return <Navigate to={'/auth/login'} replace />
  }
  return (
    <div className="min-h-screen bg-background-soft-50 font-sans">
      <Sidebar />
      <main className="mx-auto max-w-7xl ml-64 pt-16">
        <Topbar />
        <div className="px-6 py-8">
          {isLoading ? (
            <>
              <div className="flex flex-col items-center gap-3 py-16 text-center bg-white border border-gray-100 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                  <Reload size={25} />
                </div>
                <p className="text-sm text-gray-500">Données en cours de chargement...</p>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  )
}
