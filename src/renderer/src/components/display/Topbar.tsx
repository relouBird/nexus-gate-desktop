import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { useAuthStore } from '@/stores/auth.store'
import { useStore } from 'zustand'

// Topbar.tsx
export function Topbar(): React.JSX.Element {
  const user = useStore(useAuthStore, (state) => state.user)

  return (
    <header className="fixed top-0 left-0 pl-64 right-0 z-48 w-full border-b border-base-200 bg-background-50/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Breadcrumb />

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-1 pr-4 py-1.5 bg-background-soft-50 border cursor-pointer border-base-200 rounded-3xl">
          <button
            type="button"
            className="relative rounded-full size-9 bg-primary-100 grid place-items-center text-primary-500 font-semibold text-sm hover:bg-primary-200 transition-colors"
          >
            {user?.username.slice(0, 2).toLocaleUpperCase()}
          </button>
          <div>
            <p className="text-sm font-medium text-title-50 font-mono">{user?.username ?? ''}</p>
            <p className="text-xs text-title-50/60">
              {user?.role
                ? user.role[0].toLocaleUpperCase() + user.role.slice(1).toLocaleLowerCase()
                : ''}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
