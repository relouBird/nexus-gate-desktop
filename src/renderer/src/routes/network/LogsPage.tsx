// pages/LogsPage.tsx
import { Overlay } from '@/components/display/Overlay'
import { PageHeader } from '@/components/gen/PageHeader'
import { LogsTable, LogDetailDrawer } from '@/components/network/LogsTable'
import { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { useLogStore, selectLogPages } from '@/stores/logs.store'
import { useServerStore } from '@/stores/server.store'
import { useNotify } from '@/helpers/notifications.helper'
import type { RequestLog } from '@/types/nexusgate.type'
import type { GetLogsParams } from '@/types/logs.type'
import { cn } from '@/utils/cn'
import { Search1 } from '@tailgrids/icons'

// ─── Constantes filtres ───────────────────────────────────────

const METHODS = ['ALL', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const
const STATUS_GROUPS = ['ALL', '2xx', '3xx', '4xx', '5xx'] as const
const VIA_OPTIONS = ['ALL', 'cloud', 'tunnel'] as const
const LIMIT_OPTIONS = [20, 50, 100] as const

type MethodFilter = (typeof METHODS)[number]
type StatusFilter = (typeof STATUS_GROUPS)[number]
type ViaFilter = (typeof VIA_OPTIONS)[number]

// ─── Helpers ──────────────────────────────────────────────────

/** Applique le filtre de groupe de statut côté client */
function matchesStatusGroup(statusCode: number, group: StatusFilter): boolean {
  if (group === 'ALL') return true
  const prefix = parseInt(group[0])
  return Math.floor(statusCode / 100) === prefix
}

// ─── Pagination ───────────────────────────────────────────────

function PaginationBar({
  page,
  pages,
  total,
  limit,
  onPrev,
  onNext,
  onLimitChange
}: {
  page: number
  pages: number
  total: number
  limit: number
  onPrev: () => void
  onNext: () => void
  onLimitChange: (l: number) => void
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between text-xs text-foreground-soft-500 flex-wrap gap-2">
      <span>
        <span className="font-semibold text-title-50">{total}</span> log
        {total !== 1 ? 's' : ''}
        {pages > 1 && (
          <>
            {' '}
            — page <span className="font-semibold text-title-50">{page}</span>/{pages}
          </>
        )}
      </span>

      <div className="flex items-center gap-2">
        {/* Limite */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">Afficher</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            aria-label="Nombre de logs par page"
            className="text-xs border border-base-200 rounded-lg px-2 py-1 bg-background-50 text-foreground-soft-500 focus:outline-none focus:border-primary-400"
          >
            {LIMIT_OPTIONS.map((l) => (
              <option key={l} value={l}>
                {l} / page
              </option>
            ))}
          </select>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={page <= 1}
            className="px-2.5 py-1 rounded-lg border border-base-200 bg-background-50 hover:bg-background-soft-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium"
            aria-label="Page précédente"
          >
            ←
          </button>
          <button
            onClick={onNext}
            disabled={page >= pages}
            className="px-2.5 py-1 rounded-lg border border-base-200 bg-background-50 hover:bg-background-soft-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium"
            aria-label="Page suivante"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Stats bar ────────────────────────────────────────────────

function StatsBar({ logs }: { logs: RequestLog[] }): React.JSX.Element {
  const byMethod = (m: string): number => logs.filter((l) => l.method === m).length
  const by4xx = logs.filter((l) => Math.floor(l.statusCode / 100) === 4).length
  const by5xx = logs.filter((l) => Math.floor(l.statusCode / 100) === 5).length

  return (
    <div className="flex items-center gap-3 text-[10px] flex-wrap">
      <span className="text-foreground-soft-500">
        <span className="font-semibold text-title-50">{logs.length}</span> affichés
      </span>
      <span className="text-base-300">|</span>
      {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const).map((m) => {
        const count = byMethod(m)
        if (count === 0) return null
        return (
          <span key={m} className="text-foreground-soft-500">
            <span
              className={cn(
                'font-semibold',
                m === 'GET' && 'text-primary-600',
                m === 'POST' && 'text-success-600',
                m === 'DELETE' && 'text-error-500',
                (m === 'PUT' || m === 'PATCH') && 'text-warning-600'
              )}
            >
              {count}
            </span>{' '}
            {m}
          </span>
        )
      })}
      {by4xx > 0 && <span className="text-warning-600 font-semibold">{by4xx} 4xx</span>}
      {by5xx > 0 && <span className="text-error-500 font-semibold">{by5xx} 5xx</span>}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────

export default function LogsPage(): React.JSX.Element {
  const notify = useNotify()

  // Stores
  const { logs, total, getLogs } = useStore(useLogStore)
  const pages = useStore(useLogStore, selectLogPages)
  const { servers, getManyServer } = useStore(useServerStore)

  // ── États de filtre ─────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterServer, setFilterServer] = useState<string>('ALL')
  const [filterMethod, setFilterMethod] = useState<MethodFilter>('ALL')
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('ALL')
  const [filterVia, setFilterVia] = useState<ViaFilter>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState<number>(20)

  // ── Détail drawer ────────────────────────────────────────────
  const [selectedLog, setSelectedLog] = useState<RequestLog | null>(null)

  // ── Charge les serveurs une seule fois ───────────────────────
  useEffect(() => {
    getManyServer(notify).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function fetchLogs(page: number = currentPage): Promise<void> {
      setIsLoading(true)
      try {
        if (currentPage !== 1) {
          setCurrentPage(1)
          return
        }
        const params: GetLogsParams = {
          page,
          limit
        }

        if (filterServer !== 'ALL') params.serverIds = [filterServer]
        if (filterMethod !== 'ALL') params.method = filterMethod
        if (filterVia !== 'ALL') params.via = filterVia
        // statusCode : on filtre par groupe côté client (voir ci-dessous)
        // Le backend ne supporte que le code exact, pas les groupes

        await getLogs(params, notify)
      } catch {
        // Erreur déjà notifiée par le store
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, filterServer, filterMethod, filterVia])

  // ── Filtrage client : recherche texte + groupe status ─────────
  const displayed = logs.filter((log) => {
    if (search) {
      const t = search.toLowerCase()
      if (
        !log.path.toLowerCase().includes(t) &&
        !log.clientIp.includes(t) &&
        !log.serverName.toLowerCase().includes(t) &&
        !String(log.statusCode).includes(t)
      )
        return false
    }
    if (!matchesStatusGroup(log.statusCode, filterStatus)) return false
    return true
  })

  return (
    <div>
      <PageHeader
        title="Journaux de requêtes"
        description="Toutes les requêtes transitant par NexusGate"
      />

      <Overlay visible={isLoading} text="Chargement des journaux...">
        <div className="flex flex-col gap-3 mt-4">
          {/* ── Barre de filtres ── */}
          <div className="bg-white border border-base-200 rounded-xl p-4 flex flex-col gap-3">
            {/* Recherche */}
            <div className="relative">
              <Search1 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-soft-500/40 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par chemin, IP, serveur ou code HTTP…"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-base-200 rounded-xl bg-background-50 text-title-50 placeholder:text-foreground-soft-500/40 focus:outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-400 transition"
              />
            </div>

            {/* Filtres ligne 2 */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Serveur */}
              <select
                value={filterServer}
                onChange={(e) => setFilterServer(e.target.value)}
                aria-label="Filtrer par serveur"
                className="text-xs border border-base-200 rounded-lg px-3 py-1.5 bg-background-50 text-foreground-soft-500 focus:outline-none focus:border-primary-400 transition"
              >
                <option value="ALL">Tous les serveurs</option>
                {servers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              {/* Méthode — pills */}
              <div className="flex items-center bg-background-soft-100 rounded-lg p-0.5 gap-0.5">
                {METHODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMethod(m)}
                    className={cn(
                      'px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors',
                      filterMethod === m
                        ? 'bg-white text-title-50 shadow-sm'
                        : 'text-foreground-soft-500 hover:text-title-50'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
                aria-label="Filtrer par code de statut"
                className="text-xs border border-base-200 rounded-lg px-3 py-1.5 bg-background-50 text-foreground-soft-500 focus:outline-none focus:border-primary-400 transition"
              >
                {STATUS_GROUPS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'ALL' ? 'Tous les codes' : s}
                  </option>
                ))}
              </select>

              {/* Via */}
              <select
                value={filterVia}
                onChange={(e) => setFilterVia(e.target.value as ViaFilter)}
                aria-label="Filtrer par origine"
                className="text-xs border border-base-200 rounded-lg px-3 py-1.5 bg-background-50 text-foreground-soft-500 focus:outline-none focus:border-primary-400 transition"
              >
                {VIA_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v === 'ALL' ? 'Toutes origines' : v === 'cloud' ? 'Cloud' : 'Tunnel'}
                  </option>
                ))}
              </select>

              {/* Stats */}
              <div className="ml-auto">
                <StatsBar logs={displayed} />
              </div>
            </div>
          </div>

          {/* ── Tableau ── */}
          <LogsTable logs={displayed} onRowClick={setSelectedLog} />

          {/* ── Pagination ── */}
          {pages > 0 && (
            <PaginationBar
              page={currentPage}
              pages={pages}
              total={total}
              limit={limit}
              onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
              onNext={() => setCurrentPage((p) => Math.min(pages, p + 1))}
              onLimitChange={(l) => {
                setLimit(l)
                setCurrentPage(1)
              }}
            />
          )}
        </div>
      </Overlay>

      {/* ── Drawer détail ── */}
      {selectedLog && <LogDetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  )
}
