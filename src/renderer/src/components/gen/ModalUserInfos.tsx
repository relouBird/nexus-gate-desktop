import { dateFormat } from '@/helpers'
import { roleLabel } from '@/helpers/user.helper'
import type { UserModel } from '@/types/nexusgate.type'
import { cn } from '@/utils/cn'

export default function ModalUserInfos({ user }: { user: UserModel }): React.JSX.Element {
  return (
    <>
      {/* Infos lecture seule */}
      <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-slate-200 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-semibold shrink-0">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">{user.email}</p>
          <p className="text-[10px] text-gray-400">Membre depuis, {dateFormat(user.createdAt)}</p>
        </div>
        <span
          className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full border ml-auto shrink-0',
            roleLabel[user.role].color
          )}
        >
          {roleLabel[user.role].label}
        </span>
      </div>
    </>
  )
}
