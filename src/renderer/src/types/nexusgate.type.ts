// types/nexusgate.ts
// Types calés exactement sur le schéma Prisma NexusGate

// ─── ENUMS ────────────────────────────────────────────────────

export type UserRole = 'CREATOR' | 'ADMIN' | 'CLIENT'
export type UserStatus = 'authenticated' | 'unauthenticated' | 'AUTHENTICATED' | 'UNAUTHENTICATED'
export type ServerType = 'CLOUD' | 'LOCAL'
export type RuleType =
  | 'IP_BLACKLIST'
  | 'IP_WHITELIST'
  | 'COUNTRY_BLACKLIST'
  | 'COUNTRY_WHITELIST'
  | 'CONTINENT_BLACKLIST'
  | 'RATE_LIMIT'
  | 'USER_AGENT_BLOCK'
  | 'PATH_BLOCK'
  | 'TOR_BLOCK'
  | 'REPUTATION_BLOCK'
export type ActionType = 'DENY' | 'ALLOW' | 'CHALLENGE' | 'LOG' | 'REDIRECT'

export type ServerStatusType = 'ONLINE' | 'OFFLINE' | 'TUNNEL' | 'ERROR'

// ─── ENUMERATION ─────────────────────────────────────────────

export const UserRoles = {
  CREATOR: 'CREATOR',
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT'
} as const

export const ServerTypes = {
  CLOUD: 'CLOUD',
  LOCAL: 'LOCAL'
} as const

export const RuleTypes = {
  IP_BLACKLIST: 'IP_BLACKLIST',
  IP_WHITELIST: 'IP_WHITELIST',
  COUNTRY_BLACKLIST: 'COUNTRY_BLACKLIST',
  COUNTRY_WHITELIST: 'COUNTRY_WHITELIST',
  CONTINENT_BLACKLIST: 'CONTINENT_BLACKLIST',
  RATE_LIMIT: 'RATE_LIMIT',
  USER_AGENT_BLOCK: 'USER_AGENT_BLOCK',
  PATH_BLOCK: 'PATH_BLOCK',
  TOR_BLOCK: 'TOR_BLOCK',
  REPUTATION_BLOCK: 'REPUTATION_BLOCK'
} as const

export const ActionTypes = {
  DENY: 'DENY',
  ALLOW: 'ALLOW',
  CHALLENGE: 'CHALLENGE',
  LOG: 'LOG',
  REDIRECT: 'REDIRECT'
} as const

export const ServerStatusTypes = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  TUNNEL: 'TUNNEL',
  ERROR: 'ERROR'
} as const

// ─── MODELS ───────────────────────────────────────────────────

export interface AccessPolicy {
  mode: 'include' | 'exclude'
  serverIds: string[] // ["*"] = tous
}

export interface ScopeToken {
  gatewayTokenId: string
  serverId: string
  createdAt: string
}

export interface TunnelSession {
  id: string
  serverId: string
  connectedAt: string
  lastPingAt: string
  isActive: boolean
}

export interface Server {
  id: string
  name: string
  identifier: string
  url: string
  type: ServerType
  teamId: string
  status: ServerStatusType
  headers: Record<string, string>
  requireToken: boolean
  tunnelSession: TunnelSession | null
  rulesCount: number
  createdAt: string
  updatedAt: string
}

export interface GatewayToken {
  id: string
  name: string
  value: string
  scope: ScopeToken[] // "*" ou "id1,id2,..."
  userId: string
  teamId: string
  revoked: boolean
  createdAt: string
}

export interface Rule {
  id: string
  serverId: string
  type: RuleType
  condition: Record<string, unknown>
  action: ActionType
  priority: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RequestLog {
  id: string
  serverId: string
  serverName: string // enrichi côté frontend
  timestamp: string
  clientIp: string
  method: string
  path: string
  statusCode: number
  latencyMs: number
  gatewayTokenId: string | null
  via: 'cloud' | 'tunnel'
}

export interface UserModel {
  id: string
  email: string
  username: string
  role: UserRole
  status: UserStatus
  accessPolicy: AccessPolicy
  teamId: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  initials?: string // calculé côté client

  [key: string]: unknown // Signature d'index
}

export interface TeamModel {
  id: string
  name: string
  slug: string
  createdAt: Date | string
  updatedAt: Date | string
}

// ─── STATS DASHBOARD ──────────────────────────────────────────

export interface DashboardStats {
  servers: {
    total: number
    cloud: number
    local: number
    tunnelOnline: number
  }
  tokens: {
    total: number
    active: number
    revoked: number
  }
  rules: {
    total: number
    active: number
  }
  members: {
    total: number
  }
  requests24h: {
    total: number
    success: number
    errors: number
    avgLatencyMs: number
    blockedByRules: number
  }
}
