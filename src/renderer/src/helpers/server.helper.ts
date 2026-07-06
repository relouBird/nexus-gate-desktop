// ─── Helpers ──────────────────────────────────────────────────

import {
  ServerTypes,
  ServerStatusTypes,
  type Server,
  type ServerStatusType
} from '@/types/nexusgate.type'

export function getServerStatus(server: Server): ServerStatusType {
  if (server.type === ServerTypes.CLOUD) {
    return server.status === ServerStatusTypes.ONLINE
      ? ServerStatusTypes.ONLINE
      : ServerStatusTypes.OFFLINE
  }
  return server.tunnelSession?.isActive ? ServerStatusTypes.TUNNEL : ServerStatusTypes.OFFLINE
}

export function getMethodColor(method: string): string {
  const map: Record<string, string> = {
    GET: 'text-blue-600 bg-blue-50',
    POST: 'text-green-700 bg-green-50',
    PUT: 'text-amber-700 bg-amber-50',
    PATCH: 'text-amber-700 bg-amber-50',
    DELETE: 'text-red-600 bg-red-50'
  }
  return map[method] ?? 'text-gray-600 bg-gray-100'
}

export function getStatusCodeColor(code: number): string {
  if (code < 300) return 'text-green-700'
  if (code < 400) return 'text-amber-600'
  if (code < 500) return 'text-orange-600'
  return 'text-red-600'
}

export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
