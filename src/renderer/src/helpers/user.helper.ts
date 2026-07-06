// ─── Générateur de mot de passe ───────────────────────────────

import type { TabActions } from '@/types'
import type { UserModel, UserRole } from '@/types/nexusgate.type'

const CHARSET = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  special: '!@#$%^&*()-_=+[]{}'
}

export function generatePassword(length = 16): string {
  const all = CHARSET.lower + CHARSET.upper + CHARSET.digits + CHARSET.special
  // Garantit au moins 1 de chaque type
  const required = [
    CHARSET.lower[Math.floor(Math.random() * CHARSET.lower.length)],
    CHARSET.upper[Math.floor(Math.random() * CHARSET.upper.length)],
    CHARSET.digits[Math.floor(Math.random() * CHARSET.digits.length)],
    CHARSET.special[Math.floor(Math.random() * CHARSET.special.length)]
  ]
  const rest = Array.from({ length: length - 4 }, () => all[Math.floor(Math.random() * all.length)])
  // Mélange
  return [...required, ...rest].sort(() => Math.random() - 0.5).join('')
}

export const roleLabel: Record<UserRole, { label: string; color: string }> = {
  CREATOR: {
    label: 'Créateur',
    color: 'bg-purple-50 text-purple-700 border border-purple-200'
  },
  ADMIN: {
    label: 'Administrateur',
    color: 'bg-blue-50 text-blue-700 border border-blue-200'
  },
  CLIENT: {
    label: 'Client',
    color: 'bg-gray-100 text-gray-600 border border-gray-300'
  }
}

export const TABS_USERS: TabActions<UserModel>[] = [
  {
    label: 'Tous',
    value: 'all',
    action: (data: UserModel) => {
      return data.id != null
    }
  },
  {
    label: 'Authentifié',
    value: 'active',
    action: (i: UserModel) => {
      return i.status == 'authenticated'
    }
  },
  {
    label: 'Non Authentifié',
    value: 'old',
    action: (i: UserModel) => {
      return i.status == 'unauthenticated'
    }
  }
]
