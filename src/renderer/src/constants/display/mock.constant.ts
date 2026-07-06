// data/mock.ts
// Données statiques calées sur le schéma Prisma NexusGate

import {
  type Server,
  type GatewayToken,
  type Rule,
  type RequestLog,
  type DashboardStats,
  ServerStatusTypes,
  ServerTypes
} from '@/types/nexusgate.type'

// ─── SERVERS ──────────────────────────────────────────────────

export const MOCK_SERVERS: Server[] = [
  {
    id: 'srv-001',
    name: 'API Production',
    identifier: 'api-production-a1b2c3d4',
    url: 'https://api.techcorp.com',
    status: ServerStatusTypes.ONLINE,
    type: ServerTypes.CLOUD,
    headers: {},
    teamId: 'team-001',
    requireToken: true,
    tunnelSession: null,
    rulesCount: 5,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-06-01T10:30:00Z'
  },
  {
    id: 'srv-002',
    name: 'API Staging',
    identifier: 'api-staging-b2c3d4e5',
    url: 'https://staging.techcorp.com',
    status: ServerStatusTypes.ONLINE,
    headers: {},
    type: ServerTypes.CLOUD,
    teamId: 'team-001',
    requireToken: false,
    tunnelSession: null,
    rulesCount: 2,
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-05-20T14:00:00Z'
  },
  {
    id: 'srv-003',
    name: 'Dev Local',
    identifier: 'dev-local-c3d4e5f6',
    url: '',
    type: ServerTypes.LOCAL,
    status: ServerStatusTypes.ONLINE,
    teamId: 'team-001',
    requireToken: true,
    headers: {},
    tunnelSession: {
      id: 'tun-001',
      serverId: 'srv-003',
      connectedAt: '2025-06-15T07:45:00Z',
      lastPingAt: '2025-06-15T11:58:00Z',
      isActive: true
    },
    rulesCount: 3,
    createdAt: '2025-03-05T11:00:00Z',
    updatedAt: '2025-06-15T07:45:00Z'
  },
  {
    id: 'srv-004',
    name: 'Test Bench',
    identifier: 'test-bench-d4e5f6g7',
    url: '',
    type: ServerTypes.LOCAL,
    status: ServerStatusTypes.OFFLINE,
    teamId: 'team-001',
    requireToken: false,
    headers: {},
    tunnelSession: {
      id: 'tun-002',
      serverId: 'srv-004',
      connectedAt: '2025-06-14T16:00:00Z',
      lastPingAt: '2025-06-14T18:30:00Z',
      isActive: false
    },
    rulesCount: 0,
    createdAt: '2025-04-20T15:00:00Z',
    updatedAt: '2025-06-14T18:30:00Z'
  },
  {
    id: 'srv-005',
    name: 'Auth Microservice',
    identifier: 'auth-microservice-e5f6g7h8',
    url: 'https://auth.techcorp.com',
    headers: {},
    type: ServerTypes.CLOUD,
    status: ServerStatusTypes.OFFLINE,
    teamId: 'team-001',
    requireToken: true,
    tunnelSession: null,
    rulesCount: 8,
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-06-10T09:00:00Z'
  }
]

// ─── GATEWAY TOKENS ───────────────────────────────────────────

export const MOCK_TOKENS: GatewayToken[] = [
  {
    id: 'tok-001',
    name: 'Mobile App Token',
    value: 'gw_mobileapp_xxxxxxxxxxxx',
    scope: [],
    userId: 'usr-001',
    teamId: 'team-001',
    revoked: false,
    createdAt: '2025-03-01T08:00:00Z'
  },
  {
    id: 'tok-002',
    name: 'CI/CD Pipeline',
    value: 'gw_cicd_xxxxxxxxxxxx',
    scope: [],
    userId: 'usr-001',
    teamId: 'team-001',
    revoked: false,
    createdAt: '2025-04-10T09:00:00Z'
  },
  {
    id: 'tok-003',
    name: 'Partenaire externe',
    value: 'gw_partner_xxxxxxxxxxxx',
    scope: [{ gatewayTokenId: 'scope-003', serverId: 'srv-001', createdAt: '' }],
    userId: 'usr-002',
    teamId: 'team-001',
    revoked: false,
    createdAt: '2025-05-15T11:00:00Z'
  },
  {
    id: 'tok-004',
    name: 'Token legacy (révoqué)',
    value: 'gw_legacy_xxxxxxxxxxxx',
    scope: [],
    userId: 'usr-001',
    teamId: 'team-001',
    revoked: true,
    createdAt: '2025-01-05T08:00:00Z'
  },
  {
    id: 'tok-005',
    name: 'Dashboard interne',
    value: 'gw_dashboard_xxxxxxxxxxxx',
    scope: [],
    userId: 'usr-003',
    teamId: 'team-001',
    revoked: false,
    createdAt: '2025-06-01T08:00:00Z'
  }
]

// ─── RULES ────────────────────────────────────────────────────

export const MOCK_RULES: Rule[] = [
  {
    id: 'rule-001',
    serverId: 'srv-001',
    type: 'IP_BLACKLIST',
    condition: { values: ['192.168.0.0/16', '10.0.0.0/8'] },
    action: 'DENY',
    priority: 100,
    isActive: true,
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-01T10:00:00Z'
  },
  {
    id: 'rule-002',
    serverId: 'srv-001',
    type: 'RATE_LIMIT',
    condition: { maxRequests: 100, windowSeconds: 60 },
    action: 'CHALLENGE',
    priority: 90,
    isActive: true,
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-01T10:00:00Z'
  },
  {
    id: 'rule-003',
    serverId: 'srv-001',
    type: 'COUNTRY_BLACKLIST',
    condition: { countries: ['CN', 'RU', 'IR'] },
    action: 'DENY',
    priority: 80,
    isActive: true,
    createdAt: '2025-02-05T10:00:00Z',
    updatedAt: '2025-02-05T10:00:00Z'
  },
  {
    id: 'rule-004',
    serverId: 'srv-001',
    type: 'TOR_BLOCK',
    condition: {},
    action: 'DENY',
    priority: 70,
    isActive: true,
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2025-02-10T10:00:00Z'
  },
  {
    id: 'rule-005',
    serverId: 'srv-001',
    type: 'USER_AGENT_BLOCK',
    condition: { patterns: ['curl', 'python-requests'] },
    action: 'DENY',
    priority: 60,
    isActive: false,
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-01T10:00:00Z'
  },
  {
    id: 'rule-006',
    serverId: 'srv-002',
    type: 'RATE_LIMIT',
    condition: { maxRequests: 50, windowSeconds: 60 },
    action: 'CHALLENGE',
    priority: 100,
    isActive: true,
    createdAt: '2025-03-15T10:00:00Z',
    updatedAt: '2025-03-15T10:00:00Z'
  },
  {
    id: 'rule-007',
    serverId: 'srv-002',
    type: 'PATH_BLOCK',
    condition: { paths: ['/admin', '/.env', '/wp-admin'] },
    action: 'DENY',
    priority: 90,
    isActive: true,
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-03-20T10:00:00Z'
  },
  {
    id: 'rule-008',
    serverId: 'srv-003',
    type: 'IP_WHITELIST',
    condition: { values: ['203.0.113.0/24'] },
    action: 'ALLOW',
    priority: 100,
    isActive: true,
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-01T10:00:00Z'
  },
  {
    id: 'rule-009',
    serverId: 'srv-005',
    type: 'REPUTATION_BLOCK',
    condition: { minScore: 30 },
    action: 'DENY',
    priority: 100,
    isActive: true,
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2025-02-15T10:00:00Z'
  }
]

// ─── REQUEST LOGS (24h simulés) ───────────────────────────────

export const MOCK_RECENT_LOGS: RequestLog[] = [
  {
    id: 'log-001',
    serverId: 'srv-001',
    serverName: 'API Production',
    timestamp: '2025-06-15T11:55:00Z',
    clientIp: '203.0.113.42',
    method: 'GET',
    path: '/v1/users/42',
    statusCode: 200,
    latencyMs: 45,
    gatewayTokenId: 'tok-001',
    via: 'cloud'
  },
  {
    id: 'log-002',
    serverId: 'srv-001',
    serverName: 'API Production',
    timestamp: '2025-06-15T11:54:30Z',
    clientIp: '198.51.100.7',
    method: 'POST',
    path: '/v1/orders',
    statusCode: 201,
    latencyMs: 112,
    gatewayTokenId: 'tok-002',
    via: 'cloud'
  },
  {
    id: 'log-003',
    serverId: 'srv-003',
    serverName: 'Dev Local',
    timestamp: '2025-06-15T11:53:00Z',
    clientIp: '127.0.0.1',
    method: 'GET',
    path: '/api/health',
    statusCode: 200,
    latencyMs: 8,
    gatewayTokenId: null,
    via: 'tunnel'
  },
  {
    id: 'log-004',
    serverId: 'srv-001',
    serverName: 'API Production',
    timestamp: '2025-06-15T11:52:00Z',
    clientIp: '192.0.2.99',
    method: 'DELETE',
    path: '/v1/users/15',
    statusCode: 403,
    latencyMs: 22,
    gatewayTokenId: 'tok-003',
    via: 'cloud'
  },
  {
    id: 'log-005',
    serverId: 'srv-005',
    serverName: 'Auth Microservice',
    timestamp: '2025-06-15T11:51:00Z',
    clientIp: '203.0.113.10',
    method: 'POST',
    path: '/auth/login',
    statusCode: 429,
    latencyMs: 15,
    gatewayTokenId: null,
    via: 'cloud'
  },
  {
    id: 'log-006',
    serverId: 'srv-002',
    serverName: 'API Staging',
    timestamp: '2025-06-15T11:49:00Z',
    clientIp: '10.0.0.55',
    method: 'GET',
    path: '/v2/products',
    statusCode: 200,
    latencyMs: 67,
    gatewayTokenId: 'tok-002',
    via: 'cloud'
  },
  {
    id: 'log-007',
    serverId: 'srv-001',
    serverName: 'API Production',
    timestamp: '2025-06-15T11:48:00Z',
    clientIp: '198.51.100.200',
    method: 'PATCH',
    path: '/v1/profile',
    statusCode: 200,
    latencyMs: 89,
    gatewayTokenId: 'tok-001',
    via: 'cloud'
  },
  {
    id: 'log-008',
    serverId: 'srv-003',
    serverName: 'Dev Local',
    timestamp: '2025-06-15T11:45:00Z',
    clientIp: '127.0.0.1',
    method: 'POST',
    path: '/api/test/webhook',
    statusCode: 500,
    latencyMs: 3240,
    gatewayTokenId: null,
    via: 'tunnel'
  }
]

// ─── STATS PRÉ-CALCULÉES (simulées depuis RequestLog 24h) ─────

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  servers: {
    total: MOCK_SERVERS.length,
    cloud: MOCK_SERVERS.filter((s) => s.type === 'CLOUD').length,
    local: MOCK_SERVERS.filter((s) => s.type === 'LOCAL').length,
    tunnelOnline: MOCK_SERVERS.filter((s) => s.tunnelSession?.isActive).length
  },
  tokens: {
    total: MOCK_TOKENS.length,
    active: MOCK_TOKENS.filter((t) => !t.revoked).length,
    revoked: MOCK_TOKENS.filter((t) => t.revoked).length
  },
  rules: {
    total: MOCK_RULES.length,
    active: MOCK_RULES.filter((r) => r.isActive).length
  },
  members: {
    total: 12
  },
  requests24h: {
    total: 12840,
    success: 10920,
    errors: 1920,
    avgLatencyMs: 87,
    blockedByRules: 340
  }
}
