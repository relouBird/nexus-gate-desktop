export interface SocketCreatePayload {
  token: string
  serverId: string
  localTarget?: string
  url?: string
}

export type TunnelStatus =
  | 'starting'
  | 'connected'
  | 'reconnecting'
  | 'stopping'
  | 'stopped'
  | 'crashed'
  | 'error'

export interface TunnelStartConfig {
  serverId: string
  token: string
  localTarget?: string
  url?: string
}

export interface AgentEvent {
  event: 'connected' | 'disconnected' | 'reconnecting' | 'error' | string
  data?: Record<string, unknown>
}

export interface TunnelState {
  serverId: string
  status: TunnelStatus
  startedAt: number
  exitCode?: number | null
  exitSignal?: NodeJS.Signals | null
}
