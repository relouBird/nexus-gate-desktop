import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { EventEmitter } from 'events'
import { join } from 'path'
import { AgentEvent, TunnelStartConfig, TunnelState, TunnelStatus } from './type'
import { createWriteStream, existsSync, mkdirSync, WriteStream } from 'fs'

const FORCE_KILL_TIMEOUT_MS = 2000
const MAX_LOG_LINES = 200

interface ManagedTunnel {
  process: ChildProcessWithoutNullStreams
  config: TunnelStartConfig
  state: TunnelState
  stdoutBuffer: string
  logs: string[]
  logStream: WriteStream
  logFilePath: string
  shutdownTimer?: NodeJS.Timeout
  forceKillTimer?: NodeJS.Timeout
}

/**
 * Événements émis :
 * - 'status' (serverId: string, status: TunnelStatus)
 * - 'event'  (serverId: string, event: AgentEvent)
 * - 'log'    (serverId: string, line: string)
 */
export class TunnelProcessManager extends EventEmitter {
  private tunnels = new Map<string, ManagedTunnel>()
  private isPackaged = false

  start(config: TunnelStartConfig, isPackaged: boolean): void {
    if (this.tunnels.has(config.serverId)) {
      console.warn(`[TunnelManager] Tunnel déjà lancé pour server=${config.serverId}, ignoré`)
      return
    }

    this.isPackaged = isPackaged

    const exe = this.isPackaged
      ? join(process.resourcesPath, 'bin', 'nexus-agent.exe')
      : join(process.cwd(), 'resources', 'bin', 'nexus-agent.exe')
    const args: string[] = ['--token', config.token, '--server-id', config.serverId]

    console.log('Path resources path: ', exe)

    if (config.localTarget) args.push('--local-target', config.localTarget)
    if (config.url) args.push('--url', config.url)

    const child = spawn(exe, args, { stdio: ['pipe', 'pipe', 'pipe'] })

    console.log('PID =', child.pid)

    const logsDir = this.resolveLogsDir()
    const logFilePath = join(logsDir, `${config.serverId}.log`)
    const logStream = createWriteStream(logFilePath, { flags: 'a' })

    const managed: ManagedTunnel = {
      process: child,
      config,
      state: { serverId: config.serverId, status: 'starting', startedAt: Date.now() },
      stdoutBuffer: '',
      logs: [],
      logStream,
      logFilePath
    }
    this.tunnels.set(config.serverId, managed)

    this.writeToFile(
      config.serverId,
      `[TunnelManager] Démarrage server=${config.serverId} pid=${child.pid}`
    )

    child.stdout.on('data', (chunk) => this.handleStdout(config.serverId, chunk.toString()))
    child.stderr.on('data', (chunk) =>
      this.pushLog(config.serverId, `[stderr] ${chunk.toString().trim()}`)
    )

    child.on('error', (err) => {
      console.error(`[TunnelManager] Échec spawn server=${config.serverId}:`, err.message)
      this.setStatus(config.serverId, 'error')
      this.tunnels.delete(config.serverId)
    })

    child.on('exit', (code, signal) => {
      const tunnel = this.tunnels.get(config.serverId)
      if (tunnel) {
        tunnel.state.exitCode = code
        tunnel.state.exitSignal = signal
        if (tunnel.shutdownTimer) clearTimeout(tunnel.shutdownTimer)
        if (tunnel.forceKillTimer) clearTimeout(tunnel.forceKillTimer)
      }

      const status: TunnelStatus = code === 0 || signal === 'SIGTERM' ? 'stopped' : 'crashed'
      this.writeToFile(
        config.serverId,
        `[TunnelManager] Terminé code=${code} signal=${signal} status=${status}`
      )
      this.setStatus(config.serverId, status)
      this.tunnels.delete(config.serverId)

      console.log(
        `[TunnelManager] Agent terminé server=${config.serverId} code=${code} signal=${signal}`
      )

      // Fermeture du stream après la dernière écriture — sinon la ligne
      // ci-dessus risque de ne jamais atteindre le disque.
      if (tunnel) {
        tunnel.logStream.end(() => {
          this.tunnels.delete(config.serverId)
        })
      } else {
        this.tunnels.delete(config.serverId)
      }
    })

    this.setStatus(config.serverId, 'starting')
  }

  /**
   * Arrêt propre : ordre de fermeture via stdin, l'agent ferme sa WebSocket
   * avec ws.close(1000) puis quitte de lui-même. Si pas de réaction dans le
   * délai imparti : SIGTERM, puis SIGKILL en dernier recours.
   */
  stop(serverId: string): Promise<void> {
    const tunnel = this.tunnels.get(serverId)
    if (!tunnel) return Promise.resolve()

    return new Promise((resolve) => {
      this.setStatus(serverId, 'stopping')

      tunnel.process.once('exit', () => {
        if (tunnel.forceKillTimer) clearTimeout(tunnel.forceKillTimer)
        this.tunnels.delete(serverId)
        resolve()
      })

      console.log(`[TunnelManager] Arrêt du tunnel ${serverId}`)

      tunnel.process.kill('SIGTERM')

      tunnel.forceKillTimer = setTimeout(() => {
        if (!tunnel.process.killed) {
          console.warn(`[TunnelManager] L'agent ne répond pas, SIGKILL server=${serverId}`)
          tunnel.process.kill('SIGKILL')
        }
      }, FORCE_KILL_TIMEOUT_MS)
    })
  }

  async restart(serverId: string): Promise<void> {
    const config = this.tunnels.get(serverId)?.config
    if (!config) {
      console.warn(`[TunnelManager] Restart impossible, config introuvable pour server=${serverId}`)
      return
    }
    await this.stop(serverId)
    this.start(config, this.isPackaged)
  }

  status(serverId: string): TunnelStatus | 'not-found' {
    return this.tunnels.get(serverId)?.state.status ?? 'not-found'
  }

  logs(serverId: string): string[] {
    return this.tunnels.get(serverId)?.logs ?? []
  }

  isRunning(serverId: string): boolean {
    return this.tunnels.has(serverId)
  }

  /** Utilisé sur 'before-quit' pour éviter des process orphelins. */
  async stopAll(): Promise<void> {
    const ids = [...this.tunnels.keys()]
    await Promise.all(ids.map((id) => this.stop(id)))
  }

  private handleStdout(serverId: string, chunk: string): void {
    const tunnel = this.tunnels.get(serverId)
    if (!tunnel) return

    tunnel.stdoutBuffer += chunk
    const lines = tunnel.stdoutBuffer.split('\n')
    tunnel.stdoutBuffer = lines.pop() ?? '' // ligne potentiellement incomplète

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      this.pushLog(serverId, trimmed)

      const parsed = this.tryParseEvent(trimmed)
      if (!parsed) continue // log texte brut — pas structuré, pas bloquant

      this.emit('event', serverId, parsed)

      switch (parsed.event) {
        case 'connected':
          this.setStatus(serverId, 'connected')
          break
        case 'disconnected':
        case 'reconnecting':
          this.setStatus(serverId, 'reconnecting')
          break
        case 'error':
          this.setStatus(serverId, 'error')
          break
        default:
          break
      }
    }
  }

  private tryParseEvent(line: string): AgentEvent | null {
    try {
      const parsed = JSON.parse(line)
      return typeof parsed?.event === 'string' ? (parsed as AgentEvent) : null
    } catch {
      return null
    }
  }

  private pushLog(serverId: string, line: string): void {
    const tunnel = this.tunnels.get(serverId)
    if (!tunnel) return
    tunnel.logs.push(line)
    if (tunnel.logs.length > MAX_LOG_LINES) tunnel.logs.shift()
    this.writeToFile(serverId, line)
    this.emit('log', serverId, line)
  }

  private setStatus(serverId: string, status: TunnelStatus): void {
    const tunnel = this.tunnels.get(serverId)
    if (tunnel) tunnel.state.status = status
    this.writeToFile(serverId, `[TunnelManager] status=${status}`)
    this.emit('status', serverId, status)
  }

  // Afin d'ecrire dans les logs
  private resolveLogsDir(): string {
    const dir = this.isPackaged
      ? join(process.resourcesPath, 'bin', 'logs')
      : join(process.cwd(), 'resources', 'bin', 'logs')

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    return dir
  }

  private writeToFile(serverId: string, line: string): void {
    const tunnel = this.tunnels.get(serverId)
    if (!tunnel || tunnel.logStream.destroyed) return
    const timestamp = new Date().toISOString()
    tunnel.logStream.write(`[${timestamp}] ${line}\n`)
  }

  logFilePath(serverId: string): string | null {
    return this.tunnels.get(serverId)?.logFilePath ?? null
  }
}
