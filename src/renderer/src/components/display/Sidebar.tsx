// Sidebar.tsx
import { NavLink, useNavigate } from 'react-router'
import { cn } from '@/utils/cn'
import { NAV_ITEMS } from '@/constants/display/configuration.constant'
import { DropListItem } from '@/components/ui/DropList'
import { Exit } from '@tailgrids/icons'
import { useStore } from 'zustand'
import { useAuthStore } from '@/stores/auth.store'
import { pause } from '@/constants'
import { useNotify } from '@/helpers/notifications.helper'
import { useState } from 'react'
import { Spinner } from '../ui/Spinner'

// Import Image
import logo from '@/assets/logo.png'

export function Sidebar(): React.JSX.Element {
  const navigate = useNavigate()
  const notify = useNotify()
  const { logout } = useStore(useAuthStore)

  const [loading, setLoading] = useState(false)

  const handleLogout = async (): Promise<void> => {
    setLoading(true)
    try {
      await pause(1000)
      await logout(notify, navigate)
    } catch (error) {
      console.error('ERROR IS ====>', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-base-200 bg-background-50/95 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-1.5 pl-4 pr-6 pt-2">
        {/* Logo */}
        <img src={logo} alt="Logo" className="size-9 rounded-lg" />
        <p className="text-base flex flex-col gap-0 font-semibold translate-y-0.5 font-mono text-title-50">
          <span className="block py-0">Nexus</span>
          <span className="block py-0 text-secondary-900 -translate-y-1">Gate</span>
        </p>
      </div>

      {/* Navigation */}
      <nav className="px-3 pt-6 space-y-1">
        {NAV_ITEMS.map((item) =>
          item.children ? (
            <DropListItem key={item.label} item={item} stretched />
          ) : (
            <NavLink
              key={item.path}
              to={item.path!}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 rounded-lg text-sm font-medium focus:outline-none transition-colors',
                  isActive
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-foreground-soft-500 hover:text-title-50 hover:bg-background-soft-100'
                )
              }
            >
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      {/* Avatar - en bas de la sidebar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-base-200 p-4">
        <button
          type="button"
          onClick={() => {
            handleLogout()
          }}
          aria-label="Déconnexion"
          className="flex w-full font-mono items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-title-400 transition-all duration-200 border border-error-100 bg-error-50 text-error-500 hover:bg-error-50"
        >
          {loading ? <Spinner className="size-4 shrink-0" /> : <Exit className="size-5 shrink-0" />}

          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
