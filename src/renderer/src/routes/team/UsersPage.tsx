// pages/UsersPage.tsx
import { Overlay } from '@/components/display/Overlay'
import { PageHeader } from '@/components/gen/PageHeader'
import { pause } from '@/constants'
import { UserMultiple1 } from '@tailgrids/icons'
import { useEffect, useState, useCallback } from 'react'
import type { UserModel, UserRole } from '@/types/nexusgate.type'
import AccessDenied from '@/components/account/AccessDenied'

import UserProcessModal from '@/components/account/UserProcessModal'
import UsersTable from '@/components/gen/UsersTable'
import { ViewModeSwitcher } from '@/components/gen/ViewModeSwitcher'
import { VIEW_MODE } from '@/types'
import { useUserStore } from '@/stores/user.store'
import { useStore } from 'zustand'
import { useNotify } from '@/helpers/notifications.helper'
import type { CreateUserPayload, UpdateUserPayload } from '@/types/user.type'
import { useMeStore } from '@/stores/me.store'
import { useServerStore } from '@/stores/server.store'

// ─── Page principale ──────────────────────────────────────────

export default function UsersPage(): React.JSX.Element {
  const notify = useNotify()

  const { users, getManyUser, createUser, updateUser, deleteUser } = useStore(useUserStore)
  const { servers } = useStore(useServerStore)
  const { user: me } = useStore(useMeStore)

  const [isLoading, setIsLoading] = useState(false)
  const [viewerRole] = useState<UserRole>(me?.role as UserRole)
  const [showCreate, setShowCreate] = useState(false)
  const [showView, setShowView] = useState<UserModel | null>(null)
  const [editUser, setEditUser] = useState<UserModel | null>(null)
  const [search, setSearch] = useState('')

  const [mode, setMode] = useState<VIEW_MODE>(VIEW_MODE.GRID)

  const canCreate = viewerRole === 'CREATOR' || viewerRole === 'ADMIN'

  const filtered = users.filter(
    (u) =>
      !search ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreated = useCallback(
    async (u: CreateUserPayload) => {
      try {
        await createUser(u, notify)
      } catch (error) {
        console.log('Votre Erreur est : ', error)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const handleUpdated = useCallback(
    async (u: CreateUserPayload) => {
      const userToUpdated: UpdateUserPayload = {
        id: String(editUser?.id),
        username: u.username,
        email: u.email,
        password: u.password,
        role: u.role,
        accessPolicy: u.accessPolicy
      }

      await updateUser(userToUpdated, notify)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editUser?.id]
  )
  const handleDeleted = useCallback(async (id: string) => {
    await deleteUser(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setIsLoading(true)
      try {
        await pause(500)
        console.log('GET MANY USER CALLED')
        await getManyUser(notify)
      } finally {
        setIsLoading(false)
      }
    }
    if (canCreate) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!canCreate) {
    return (
      <div>
        <PageHeader title="Utilisateurs" description="Gérez les membres de votre équipe" />
        <AccessDenied allowedRoles={['CREATOR', 'ADMIN']} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Utilisateurs"
        buttonName="Nouvel utilisateur"
        icon={UserMultiple1}
        description="Gérez les membres de votre équipe et leurs accès aux serveurs"
        onView={() => setShowCreate(true)}
      />

      <Overlay visible={isLoading} text="Chargement des utilisateurs...">
        {}
        <div className="flex flex-col gap-4 mt-6">
          <ViewModeSwitcher label="Choisir le mode d'affichage :" value={mode} onChange={setMode} />
          {/* Barre filtres + stats */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
              >
                <circle cx="6.5" cy="6.5" r="4" />
                <path d="M10 10l3 3" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 transition"
              />
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>
                <span className="font-semibold text-gray-700">{filtered.length}</span> membre
                {filtered.length !== 1 ? 's' : ''}
              </span>
              <span className="w-px h-3 bg-gray-200" />
              <span>
                {users.filter((u) => u.status === 'authenticated').length} actif
                {users.filter((u) => u.status === 'authenticated').length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Tableau */}
          <UsersTable
            mode={mode}
            users={filtered}
            viewerRole={viewerRole}
            onEdit={setEditUser}
            onView={setShowView}
            onDelete={() => {}}
          />
        </div>
      </Overlay>

      {/* Modales */}
      {showCreate && (
        <UserProcessModal
          servers={servers}
          viewerRole={viewerRole}
          onClose={() => setShowCreate(false)}
          onProcess={handleCreated}
        />
      )}

      {/* Modales */}
      {showView && (
        <UserProcessModal
          user={showView}
          servers={servers}
          viewerRole={viewerRole}
          onClose={() => setShowView(null)}
          onProcess={handleUpdated}
          onRemoveProcess={handleDeleted}
          disabled
        />
      )}
      {editUser && (
        <UserProcessModal
          user={editUser}
          servers={servers}
          viewerRole={viewerRole}
          onClose={() => setEditUser(null)}
          onProcess={handleUpdated}
          onRemoveProcess={handleDeleted}
        />
      )}
    </div>
  )
}
