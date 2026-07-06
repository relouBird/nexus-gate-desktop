// ─── Tableau utilisateurs ─────────────────────────────────────

import { roleLabel } from '@/helpers/user.helper'
import { VIEW_MODE } from '@/types'
import type { UserModel, UserRole } from '@/types/nexusgate.type'
import { cn } from '@/utils/cn'
import { UserMultiple1, Pencil1 } from '@tailgrids/icons'
import { IndicatorMenu } from '../display/Menu'
import EmptyState from './EmptyState'

const STATUS_CFG = {
  authenticated: { dot: 'bg-emerald-400', label: 'Actif' },
  AUTHENTICATED: { dot: 'bg-emerald-400', label: 'Actif' },
  UNAUTHENTICATED: { dot: 'bg-gray-300', label: 'Inactif' },
  unauthenticated: { dot: 'bg-gray-300', label: 'Inactif' }
}

function ListView({
  users,
  viewerRole,
  onEdit
}: {
  users: UserModel[]
  viewerRole: UserRole
  onEdit: (user: UserModel) => void
}): React.JSX.Element {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Thead */}
      <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_40px] gap-3 px-4 py-2.5 border-b border-slate-200 bg-gray-50/60">
        {['Utilisateur', 'Email', 'Rôle', 'Statut', 'Accès', ''].map((h) => (
          <span
            key={h}
            className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
          >
            {h}
          </span>
        ))}
      </div>

      {users.map((user) => {
        const canEdit =
          viewerRole === 'CREATOR' || (viewerRole === 'ADMIN' && user.role === 'CLIENT')
        const accessSummary = user.accessPolicy.serverIds.includes('*')
          ? user.accessPolicy.mode === 'include'
            ? 'Tous'
            : 'Aucun'
          : `${user.accessPolicy.serverIds.length} srv`

        return (
          <div
            key={user.id}
            className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_90px] gap-3 items-center px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-gray-50/50 transition-colors"
          >
            {/* Utilisateur */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold shrink-0">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-gray-800 truncate">{user.username}</span>
            </div>
            {/* Email */}
            <span className="text-xs text-gray-500 truncate">{user.email}</span>
            {/* Rôle */}
            <span
              className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit',
                roleLabel[user.role].color
              )}
            >
              {roleLabel[user.role].label}
            </span>
            {/* Statut */}
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span
                className={cn('w-1.5 h-1.5 rounded-full shrink-0', STATUS_CFG[user.status].dot)}
              />
              {STATUS_CFG[user.status].label}
            </span>
            {/* Accès */}
            <span
              className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded w-fit',
                user.accessPolicy.mode === 'include'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-orange-50 text-orange-600'
              )}
            >
              {user.accessPolicy.mode === 'include' ? '+' : '−'} {accessSummary}
            </span>
            {/* Action */}
            <button
              type="button"
              onClick={() => canEdit && onEdit(user)}
              disabled={!canEdit}
              title={canEdit ? 'Modifier' : 'Non autorisé'}
              className="rounded-3xl flex items-center gap-0.5 flex-1 py-1 justify-center text-sm  border text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 border-slate-200 hover:border-indigo-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="text-xs">Editer</span>
              <Pencil1 size={20} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

function GridView({
  users,
  viewerRole,
  onEdit,
  onView,
  onDelete
}: {
  users: UserModel[]
  viewerRole: UserRole
  onEdit: (user: UserModel) => void
  onView: (user: UserModel) => void
  onDelete: (id: string) => void
}): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {users.map((user) => {
        const canEdit =
          viewerRole === 'CREATOR' || (viewerRole === 'ADMIN' && user.role === 'CLIENT')

        const accessSummary = user.accessPolicy.serverIds.includes('*')
          ? user.accessPolicy.mode === 'include'
            ? 'Tous les serveurs'
            : 'Aucun serveur'
          : `${user.accessPolicy.serverIds.length} serveur(s)`

        return (
          <div
            key={user.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{user.username}</h3>

                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex justify-end items-center gap-1">
                <button
                  type="button"
                  onClick={() => canEdit && onEdit(user)}
                  disabled={!canEdit}
                  title={canEdit ? 'Modifier' : 'Non autorisé'}
                  className="
                  size-9 rounded-xl border border-slate-200
                  flex items-center justify-center
                  text-slate-400 hover:text-indigo-500
                  hover:border-indigo-200 hover:bg-indigo-50
                  transition-all
                  disabled:opacity-30 disabled:cursor-not-allowed
                "
                >
                  <Pencil1 size={18} />
                </button>
                <IndicatorMenu
                  onView={() => {
                    onView(user)
                  }}
                  onDelete={() => {
                    onDelete(user.id)
                  }}
                />
              </div>
            </div>

            {/* Infos */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Rôle</span>

                <span
                  className={cn(
                    'text-[10px] font-semibold px-2 py-1 rounded-full border',
                    roleLabel[user.role].color
                  )}
                >
                  {roleLabel[user.role].label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Statut</span>

                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <span className={cn('size-2 rounded-full', STATUS_CFG[user.status].dot)} />
                  {STATUS_CFG[user.status].label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Accès</span>

                <span
                  className={cn(
                    'text-[10px] font-medium px-2 py-1 rounded-lg',
                    user.accessPolicy.mode === 'include'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-orange-50 text-orange-600'
                  )}
                >
                  {user.accessPolicy.mode === 'include' ? '+' : '−'} {accessSummary}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function UsersTable({
  users,
  viewerRole,
  onEdit,
  onView,
  onDelete,
  mode
}: {
  users: UserModel[]
  viewerRole: UserRole
  mode: VIEW_MODE
  onEdit: (user: UserModel) => void
  onView: (user: UserModel) => void
  onDelete: (id: string) => void
}): React.JSX.Element {
  if (users.length === 0) {
    return <EmptyState message="Aucun utilisateur trouvé" icon={<UserMultiple1 />} />
  }

  if (mode == VIEW_MODE.LIST) {
    return <ListView users={users} viewerRole={viewerRole} onEdit={onEdit} />
  }

  return (
    <GridView
      users={users}
      viewerRole={viewerRole}
      onEdit={onEdit}
      onView={onView}
      onDelete={onDelete}
    />
  )
}
